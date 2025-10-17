/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui', '@workspace/utils', '@workspace/types'],
  output: 'standalone',
};

export default nextConfig;
