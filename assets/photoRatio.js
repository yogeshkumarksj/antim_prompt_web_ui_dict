const COMMON_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "2:3", value: 2 / 3 },
  { label: "9:16", value: 9 / 16 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
];

function positive(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number) : 0;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function ratioLabel(width, height) {
  if (!width || !height) return "";
  const ratio = width / height;
  let best = COMMON_RATIOS[0];
  let bestDiff = Infinity;
  for (const item of COMMON_RATIOS) {
    const diff = Math.abs(ratio - item.value) / item.value;
    if (diff < bestDiff) {
      bestDiff = diff;
      best = item;
    }
  }
  if (bestDiff <= 0.04) return best.label;
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export function orientationOf(width, height) {
  if (!width || !height) return "square";
  const ratio = width / height;
  if (Math.abs(ratio - 1) <= 0.04) return "square";
  return ratio > 1 ? "landscape" : "portrait";
}

function pairFrom(source) {
  if (!source || typeof source !== "object") return null;
  const pairs = [
    ["full_width", "full_height"],
    ["image_width", "image_height"],
    ["original_width", "original_height"],
    ["width", "height"],
    ["w", "h"],
  ];
  for (const [widthKey, heightKey] of pairs) {
    const width = positive(source[widthKey]);
    const height = positive(source[heightKey]);
    if (width && height) return { w: width, h: height };
  }
  return null;
}

export function sizeFromData(meta) {
  if (!meta || typeof meta !== "object") return null;
  const direct = pairFrom(meta) || pairFrom(meta.image) || pairFrom(meta.full_image);
  if (direct) return direct;
  for (const key of ["dimensions", "image_size", "full_size", "size"]) {
    const value = meta[key];
    if (typeof value === "string") {
      const match = value.match(/(\d+)\s*[x×]\s*(\d+)/i);
      if (match) return { w: Number(match[1]), h: Number(match[2]) };
    }
    const nested = pairFrom(value);
    if (nested) return nested;
  }
  return null;
}

function firstUrl(meta, keys) {
  if (!meta || typeof meta !== "object") return "";
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export function chooseSize(meta, src, naturalWidth, naturalHeight) {
  const naturalW = positive(naturalWidth);
  const naturalH = positive(naturalHeight);
  const natural = naturalW && naturalH ? { w: naturalW, h: naturalH } : null;
  const dataSize = sizeFromData(meta);
  const full = firstUrl(meta, ["image_url", "full_image_url", "original_url"]);
  const thumb = firstUrl(meta, ["thumbnail_url", "thumb_url", "card_image_url"]);
  const showingThumb = Boolean(src && thumb && src === thumb && full && full !== thumb);
  if (showingThumb && dataSize) return dataSize;
  return natural || dataSize;
}
