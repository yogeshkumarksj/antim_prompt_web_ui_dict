import { r as interop } from "./rolldown-runtime-hePW80VL.js";
import { C as CopyIcon, N as ReactNS, c as AlertIcon, w as ClockIcon } from "./vendor-icons-CD2Hvhn_.js";
import { t as jsxRuntime } from "./vendor-react-Ch6a_wip.js";
import { t as axios } from "./vendor-axios-DhiQ7QLW.js";
import { a as songsUrl, t as Footer } from "./index-RMZ4YpJu.js";
import { c as serviceById, u as PageHeader } from "./BusinessFacts-Dps7jRTH.js";
import { i as interpretAiResponse, r as interpretAiError } from "./aiFeature-Cx7U9uqu.js";

const React = interop(ReactNS(), 1);
const jsx = jsxRuntime();
const service = serviceById("songs");
const COVER_SIZE = 64;

function pretty(value) {
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeCategories(data) {
  const raw = Array.isArray(data) ? data : Array.isArray(data?.categories) ? data.categories : Array.isArray(data?.items) ? data.items : [];
  const seen = new Set();
  const categories = [];
  for (const item of raw) {
    let entry = null;
    if (typeof item === "string" && item.trim()) entry = { id: item.trim(), label: pretty(item.trim()) };
    else if (item && typeof item === "object") {
      const id = item.id ?? item.slug ?? item.key ?? item.value ?? item.name;
      if (id != null && String(id).trim()) entry = { id: String(id).trim(), label: String(item.label ?? item.name ?? item.title ?? pretty(id)) };
    }
    if (!entry || entry.id.toLowerCase() === "all" || seen.has(entry.id)) continue;
    seen.add(entry.id);
    categories.push(entry);
  }
  const trendingIndex = categories.findIndex((item) => item.id.toLowerCase() === "trending" || item.label.toLowerCase() === "trending");
  if (trendingIndex > 0) {
    const [trending] = categories.splice(trendingIndex, 1);
    categories.unshift(trending);
  }
  return categories;
}

function pickDefault(categories) {
  const trending = categories.find((item) => item.id.toLowerCase() === "trending" || item.label.toLowerCase() === "trending");
  return trending?.id || categories[0]?.id || "trending";
}

function categoryLabel(value, categories) {
  if (value == null || value === "") return "";
  const text = String(value);
  const match = categories.find((item) => item.id === text || item.label.toLowerCase() === text.toLowerCase() || item.id.toLowerCase() === text.toLowerCase());
  return match?.label || text;
}

function safeHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    return "";
  }
  return "";
}

function reelsLabel(count) {
  if (typeof count !== "number" || !Number.isFinite(count)) return "";
  const noun = count === 1 ? "reel" : "reels";
  return `Used in ${count} ${noun}`;
}

function readOk(response) {
  const judged = interpretAiResponse(response);
  if (judged.kind === "limit") return judged;
  const data = response?.data ?? {};
  if (data && typeof data === "object" && (Array.isArray(data) || Array.isArray(data.songs) || Array.isArray(data.categories) || Array.isArray(data.items) || data.status === "success")) {
    return { kind: "success", data };
  }
  return judged;
}

function readSongs(data, isAll) {
  const songs = Array.isArray(data?.songs) ? [...data.songs] : [];
  songs.sort((a, b) => Number(isAll ? (a.overall_rank ?? a.rank ?? 0) : (a.rank ?? 0)) - Number(isAll ? (b.overall_rank ?? b.rank ?? 0) : (b.rank ?? 0)));
  return {
    songs: songs.slice(0, 20),
    disclaimer: typeof data?.disclaimer === "string" ? data.disclaimer : "",
    generatedAt: data?.generated_at || "",
  };
}

function LimitNote() {
  return (0, jsx.jsxs)("div", {
    role: "status",
    className: "mx-auto mt-8 flex max-w-2xl gap-3 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6",
    children: [
      (0, jsx.jsx)(ClockIcon, { className: "mt-0.5 shrink-0" }),
      (0, jsx.jsxs)("div", { children: [
        (0, jsx.jsx)("p", { className: "text-lg font-black", children: "Limit reached, try tomorrow." }),
        (0, jsx.jsx)("p", { className: "mt-1 text-sm leading-relaxed text-amber-900", children: "Today's allowance for this tool is used up. Come back tomorrow to run it again." }),
      ] }),
    ],
  });
}

