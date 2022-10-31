import satori from 'npm:satori';
import { html } from 'npm:satori-html';
import { Resvg } from 'npm:@resvg/resvg-js';

const height = 630;
const width = 1200;


export default async (request) => {
  // const fontFile = fs.readFileSync(`${process.cwd()}/public/fonts/Roboto/Roboto-Black.ttf`);
  const markup = html('<div style="height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 72px;color: white;background: black;">Jhey makes OG</div>')
  const svg = await satori(markup, {
    height,
    width
  });

  const png = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width
    }
  }).render().asPng()

  return Response(png, {
    statusCode: 200,
    headers: {
      // 'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
      'Content-Type': 'image/png',
    },
    // isBase64Encoded: true,
    // body: png,
  })
}