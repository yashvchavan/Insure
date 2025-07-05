/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable experimental features for better cookie handling
    experimental: {
        serverExternalPackages: ['bcryptjs']
    },
    
    // Add security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ]
            }
        ];
    },
    
    // Ensure cookies work properly in production
    async rewrites() {
        return [];
    }
};

export default nextConfig;
