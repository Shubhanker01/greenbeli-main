const { createClient } = require("@supabase/supabase-js")
const { randomUUID } = require("node:crypto")
/**
 * Supabase Storage helpers for product images.
 *
 * Environment variables:
 *   SUPABASE_URL                  your project URL
 *   SUPABASE_SERVICE_ROLE_KEY     server-side only key (never send it to the browser)
 *   SUPABASE_BUCKET               bucket name (default "product-images")
 *
 * The bucket should be PUBLIC if you want to show images with the plain public URL.
 * Files must come from multer's memoryStorage() so they have a `buffer`.
 *
 * (CommonJS project? Use `require(...)` for the imports and `module.exports = {...}`.)
 */

const BUCKET = process.env.SUPABASE_BUCKET || "product-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB per image

/** Error with an HTTP status, so a controller can answer with it directly. */
class ImageUploadError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.name = "ImageUploadError";
        this.status = status;
        this.statusCode = status;
    }
}

let adminClient;
function getAdminClient() {
    if (!adminClient) {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
        }
        // Server-side client: uses the service role, keeps no session
        adminClient = createClient(url, key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    return adminClient;
}

/**
 * Works out the real image type from the file's first bytes.
 * The `mimetype` and filename sent by the browser can be faked, the bytes can't.
 */
function detectImageType(buf) {
    if (!Buffer.isBuffer(buf) || buf.length < 12) return null;

    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        return { mime: "image/jpeg", ext: "jpg" };
    }
    if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        return { mime: "image/png", ext: "png" };
    }
    if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
        return { mime: "image/webp", ext: "webp" };
    }
    return null;
}

/** Checks one multer file and returns what's needed to upload it. */
function inspectFile(file) {
    if (!file || !Buffer.isBuffer(file.buffer)) {
        throw new ImageUploadError(
            "Image has no data. Use multer.memoryStorage() so files have a buffer.",
            500
        );
    }
    if (file.buffer.length === 0) throw new ImageUploadError("Image file is empty");
    if (file.buffer.length > MAX_IMAGE_BYTES) {
        throw new ImageUploadError(`Image is too large (max ${MAX_IMAGE_BYTES / 1024 / 1024} MB)`);
    }
    const type = detectImageType(file.buffer);
    if (!type) throw new ImageUploadError("Only JPG, PNG or WEBP images are allowed");
    return type;
}

/** Folder names are ours, never user input, but keep them safe anyway. */
function safeFolder(folder) {
    if (!/^[a-z0-9_-]+(\/[a-z0-9_-]+)*$/i.test(folder)) {
        throw new Error(`Invalid storage folder: ${folder}`);
    }
    return folder;
}

/** products/2026/10/<random-uuid>.jpg : the user's filename is never used. */
function buildPath(folder, ext) {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    return `${safeFolder(folder)}/${yyyy}/${mm}/${randomUUID()}.${ext}`;
}

async function putFile(client, file, type, folder) {
    const path = buildPath(folder, type.ext);
    const { error } = await client.storage.from(BUCKET).upload(path, file.buffer, {
        contentType: type.mime, // from the real bytes, not from the browser
        cacheControl: "31536000", // 1 year: every file has a unique name
        upsert: false,
    });
    if (error) throw new ImageUploadError(`Image upload failed: ${error.message}`, 502);

    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return { path, url: data.publicUrl };
}

/**
 * Uploads ONE multer file.
 * @returns {Promise<{ path: string, url: string }>}  path = for deleting later, url = to show
 */
async function uploadImage(file, options = {}) {
    const type = inspectFile(file);
    const folder = options.folder || "products";
    const client = options.client || getAdminClient();
    return putFile(client, file, type, folder);
}

/**
 * Uploads several multer files. All files are checked BEFORE anything is uploaded, and if
 * one upload fails the ones that already went up are removed, so you never get half a product.
 * @returns {Promise<Array<{ path: string, url: string }>>}  same order as the input
 */
async function uploadImages(files, options = {}) {
    const list = Array.isArray(files) ? files : files ? [files] : [];
    if (list.length === 0) return [];

    const folder = options.folder || "products";
    const types = list.map(inspectFile); // throws before any upload if one file is bad
    const client = options.client || getAdminClient();

    const results = await Promise.allSettled(list.map((f, i) => putFile(client, f, types[i], folder)));
    const uploaded = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
    const failed = results.find((r) => r.status === "rejected");

    if (failed) {
        await deleteImages(uploaded.map((u) => u.path), { client });
        throw failed.reason;
    }
    return uploaded;
}

/**
 * Deletes files by storage path. Never throws: it is used for cleanup, and a failed
 * cleanup shouldn't hide the original error.
 */
async function deleteImages(paths, options = {}) {
    const clean = (paths ?? []).filter((p) => typeof p === "string" && p.length > 0);
    if (clean.length === 0) return;
    const client = options.client || getAdminClient();
    const { error } = await client.storage.from(BUCKET).remove(clean);
    if (error) console.error("deleteImages failed:", error.message);
}

/** "https://xyz.supabase.co/storage/v1/object/public/<bucket>/products/..." -> "products/..." */
function pathFromPublicUrl(url) {
    if (typeof url !== "string") return null;
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const i = url.indexOf(marker);
    return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

module.exports = {
    pathFromPublicUrl,
    deleteImages,
    uploadImages,
    uploadImage,
    MAX_IMAGE_BYTES,
    ImageUploadError
}
