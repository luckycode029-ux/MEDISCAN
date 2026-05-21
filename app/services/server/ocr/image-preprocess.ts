import { Jimp } from "jimp";

export async function preprocessImageForOcr(buffer: Buffer) {
  const image = await Jimp.fromBuffer(buffer);

  // Light preprocessing for mobile camera photos.
  image.greyscale().contrast(0.35).normalize();

  if (image.bitmap.width < 900) {
    image.resize({ w: 900 });
  }

  return await image.getBuffer("image/png");
}
