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
    
    // Ignore node-specific modules when bundling for the browser
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
};

export default nextConfig;
