import { r as interop } from "./rolldown-runtime-hePW80VL.js";
import { N as ReactNS } from "./vendor-icons-CD2Hvhn_.js";
import { t as jsxRuntime } from "./vendor-react-Ch6a_wip.js";
import { chooseSize, orientationOf, ratioLabel } from "./photoRatio.js";

const React = interop(ReactNS(), 1);
const jsx = jsxRuntime();
const GAP = 16;
const TALL_LIMIT = 9 / 16;

export function columnCountFor(width) {
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
}

export function placeItems(itemHeights, columnCount, gap = GAP) {
  const heights = Array.from({ length: columnCount }, () => 0);
  return itemHeights.map((itemHeight) => {
    let column = 0;
    for (let next = 1; next < columnCount; next += 1) {
      if (heights[next] < heights[column]) column = next;
    }
    const top = heights[column];
    heights[column] += itemHeight + gap;
    return { column, top };
  });
}

function OrientIcon({ orient }) {
  const box = orient === "landscape"
    ? { x: 1, y: 3.5, width: 12, height: 7 }
    : orient === "portrait"
      ? { x: 3.5, y: 1, width: 7, height: 12 }
      : { x: 2, y: 2, width: 10, height: 10 };
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

export function PhotoMeta({ caption, orient }) {
  if (!caption) return null;
  return (0, jsx.jsxs)("span", {
    className: "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500",
    style: { whiteSpace: "nowrap", maxWidth: "100%" },
    children: [
      (0, jsx.jsx)(OrientIcon, { orient }),
      (0, jsx.jsx)("span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: caption }),
    ],
  });
}

export function PhotoFrame({ src, alt = "", meta = null, imgClassName = "", figureClassName = "", fit = "full", hideCaption = false, onMetrics = null }) {
  const [metrics, setMetrics] = (0, React.useState)(null);
  const [letterbox, setLetterbox] = (0, React.useState)(false);
  if (!src) return null;
  const thumb = fit === "thumb";
  const imageStyle = thumb
    ? { width: "auto", maxWidth: "4.5rem", height: "auto", objectFit: "contain", display: "block" }
    : letterbox
      ? { width: "100%", height: "auto", aspectRatio: "9 / 16", objectFit: "contain", objectPosition: "center", display: "block", backgroundColor: "#f3f4f6" }
      : { width: "100%", height: "auto", objectFit: "contain", display: "block", backgroundColor: "#f3f4f6" };
  return (0, jsx.jsxs)("figure", {
    className: figureClassName,
    style: thumb ? { width: "auto", maxWidth: "4.5rem", margin: 0 } : { margin: 0 },
    children: [
      (0, jsx.jsx)("img", {
        src,
        alt,
        loading: "lazy",
        decoding: "async",
        className: imgClassName,
        style: imageStyle,
        onLoad: (event) => {
          const image = event.currentTarget;
          const naturalW = image.naturalWidth;
          const naturalH = image.naturalHeight;
          const size = chooseSize(meta, src, naturalW, naturalH);
          if (!size) return;
          const orient = orientationOf(size.w, size.h);
          const caption = `${ratioLabel(size.w, size.h)} · ${size.w}x${size.h}`;
          const next = { caption, orient };
          setMetrics(next);
          if (!thumb && naturalW > 0 && naturalH > 0) setLetterbox(naturalW / naturalH < TALL_LIMIT);
          if (typeof onMetrics === "function") onMetrics(next);
        },
      }),
      !hideCaption && metrics?.caption ? (0, jsx.jsx)("figcaption", {
        className: "mt-1 px-3 pb-1",
        children: (0, jsx.jsx)(PhotoMeta, { caption: metrics.caption, orient: metrics.orient }),
      }) : null,
    ],
  });
}

function roundBox(box) {
  return { left: Math.round(box.left), top: Math.round(box.top), width: Math.round(box.width) };
}

function sameLayout(prev, next) {
  if (!prev || prev.height !== next.height || prev.boxes.length !== next.boxes.length) return false;
  return prev.boxes.every((box, index) => box.left === next.boxes[index].left && box.top === next.boxes[index].top && box.width === next.boxes[index].width);
}

export function Masonry({ children }) {
  const items = React.Children.toArray(children).filter(Boolean);
  const containerRef = (0, React.useRef)(null);
  const itemRefs = (0, React.useRef)([]);
  const [layout, setLayout] = (0, React.useState)({ height: 0, boxes: [] });

  const measure = (0, React.useCallback)(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    if (!width) return;
    const cols = columnCountFor(width);
    const columnWidth = Math.floor((width - GAP * (cols - 1)) / cols);
    itemRefs.current.forEach((node) => {
      if (node) node.style.width = `${columnWidth}px`;
    });
    const itemHeights = items.map((_, index) => itemRefs.current[index]?.offsetHeight || 0);
    const placed = placeItems(itemHeights, cols, GAP);
    const boxes = placed.map((item) => roundBox({
      left: item.column * (columnWidth + GAP),
      top: item.top,
      width: columnWidth,
    }));
    const height = itemHeights.length ? Math.max(...placed.map((item, index) => item.top + itemHeights[index])) : 0;
    const next = { height, boxes };
    setLayout((prev) => (sameLayout(prev, next) ? prev : next));
  }, [items.length]);

  (0, React.useLayoutEffect)(() => {
    measure();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return undefined;
    let lastWidth = Math.round(container.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const widthChanged = entries.some((entry) => entry.target === container && Math.round(entry.contentRect.width) !== lastWidth);
      const itemChanged = entries.some((entry) => entry.target !== container);
      if (!widthChanged && !itemChanged) return;
      if (widthChanged) lastWidth = Math.round(container.clientWidth);
      measure();
    });
    observer.observe(container);
    itemRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [measure, items.length]);

  return (0, jsx.jsx)("div", {
    ref: containerRef,
    style: { position: "relative", width: "100%", height: layout.height ? `${layout.height}px` : undefined },
    children: items.map((child, index) => {
      const box = layout.boxes[index];
      return (0, jsx.jsx)("div", {
        ref: (node) => { itemRefs.current[index] = node; },
        style: box
          ? { position: "absolute", left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px` }
          : { position: "relative", width: "100%" },
        children: child,
      }, child.key ?? index);
    }),
  });
}
