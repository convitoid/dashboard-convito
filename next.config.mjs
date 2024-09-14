/** @type {import('next').NextConfig} */
const nextConfig = {
   env: {
      NEXT_PUBLIC_API_URL: process.env.NEXTAUTH_URL,
   },
};

export default nextConfig;
