import { createIcon } from '@svgr/cli';
import sharp from 'sharp';

const svgIcon = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#007AFF"/>
  <text x="512" y="512" text-anchor="middle" dominant-baseline="middle" font-size="400" fill="white">Q</text>
</svg>
`;

// Generate different sizes
const sizes = {
  icon: 1024,
  adaptiveIcon: 108,
  favicon: 32
};

Object.entries(sizes).forEach(([name, size]) => {
  sharp(Buffer.from(svgIcon))
    .resize(size, size)
    .png()
    .toFile(`assets/${name}.png`);
}); 