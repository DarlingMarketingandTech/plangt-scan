interface NextConfig {
  reactStrictMode: boolean;
  eslint: { ignoreDuringBuilds: boolean };
  typescript: { ignoreBuildErrors: boolean };
  images: { remotePatterns: any[] };
  output: string;
  transpilePackages: string[];
  webpack: (config: any, context: any) => any;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
