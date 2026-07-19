import fs from 'fs';

// Automatically sync generated hero image to public directory
const srcPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd1bec51-8683-4d77-8371-ccc7405c86bd\\hero_garage_1783323770582.jpg';
const destPath = './public/hero-garage.jpg';

try {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('--- Auto-copy hero image: Success ---');
  }
} catch (err) {
  console.error('Auto-copy hero image error:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
