/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable API proxy to JSON Server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 
          process.env.NODE_ENV === 'production'
            ? 'http://localhost:3001/:path*' // For Render production
            : 'http://localhost:3001/:path*' // For local development
      }
    ]
  },
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' }
        ]
      }
    ]
  }
}

export default nextConfig