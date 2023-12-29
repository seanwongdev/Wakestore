/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  reactStrictMode: true,
  pageDataCollectionTimeout: 300000,
};

module.exports = nextConfig;
