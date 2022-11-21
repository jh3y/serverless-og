import React from "https://esm.sh/react@18.2.0";

import satori, { init as initSatori } from "https://esm.sh/satori@0.0.40/wasm";
import { initStreaming } from "https://esm.sh/yoga-wasm-web@0.1.2";

import {
  initWasm,
  Resvg,
} from "https://esm.sh/@resvg/resvg-wasm@2.0.0-alpha.4";

const GRADIENTS = [
  "linear-gradient(45deg, #1f005c, #5b0060, #870160, #ac255e, #ca485c, #e16b5c, #f39060, #ffb56b)",
  "linear-gradient(-45deg, #48005c, #8300e2, #a269ff)",
  "linear-gradient(45deg, #00F5A0,#00D9F5)",
  "linear-gradient(45deg, #72C6EF,#004E8F)",
  "linear-gradient(45deg, #c7d2fe, #fecaca, #fef3c7)",
  "linear-gradient(45deg, #ffe259,#ffa751)",
  "linear-gradient(45deg, #acb6e5,#86fde8)",
  "linear-gradient(45deg, #536976,#292E49)",
  "linear-gradient(45deg, #9796f0,#fbc7d4)",
  "linear-gradient(90deg, #c6ffdd, #fbd786, #f7797d)",
  "linear-gradient(90deg, #77a1d3, #79cbca, #e684ae)",
  "linear-gradient(95deg,#c8beff 0%,#dea8f8 10%,#a8deff 30%,#bdfacd 42%,#f3fabd 58%,#fae3bd 70%,#f8acab 95%,#feaad4 100%)",
  "linear-gradient(75deg,red,orange,yellow,green,blue,indigo,violet)",
]

import {
  initializeImageMagick,
  ImageMagick,
  Magick,
  MagickFormat,
  Quantum,
} from "https://esm.sh/@imagemagick/magick-wasm";

// const data = await Deno.readFile("image.jpg");

const resvg_wasm = fetch(
  "https://unpkg.com/@vercel/og@0.0.18/vendor/resvg.simd.wasm"
).then((res) => res.arrayBuffer());

const yoga_wasm = fetch("https://unpkg.com/@vercel/og@0.0.18/vendor/yoga.wasm");

const fallbackFont = fetch(
  "https://unpkg.com/@vercel/og@0.0.18/vendor/noto-sans-v27-latin-regular.ttf"
).then((a) => a.arrayBuffer());

const initializedResvg = initWasm(resvg_wasm);
const initializedYoga = initStreaming(yoga_wasm).then((yoga) =>
  initSatori(yoga)
);

const isDev = Boolean(Deno.env.get("NETLIFY_LOCAL"));

async function loadGoogleFont(font) {
  if (!font) return;

  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@900&display=swap`;

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );
  if (!resource) throw new Error("Failed to load font");

  return fetch(resource[1]).then((res) => res.arrayBuffer());
}

const desiredFont = loadGoogleFont("Inter");

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "My default title";
    // ?hue=<hue>
    const hasHue = searchParams.has("hue");
    const hue = hasHue ? searchParams.get("hue") : 5;

    const hasGradient = searchParams.has("gradient");

    let background = `hsl(${hue} 80% 50%)`
    if (hasGradient) background = GRADIENTS[searchParams.get("gradient")]

    const extendedOptions = Object.assign(
      {
        width: 1200,
        height: 630,
        debug: false,
      },
      {}
    );

    const element = (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          position: "relative",
          padding: "2rem",
          background,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
          }}
        >
          {/* This is the backdrop cutout */}
          <svg
            viewBox="0 0 1200 630"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
            }}
          >
            <defs>
              <mask id="mask">
                <rect
                  fill="white"
                  x="0"
                  y="0"
                  width="1200"
                  height="630"
                  rx="5"
                  ry="5"
                />
                <circle fill="black" cx="1150" cy="560" r="320" />
              </mask>
            </defs>
            <g mask="url(#mask)">
              <rect
                fill="hsl(0 0% 10%)"
                x="10"
                y="10"
                width="1180"
                height="610"
                rx="5"
                ry="5"
              />
            </g>
          </svg>
        </div>
        <div style={{ display: "flex", position: "relative", padding: "1rem" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: "hsl(0 0% 100%)",
              textTransform: "uppercase",
              position: "relative",
              width: "85%",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              position: "absolute",
              width: "350px",
              height: "16px",
              background: `hsl(0 0% 100%)`,
              bottom: "-1rem",
              left: "1rem",
              zIndex: -1,
            }}
          ></div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            transformOrigin: "100% 0",
            transform: "rotate(-90deg) translate(-50%, -100%)",
            fontSize: "32px",
            color: "hsl(0 0% 100%)",
          }}
        >
          @jh3yy
        </div>
        <img
          style={{
            position: "absolute",
            height: "75%",
            right: 0,
            bottom: 0,
            transform: "translate(5%, 5%)",
            filter: "saturate(0.5) grayscale(0.5)",
          }}
          src="https://assets.codepen.io/605876/headshot-remove-bg.png"
          alt=""
        />
      </div>
    );

    const result = new ReadableStream({
      async start(controller) {
        await initializedYoga;
        await initializedResvg;

        // const fontData = await fallbackFont;
        const fontData = await desiredFont;

        const svg = await satori(element, {
          width: extendedOptions.width,
          height: extendedOptions.height,
          debug: extendedOptions.debug,
          fonts: extendedOptions.fonts || [
            {
              name: "sans serif",
              data: fontData,
              weight: 900,
              style: "bold",
            },
          ],
        });

        const result = new Resvg(svg, {
          fitTo: {
            mode: "width",
            value: extendedOptions.width,
          },
        }).render();

        controller.enqueue(result);
        controller.close();
      },
    });

    return new Response(result, {
      headers: {
        "content-type": "image/png",
        "cache-control": isDev
          ? "no-cache, no-store"
          : "public, immutable, no-transform, max-age=31536000",
        ...extendedOptions.headers,
      },
      status: extendedOptions.status,
      statusText: extendedOptions.statusText,
    });
  } catch (err) {
    console.log(`${err.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
