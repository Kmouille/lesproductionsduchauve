// Derives every brand image from one logo file.
// Usage: npm run brand -- [source] [left,top,size]
// The crop is only needed for a source that is not already a square.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const [source = "src/assets/brand/logo-source.png", crop] =
  process.argv.slice(2);

async function squareLogo() {
  const image = sharp(source);
  if (!crop) {
    return image.toBuffer();
  }
  const [left, top, size] = crop.split(",").map(Number);
  return image.extract({ left, top, width: size, height: size }).toBuffer();
}

const square = await squareLogo();
const { width: size } = await sharp(square).metadata();
const mask = Buffer.from(
  `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
);
const round = await sharp(square)
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

await mkdir("src/assets/brand", { recursive: true });
await sharp(round)
  .resize(512, 512, { withoutEnlargement: true })
  .png()
  .toFile("src/assets/brand/logo.png");
await sharp(round).resize(64, 64).png().toFile("public/favicon.png");
await sharp(round)
  .resize(180, 180)
  .flatten({ background: "#000" })
  .png()
  .toFile("public/apple-touch-icon.png");
const shareLogo = await sharp(round).resize(460, 460).png().toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: "#000" },
})
  .composite([{ input: shareLogo, gravity: "center" }])
  .jpeg({ quality: 90 })
  .toFile("public/og-default.jpg");

console.log(`Brand assets written from ${source} (${size}px square)`);
