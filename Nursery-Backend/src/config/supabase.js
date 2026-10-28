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
                        const updatedOptions = {
                            ...options,
                            httpOnly: true, 
                            secure: true,
                            sameSite: 'none',
                            path: '/',
                            maxAge: options?.maxAge ?? 60 * 60 * 24 * 7 // default 7 days if not set
                        };
                        res.cookie(name, value, updatedOptions);
                    });
                },
            },
        }
    );
}
module.exports = { createClient };
