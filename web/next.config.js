/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost'],
    },

    // react-chat-engine-advanced does not work with react StrictMode. Please remove
    // nao sei quais as consequencias de fazer isso
    reactStrictMode: false,
  }

module.exports = nextConfig
