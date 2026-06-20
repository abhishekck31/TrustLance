/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable PWA support configuration (if using specific plugins or modern Next setup)
  // For standard Next.js, we focus on metadata injection and service worker setup via external tools/templates.
  // We ensure base path handles asset loading correctly for PWAs.
  basePath: '', // Set to your desired public path if deploying to a subdirectory
  images: {
    unoptimized: true, // Important for some PWA setups involving optimized assets
  },
};

module.exports = nextConfig;