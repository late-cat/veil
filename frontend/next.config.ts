import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true, // often needed with topLevelAwait
    };
    // Exclude the midnight ledger WASM module from optimization issues
    config.optimization.moduleIds = 'named';
    return config;
  },
};

export default nextConfig;
