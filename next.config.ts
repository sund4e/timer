import type { NextConfig } from 'next';
import { version } from './package.json';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  trailingSlash: false,
  compiler: {
    styledComponents: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  async headers() {
    return [
      {
        source: '/:all*(wav|png|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