function ErrorNote({ message }) {
  if (!message) return null;
  return (0, jsx.jsxs)("div", {
    role: "alert",
    className: "mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600",
    children: [(0, jsx.jsx)(AlertIcon, { className: "mt-0.5 shrink-0" }), (0, jsx.jsx)("p", { className: "font-medium", children: message })],
  });
}

function CoverPlaceholder({ gradientId }) {
  const stroke = `url(#${gradientId})`;
  return (0, jsx.jsx)("div", {
    className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-50",
    style: { width: COVER_SIZE, height: COVER_SIZE },
    "aria-hidden": "true",
    children: (0, jsx.jsxs)("svg", {
      width: "28",
      height: "28",
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": "true",
      children: [
        (0, jsx.jsx)("defs", { children: (0, jsx.jsxs)("linearGradient", {
          id: gradientId,
          x1: "3",
          y1: "3",
          x2: "21",
          y2: "21",
          gradientUnits: "userSpaceOnUse",
          children: [
            (0, jsx.jsx)("stop", { offset: "0%", stopColor: "#8B5CF6" }),
            (0, jsx.jsx)("stop", { offset: "100%", stopColor: "#0EA5E9" }),
          ],
        }) }),
        (0, jsx.jsx)("path", { d: "M9 18V5l12-2v13", stroke, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
        (0, jsx.jsx)("circle", { cx: "6", cy: "18", r: "3", stroke, strokeWidth: "2" }),
        (0, jsx.jsx)("circle", { cx: "18", cy: "16", r: "3", stroke, strokeWidth: "2" }),
      ],
    }),
  });
}

function CoverArt({ song, gradientId }) {
  const src = safeHttpUrl(song?.cover_url);
  const [broken, setBroken] = (0, React.useState)(false);
  (0, React.useEffect)(() => {
    setBroken(false);
  }, [src]);
  if (src && !broken) {
    return (0, jsx.jsx)("img", {
      src,
      alt: "",
      loading: "lazy",
      decoding: "async",
      width: COVER_SIZE,
      height: COVER_SIZE,
      onError: () => setBroken(true),
      className: "h-16 w-16 shrink-0 rounded-2xl object-cover bg-purple-50",
      style: { width: COVER_SIZE, height: COVER_SIZE },
    });
  }
  return (0, jsx.jsx)(CoverPlaceholder, { gradientId });
}

function PlayGlyph() {
  return (0, jsx.jsx)("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    children: (0, jsx.jsx)("path", { d: "M8 5v14l11-7z" }),
  });
}

function PauseGlyph() {
  return (0, jsx.jsx)("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    children: (0, jsx.jsx)("path", { d: "M6 5h4v14H6zm8 0h4v14h-4z" }),
  });
}

