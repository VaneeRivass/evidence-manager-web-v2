import type { NextConfig } from 'next'

// The browser only ever talks to its own origin. Every API call is relative
// ("/api/cases") and this rewrite forwards it to the API server-side, which is
// what makes the session cookie first-party and removes CORS entirely.
// API_URL (never NEXT_PUBLIC_API_URL) stays on the server. See docs/adr/0007.
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${process.env.API_URL}/:path*` },
    ]
  },
}

export default nextConfig
