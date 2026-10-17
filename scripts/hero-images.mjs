// One-off: the hero photo as WebP with its transparent background (the PNG is 1.4 MB).
import sharp from 'sharp';
const out = await sharp('docs/prototype/office-real.png').webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile('public/office-real.webp');
console.log('public/office-real.webp', out.width + 'x' + out.height, Math.round(out.size / 1024) + ' KB');
