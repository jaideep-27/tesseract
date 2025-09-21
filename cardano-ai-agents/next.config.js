/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Enable async WebAssembly per Webpack 5 requirement for sidan-csl-rs-browser wasm.
    if (!config.experiments) config.experiments = {};
    config.experiments.asyncWebAssembly = true;
    // Ensure .wasm files are treated as webassembly/async (avoid parsing error)
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async'
    });
    return config;
  }
};
export default nextConfig;
