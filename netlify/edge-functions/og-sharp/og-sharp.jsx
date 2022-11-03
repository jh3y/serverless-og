import React from 'https://esm.sh/react@18.2.0'

import satori, { init as initSatori } from 'https://esm.sh/satori@0.0.40/wasm'
import { initStreaming } from 'https://esm.sh/yoga-wasm-web@0.1.2'

import { initWasm, Resvg } from 'https://esm.sh/@resvg/resvg-wasm@2.0.0-alpha.4'

// const data = await Deno.readFile("image.jpg");

const resvg_wasm = fetch(
  'https://unpkg.com/@vercel/og@0.0.18/vendor/resvg.simd.wasm'
).then((res) => res.arrayBuffer())

const yoga_wasm = fetch('https://unpkg.com/@vercel/og@0.0.18/vendor/yoga.wasm')

const fallbackFont = fetch(
  'https://unpkg.com/@vercel/og@0.0.18/vendor/noto-sans-v27-latin-regular.ttf'
).then((a) => a.arrayBuffer())

const initializedResvg = initWasm(resvg_wasm)
const initializedYoga = initStreaming(yoga_wasm).then((yoga) =>
  initSatori(yoga)
)

const isDev = Boolean(Deno.env.get('NETLIFY_LOCAL'))

async function loadGoogleFont(font, text) {
  if (!font || !text) return

  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@900&display=swap`

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    })
  ).text()

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)
  if (!resource) throw new Error('Failed to load font')

  return fetch(resource[1]).then((res) => res.arrayBuffer())
}

const desiredFont = loadGoogleFont('Roboto', 'Turnip')

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url)

    // ?title=<title>
    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My default title'
    // ?hue=<hue>
    const hasHue = searchParams.has('hue')
    const hue = hasHue
      ? searchParams.get('hue')
      : 5

    const extendedOptions = Object.assign(
      {
        width: 1200,
        height: 630,
        debug: false,
      },
      {}
    )

    const element = (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          position: 'relative',
          padding: '2rem',
          background: 'hsl(0 0% 5%)',
        }}>
        <div style={{ display: 'flex', position: 'relative' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: '900',
              color: 'hsl(0 0% 100%)',
              textTransform: 'uppercase',
              position: 'relative',
              width: '75%',
              display: 'flex',
            }}>
            {title}
          </div>
          <div
            style={{
              position: 'absolute',
              width: '350px',
              height: '25px',
              background: `hsl(${hue} 80% 50%)`,
              bottom: '-3rem',
              left: 0,
              zIndex: -1,
            }}></div>
        </div>
        <div
          style={{
            height: '660px',
            width: '660px',
            borderRadius: '50%',
            background: `hsl(${hue} 80% 50%)`,
            position: 'absolute',
            top: '100%',
            left: '100%',
            transform: 'translate(-50%, -50%)',
          }}></div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            transformOrigin: '100% 0',
            transform: 'rotate(-90deg) translate(-50%, -100%)',
            fontSize: '32px',
            color: 'hsl(0 0% 100%)',
          }}>
          @jh3yy
        </div>
        <img
          style={{
            position: 'absolute',
            height: '75%',
            right: 0,
            bottom: 0,
            filter: 'saturate(0.5) grayscale(0.5)',
          }}
          src="https://assets.codepen.io/605876/headshot-transparent.png"
          alt=""
        />
      </div>
    )

    const result = new ReadableStream({
      async start(controller) {
        await initializedYoga
        await initializedResvg

        // const fontData = await fallbackFont;
        const fontData = await desiredFont

        const svg = await satori(element, {
          width: extendedOptions.width,
          height: extendedOptions.height,
          debug: extendedOptions.debug,
          fonts: extendedOptions.fonts || [
            {
              name: 'sans serif',
              data: fontData,
              weight: 900,
              style: 'bold',
            },
          ],
        })

        const result = new Resvg(svg, {
          fitTo: {
            mode: 'width',
            value: extendedOptions.width,
          },
        }).render()

        controller.enqueue(result)
        controller.close()
      },
    })

    return new Response(result, {
      headers: {
        'content-type': 'image/png',
        'cache-control': isDev
          ? 'no-cache, no-store'
          : 'public, immutable, no-transform, max-age=31536000',
        ...extendedOptions.headers,
      },
      status: extendedOptions.status,
      statusText: extendedOptions.statusText,
    })
  } catch (err) {
    console.log(`${err.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