function ChartSong({ song, index, isAll, categories, copied, onCopy, playingKey, onPlay }) {
  const rank = isAll ? (song.overall_rank ?? song.rank ?? index + 1) : (song.rank ?? index + 1);
  const tags = Array.isArray(song.hashtags) ? song.hashtags : [];
  const searchText = typeof song.search_text === "string" ? song.search_text : "";
  const key = `${song.rank ?? index}-${song.title ?? index}`;
  const reels = reelsLabel(song.reels_count);
  const preview = safeHttpUrl(song?.preview_url);
  const playing = playingKey === key;
  return (0, jsx.jsxs)("article", {
    className: "song-chart-card rounded-[2rem] border border-gridBorder bg-white p-5 shadow-sm sm:p-6",
    children: [
      (0, jsx.jsx)("div", { className: "song-chart-rank flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-lg font-black text-primaryPurple", children: rank }),
      (0, jsx.jsxs)("div", {
        className: "song-chart-cover",
        style: { position: "relative", width: COVER_SIZE, height: COVER_SIZE },
        children: [
          (0, jsx.jsx)(CoverArt, { song, gradientId: `song-cover-${index}` }),
          preview ? (0, jsx.jsx)("button", {
            type: "button",
            "aria-label": playing ? "Pause preview" : "Play preview",
            "aria-pressed": playing,
            onClick: () => onPlay(key, preview),
            style: {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 28,
              height: 28,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 0,
              borderRadius: 999,
              padding: 0,
              background: "rgba(15, 23, 42, 0.55)",
              color: "#fff",
              cursor: "pointer",
            },
            children: playing ? (0, jsx.jsx)(PauseGlyph, {}) : (0, jsx.jsx)(PlayGlyph, {}),
          }) : null,
        ],
      }),
      (0, jsx.jsxs)("div", { className: "song-chart-body", style: { minWidth: 0 }, children: [
        (0, jsx.jsx)("h3", { className: "break-words text-xl font-black tracking-tight text-gray-900", children: song.title || "Untitled track" }),
        song.artist && (0, jsx.jsx)("p", { className: "mt-1 break-words text-sm font-bold text-secondaryBlue", children: song.artist }),
        isAll && (song.category || song.rank != null) && (0, jsx.jsx)("p", { className: "mt-1 text-xs font-bold uppercase tracking-widest text-gray-400", children: [categoryLabel(song.category, categories), song.rank != null ? `#${song.rank}` : ""].filter(Boolean).join(" · ") }),
        song.why_trending && (0, jsx.jsx)("p", { className: "mt-3 text-sm leading-relaxed text-gray-600", children: song.why_trending }),
        reels && (0, jsx.jsx)("p", { className: "mt-2 text-xs font-bold text-gray-500", children: reels }),
        tags.length > 0 && (0, jsx.jsx)("div", { className: "mt-3 flex flex-wrap gap-2", children: tags.map((tag) => (0, jsx.jsxs)("span", { className: "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600", children: ["#", String(tag).replace(/^#/, "")] }, `${key}-${tag}`)) }),
      ] }),
      (0, jsx.jsxs)("button", {
        type: "button",
        disabled: !searchText,
        onClick: () => onCopy(key, searchText),
        className: "song-chart-copy inline-flex shrink-0 items-center text-sm font-bold text-primaryPurple hover:underline disabled:opacity-50",
        children: [(0, jsx.jsx)(CopyIcon, { size: 16, className: "mr-1" }), copied === key ? "Copied" : "Copy"],
      }),
    ],
  }, key);
}

function ViralSongs() {
  const [categories, setCategories] = (0, React.useState)([]);
  const [category, setCategory] = (0, React.useState)("");
  const [chart, setChart] = (0, React.useState)(null);
  const [chartLoading, setChartLoading] = (0, React.useState)(true);
  const [chartError, setChartError] = (0, React.useState)("");
  const [chartLimit, setChartLimit] = (0, React.useState)(false);
  const [copied, setCopied] = (0, React.useState)("");
  const [playingKey, setPlayingKey] = (0, React.useState)("");
  const audioRef = (0, React.useRef)(null);
  const playTicket = (0, React.useRef)(0);

  (0, React.useEffect)(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;
    const onEnded = () => setPlayingKey("");
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  (0, React.useEffect)(() => {
    audioRef.current?.pause();
    setPlayingKey("");
  }, [category]);

  (0, React.useEffect)(() => {
    let cancel = false;
    (async () => {
      try {
        const response = await axios.get(`${songsUrl}/categories`);
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") {
          setChartLimit(true);
          setChartLoading(false);
          return;
        }
        const next = normalizeCategories(outcome.kind === "success" ? outcome.data : {});
        setCategories(next);
        setCategory(pickDefault(next));
      } catch (error) {
        if (cancel) return;
        const outcome = interpretAiError(error);
        if (outcome.kind === "limit") {
          setChartLimit(true);
          setChartLoading(false);
          return;
        }
        setCategories([]);
        setCategory("trending");
      }
    })();
    return () => { cancel = true; };
  }, []);

  (0, React.useEffect)(() => {
    if (!category) return;
    let cancel = false;
    (async () => {
      setChartLoading(true);
      setChartError("");
      setChartLimit(false);
      try {
        const response = await axios.get(`${songsUrl}/top`, { params: { category } });
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") setChartLimit(true);
        else if (outcome.kind === "success") setChart(readSongs(outcome.data, category === "all"));
        else setChartError(outcome.message || "Could not load songs.");
      } catch (error) {
        if (cancel) return;
        const outcome = interpretAiError(error);
        if (outcome.kind === "limit") setChartLimit(true);
        else setChartError(outcome.message);
      } finally {
        if (!cancel) setChartLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [category]);

  (0, React.useEffect)(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(""), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copySearch = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
    } catch {
      setCopied("");
    }
  };

  const togglePreview = async (key, url) => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    const same = audio.dataset.songKey === key;
    if (same && !audio.paused) {
      audio.pause();
      setPlayingKey("");
      return;
    }
    const ticket = ++playTicket.current;
    if (!same) {
      audio.src = url;
      audio.dataset.songKey = key;
      audio.currentTime = 0;
    } else if (audio.ended) {
      audio.currentTime = 0;
    }
    try {
      await audio.play();
      if (ticket === playTicket.current) setPlayingKey(key);
    } catch {
      if (ticket === playTicket.current) setPlayingKey("");
    }
  };

  const chips = [{ id: "all", label: "All" }, ...(categories.length ? categories : [{ id: "trending", label: "Trending" }])];
  const isAll = category === "all";

  return (0, jsx.jsxs)("div", {
    className: "flex min-h-screen flex-col bg-[#F8FAFC]",
    children: [
      (0, jsx.jsx)("style", { children: ".song-chart-card{display:grid;grid-template-columns:auto 64px minmax(0,1fr);grid-template-areas:\"rank cover body\" \"rank cover copy\";column-gap:.75rem;row-gap:.75rem;align-items:start}.song-chart-rank{grid-area:rank}.song-chart-cover{grid-area:cover}.song-chart-body{grid-area:body}.song-chart-copy{grid-area:copy;justify-self:end}@media (min-width:640px){.song-chart-card{grid-template-columns:auto 64px minmax(0,1fr) auto;grid-template-areas:\"rank cover body copy\";column-gap:1rem}}" }),
      (0, jsx.jsx)(PageHeader, { title: service.name, backTo: "/ai-magic", backLabel: "Back to AI Magic" }),
      (0, jsx.jsxs)("main", {
        className: "mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10",
        children: [
          (0, jsx.jsxs)("div", { className: "mb-8 text-center", children: [
            (0, jsx.jsx)("p", { className: "text-xs font-black uppercase tracking-widest text-primaryPurple", children: "Free tool" }),
            (0, jsx.jsx)("h2", { className: "mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl", children: service.name }),
            (0, jsx.jsx)("p", { className: "mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500 sm:text-base", children: "Trending sounds, ranked. Copy a song name and search it on Instagram or Facebook." }),
          ] }),
          (0, jsx.jsx)("div", {
            className: "mx-auto flex max-w-2xl flex-wrap justify-center gap-2",
            children: chips.map((item) => (0, jsx.jsx)("button", {
              type: "button",
              "aria-pressed": category === item.id,
              onClick: () => setCategory(item.id),
              className: category === item.id ? "rounded-full bg-primaryPurple px-3 py-1.5 text-xs font-bold text-white shadow-sm" : "rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gridBorder hover:text-primaryPurple",
              children: item.label,
            }, item.id)),
          }),
          chartLoading && (0, jsx.jsxs)("div", {
            role: "status",
            className: "mx-auto mt-8 max-w-2xl rounded-[2rem] border border-gridBorder bg-white p-8 text-center shadow-sm",
            children: [
              (0, jsx.jsx)("div", { className: "mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" }),
              (0, jsx.jsx)("p", { className: "font-bold text-gray-800", children: "Loading songs..." }),
            ],
          }),
          chartLimit && !chartLoading && (0, jsx.jsx)(LimitNote, {}),
          !chartLimit && (0, jsx.jsx)(ErrorNote, { message: chartError }),
          !chartLoading && !chartLimit && !chartError && chart && (0, jsx.jsxs)("div", { className: "mt-8 space-y-4", children: [
            chart.songs.length === 0 ? (0, jsx.jsx)("div", { className: "mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500", children: "No songs in this category yet." }) : chart.songs.map((song, index) => (0, jsx.jsx)(ChartSong, { song, index, isAll, categories, copied, onCopy: copySearch, playingKey, onPlay: togglePreview }, `${song.rank ?? index}-${song.title ?? index}`)),
            chart.disclaimer && (0, jsx.jsx)("p", { className: "mx-auto max-w-2xl text-sm leading-relaxed text-gray-500", children: chart.disclaimer }),
            chart.generatedAt && (0, jsx.jsxs)("p", { className: "mx-auto max-w-2xl text-xs font-bold uppercase tracking-widest text-gray-400", children: ["Updated ", String(chart.generatedAt)] }),
          ] }),
        ],
      }),
      (0, jsx.jsx)(Footer, {}),
    ],
  });
}

export { ViralSongs as default };
