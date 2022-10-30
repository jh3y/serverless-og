import satori from 'satori';
import {html as toReactElement} from 'satori-html';
import fs from 'fs';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';

const height = 630;
const width = 1200;

const fontFile = fs.readFileSync(`${process.cwd()}/public/fonts/Roboto/Roboto-Medium.ttf`);
// console.info(fontFile)
// const fontData = fontFile.arrayBuffer();


const html = toReactElement(`<div style="color: red;">${Date.now()}</div>`)
const svg = await satori(html, {
  fonts: [
    {
      name: 'Inter Latin',
      data: fontFile,
      style: 'normal'
    }
  ],
  height,
  width
});

const res = sharp(Buffer.from(svg)).toFormat('png')
// console.info(res)
res.toFile(`${process.cwd()}/og.test.png`)


// console.info(svg)


// export const handler = async () => {
//   const html = toReactElement('<div style="color: red;">Hello, World!</div>')
//   const svg = await satori(html, {
//     fonts: [
//       {
//         name: 'Inter Latin',
//         data: fontData,
//         style: 'normal'
//       }
//     ],
//     height,
//     width
//   });

//   return {
//     statusCode: 200,
//     headers: {
//       'Cache-Control': 'no-cache',
//       // 'Content-Type': 'image/png',
//     },
//     body: svg,
//   }
// }

// module.exports = { handler }


// /** @type {import('./$types').RequestHandler} */
// export const GET = async () => {
//   const html = toReactElement('<div style="color: red;">Hello, World!</div>')
//   const svg = await satori(html, {
//     fonts: [
//       {
//         name: 'Inter Latin',
//         data: fontData,
//         style: 'normal'
//       }
//     ],
//     height,
//     width
//   });

//   const image = resvg.render();

//   return new Response(image.asPng(), {
//     headers: {
//       'content-type': 'image/png'
//     }
//   });
// };