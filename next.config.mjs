/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/messages",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
