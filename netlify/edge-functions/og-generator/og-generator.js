import satori from 'https://cdn.skypack.dev/satori';
import { html } from 'https://cdn.skypack.dev/satori-html';
import sharp from 'https://cdn.skypack.dev/sharp';

const height = 630;
const width = 1200;


export default async (request) => {
  // const fontFile = fs.readFileSync(`${process.cwd()}/public/fonts/Roboto/Roboto-Black.ttf`);
  const markup = html('<div style="height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 72px;color: white;background: black;">Jhey makes OG</div>')
  const svg = await satori(markup, {
    height,
    width
  });

  const res = await (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64')

  return new Response (res, {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}