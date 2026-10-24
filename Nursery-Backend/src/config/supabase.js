const { createServerClient, parseCookieHeader } = require('@supabase/ssr');

function createClient(req, res) {
    return createServerClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    // Parse cookies from incoming request headers
                    return parseCookieHeader(req.headers.cookie || '');
                },
                setAll(cookiesToSet) {
                    // Set cookies on outgoing response headers
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookie(name, value, options);
                    });
                },
            },
        }
    );
}
module.exports = { createClient };
