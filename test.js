import satori from 'satori';
import {html as toReactElement} from 'satori-html';
import fs from 'fs';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';

const height = 630;
const width = 1200;

const fontFile = fs.readFileSync(`${process.cwd()}/public/fonts/Roboto/Roboto-Black.ttf`);

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
res.toFile(`${process.cwd()}/og.test.png`)