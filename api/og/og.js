const satori = require('satori').default;
const { html } = require('satori-html');
const sharp = require('sharp');
const fs = require('fs');
const { Buffer } = require('node:buffer');

const height = 630;
const width = 1200;

const fontFile = fs.readFileSync(`${process.cwd()}/public/fonts/Roboto/Roboto-Black.ttf`);

exports.handler = async function() {
  const markup = html(`
    <div style="height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 72px;color: white;background: black;">
      Jhey made some OG
      <img src="https://picsum.photos/100/100?random=10">
    </div>
  `)
  const svg = await satori(markup, {
    fonts: [
      {
        name: 'Roboto',
        data: fontFile,
        style: 'normal'
      }
    ],
    height,
    width
  });

  const res = await (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64')

  return {
    statusCode: 200,
    headers: {
      'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
      'Content-Type': 'image/png',
    },
    isBase64Encoded: true,
    body: res,
  }
}