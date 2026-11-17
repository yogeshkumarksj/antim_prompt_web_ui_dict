import { r as interop } from "./rolldown-runtime-hePW80VL.js";
import { N as ReactNS } from "./vendor-icons-CD2Hvhn_.js";
import { t as jsxRuntime } from "./vendor-react-Ch6a_wip.js";
import { chooseSize, orientationOf, ratioLabel } from "./photoRatio.js";

const React = interop(ReactNS(), 1);
const jsx = jsxRuntime();

const STYLE_ID = "photo-frame-style";

export function ensurePhotoStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .photo-masonry { column-count: 2; column-gap: 0.75rem; }
    .photo-masonry > * { break-inside: avoid; page-break-inside: avoid; display: block; width: 100%; margin-bottom: 0.75rem; }
    .photo-masonry-home { column-gap: 0.75rem; }
    @media (min-width: 640px) { .photo-masonry-home { column-count: 3; } }
    @media (min-width: 768px) {
      .photo-masonry-home { column-count: 4; column-gap: 1.5rem; }
      .photo-masonry-home > * { margin-bottom: 1.5rem; }
    }
    @media (min-width: 1024px) { .photo-masonry-home { column-count: 5; } }
    @media (min-width: 1280px) { .photo-masonry-home { column-count: 6; } }
    .photo-masonry-saved { column-count: 2; column-gap: 1.5rem; }
    .photo-masonry-saved > * { margin-bottom: 1.5rem; }
    @media (min-width: 768px) { .photo-masonry-saved { column-count: 3; } }
    @media (min-width: 1024px) { .photo-masonry-saved { column-count: 5; } }
    .photo-masonry-art { column-count: 1; column-gap: 1rem; }
    .photo-masonry-art > * { margin-bottom: 1rem; }
    @media (min-width: 768px) { .photo-masonry-art { column-count: 2; } }
  `;
  document.head.appendChild(style);
}

ensurePhotoStyles();

function OrientIcon({ orient }) {
  const box = orient === "landscape" ? { x: 1, y: 3.5, width: 12, height: 7 } : orient === "portrait" ? { x: 3.5, y: 1, width: 7, height: 12 } : { x: 2, y: 2, width: 10, height: 10 };
  return (0, jsx.jsx)("svg", {
    width: 14,
    height: 14,
    viewBox: "0 0 14 14",
    fill: "none",
    "aria-hidden": "true",
    style: { marginRight: "0.25rem", flexShrink: 0 },
    children: (0, jsx.jsx)("rect", { ...box, rx: 1, stroke: "currentColor", strokeWidth: 1.4 }),
  });
}

export function PhotoFrame({ src, alt = "", meta = null, imgClassName = "", figureClassName = "", fit = "full" }) {
  const [caption, setCaption] = (0, React.useState)("");
  const [orient, setOrient] = (0, React.useState)("");
  if (!src) return null;
  const frameStyle = fit === "thumb"
    ? { width: "auto", maxWidth: "4.5rem", margin: 0 }
    : { margin: 0 };
  const imageStyle = fit === "thumb"
    ? { width: "auto", maxWidth: "4.5rem", height: "auto", objectFit: "contain", display: "block" }
    : { width: "100%", height: "auto", objectFit: "contain", display: "block" };
  return (0, jsx.jsxs)("figure", {
    className: figureClassName,
    style: frameStyle,
    children: [
      (0, jsx.jsx)("img", {
        src,
        alt,
        loading: "lazy",
        decoding: "async",
        className: imgClassName,
        style: imageStyle,
        onLoad: (event) => {
          const size = chooseSize(meta, src, event.currentTarget.naturalWidth, event.currentTarget.naturalHeight);
          if (!size) return;
          setOrient(orientationOf(size.w, size.h));
          setCaption(`${ratioLabel(size.w, size.h)} · ${size.w}x${size.h}`);
        },
      }),
      caption ? (0, jsx.jsxs)("figcaption", {
        className: "mt-1 flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400",
        children: [(0, jsx.jsx)(OrientIcon, { orient }), (0, jsx.jsx)("span", { children: caption })],
      }) : null,
    ],
  });
}
