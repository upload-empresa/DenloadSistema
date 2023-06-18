const { createProxyMiddleware } = require('http-proxy-middleware');
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    domains: [
      'res.cloudinary.com',
      'abs.twimg.com',
      'pbs.twimg.com',
      'avatars.githubusercontent.com',
    ],
  },
  reactStrictMode: true,
  swcMinify: false, // Required to fix: https://nextjs.org/docs/messages/failed-loading-swc
  async rewrites() {
    return [
      {
        source: '/api/auth/google',
        destination: 'https://accounts.google.com',
      },
    ];
  },
  async middleware() {
    const proxyMiddleware = createProxyMiddleware('/api/auth/google', {
      target: 'https://accounts.google.com',
      changeOrigin: true,
    });

    return [proxyMiddleware];
  },
};
