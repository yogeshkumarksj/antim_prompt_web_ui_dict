import { r as interop } from "./rolldown-runtime-hePW80VL.js";
import { C as CopyIcon, N as ReactNS, c as AlertIcon, h as MusicIcon, w as ClockIcon } from "./vendor-icons-CD2Hvhn_.js";
import { t as jsxRuntime } from "./vendor-react-Ch6a_wip.js";
import { t as axios } from "./vendor-axios-DhiQ7QLW.js";
import { a as songsUrl, t as Footer } from "./index-RMZ4YpJu.js";
import { c as serviceById, u as PageHeader } from "./BusinessFacts-Dps7jRTH.js";
import { i as interpretAiResponse, o as normalizeSongs, r as interpretAiError, s as songsRequestBody } from "./aiFeature-Cx7U9uqu.js";
import { n as ReportList } from "./AiToolScreen-ISyi6LGU.js";

const React = interop(ReactNS(), 1);
const jsx = jsxRuntime();
const service = serviceById("songs");
const fields = [
  { name: "niche", label: "Niche", required: true, maxLength: 80, placeholder: "fitness" },
  { name: "region", label: "Region", maxLength: 40, placeholder: "Leave blank for Global" },
  { name: "language", label: "Language", maxLength: 40, placeholder: "Optional, for example Hindi" },
];
const examples = ["Fitness", "Wedding", "Devotional", "Cafes"];

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

function SongResults({ result }) {
  const hasBody = result.summary || result.songs.length || result.howToUse.length;
  if (!hasBody) {
    return (0, jsx.jsx)("div", { className: "mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500", children: "The report came back empty. Try a different niche." });
  }
  const context = [result.niche, result.region, result.language].filter(Boolean).join(" · ");
  return (0, jsx.jsxs)("div", {
    className: "space-y-6",
    children: [
      (result.summary || result.disclaimer) && (0, jsx.jsxs)("div", {
        className: "rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm sm:p-8",
        children: [
          (0, jsx.jsxs)("div", { className: "mb-3 flex items-center text-primaryPurple", children: [(0, jsx.jsx)(MusicIcon, { size: 20, className: "mr-2" }), (0, jsx.jsx)("h3", { className: "text-lg font-black text-gray-900", children: "Audio ideas" })] }),
          result.summary && (0, jsx.jsx)("p", { className: "text-sm leading-relaxed text-gray-700 sm:text-base", children: result.summary }),
          context && (0, jsx.jsx)("p", { className: "mt-3 text-xs font-bold uppercase tracking-widest text-gray-400", children: context }),
          result.disclaimer && (0, jsx.jsx)("p", { className: "mt-4 text-sm leading-relaxed text-gray-500", children: result.disclaimer }),
        ],
      }),
      result.songs.length > 0 && (0, jsx.jsx)("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: result.songs.map((song) => (0, jsx.jsxs)("article", {
          className: "rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm",
          children: [
            (0, jsx.jsx)("h3", { className: "text-xl font-black tracking-tight text-gray-900", children: song.title }),
            song.artist && (0, jsx.jsx)("p", { className: "mt-1 text-sm font-bold text-secondaryBlue", children: song.artist }),
            song.why && (0, jsx.jsx)("p", { className: "mt-3 text-sm leading-relaxed text-gray-600", children: song.why }),
            song.reelIdea && (0, jsx.jsxs)("p", { className: "mt-3 text-sm text-gray-700", children: [(0, jsx.jsx)("span", { className: "font-black text-gray-400", children: "Reel idea · " }), song.reelIdea] }),
            song.hook && (0, jsx.jsx)("p", { className: "mt-3 rounded-2xl bg-purple-50 p-3 text-sm font-medium text-gray-700", children: song.hook }),
            song.hashtags.length > 0 && (0, jsx.jsx)("div", { className: "mt-3 flex flex-wrap gap-2", children: song.hashtags.map((tag) => (0, jsx.jsxs)("span", { className: "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600", children: ["#", String(tag).replace(/^#/, "")] }, tag)) }),
          ],
        }, song.id)),
      }),
      (0, jsx.jsx)(ReportList, { title: "How to use these sounds", items: result.howToUse }),
    ],
  });
}

function ChartSong({ song, index, isAll, categories, copied, onCopy }) {
  const rank = isAll ? (song.overall_rank ?? song.rank ?? index + 1) : (song.rank ?? index + 1);
  const tags = Array.isArray(song.hashtags) ? song.hashtags : [];
  const searchText = typeof song.search_text === "string" ? song.search_text : "";
  const key = `${song.rank ?? index}-${song.title ?? index}`;
  return (0, jsx.jsxs)("article", {
    className: "flex items-start gap-4 rounded-[2rem] border border-gridBorder bg-white p-5 shadow-sm sm:p-6",
    children: [
      (0, jsx.jsx)("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-lg font-black text-primaryPurple", children: rank }),
      (0, jsx.jsxs)("div", { className: "flex-1", children: [
        (0, jsx.jsx)("h3", { className: "text-xl font-black tracking-tight text-gray-900", children: song.title || "Untitled track" }),
        song.artist && (0, jsx.jsx)("p", { className: "mt-1 text-sm font-bold text-secondaryBlue", children: song.artist }),
        isAll && (song.category || song.rank != null) && (0, jsx.jsx)("p", { className: "mt-1 text-xs font-bold uppercase tracking-widest text-gray-400", children: [categoryLabel(song.category, categories), song.rank != null ? `#${song.rank}` : ""].filter(Boolean).join(" · ") }),
        song.why_trending && (0, jsx.jsx)("p", { className: "mt-3 text-sm leading-relaxed text-gray-600", children: song.why_trending }),
        tags.length > 0 && (0, jsx.jsx)("div", { className: "mt-3 flex flex-wrap gap-2", children: tags.map((tag) => (0, jsx.jsxs)("span", { className: "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600", children: ["#", String(tag).replace(/^#/, "")] }, `${key}-${tag}`)) }),
      ] }),
      (0, jsx.jsxs)("button", {
        type: "button",
        disabled: !searchText,
        onClick: () => onCopy(key, searchText),
        className: "inline-flex shrink-0 items-center text-sm font-bold text-primaryPurple hover:underline disabled:opacity-50",
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
  const [values, setValues] = (0, React.useState)({ niche: "", region: "", language: "" });
  const [customLoading, setCustomLoading] = (0, React.useState)(false);
  const [customResult, setCustomResult] = (0, React.useState)(null);
  const [customError, setCustomError] = (0, React.useState)("");
  const [customLimit, setCustomLimit] = (0, React.useState)(false);

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

  const submitCustom = async (event) => {
    event.preventDefault();
    if (String(values.niche || "").trim().length < 2) {
      setCustomResult(null);
      setCustomLimit(false);
      setCustomError("Enter a niche of at least 2 characters.");
      return;
    }
    setCustomLoading(true);
    setCustomError("");
    setCustomLimit(false);
    setCustomResult(null);
    try {
      const response = await axios.post(songsUrl, songsRequestBody(values));
      const outcome = interpretAiResponse(response);
      if (outcome.kind === "limit") setCustomLimit(true);
      else if (outcome.kind === "success") setCustomResult(normalizeSongs(outcome.data));
      else setCustomError(outcome.message);
    } catch (error) {
      const outcome = interpretAiError(error);
      if (outcome.kind === "limit") setCustomLimit(true);
      else setCustomError(outcome.message);
    } finally {
      setCustomLoading(false);
    }
  };

  const chips = [{ id: "all", label: "All" }, ...(categories.length ? categories : [{ id: "trending", label: "Trending" }])];
  const isAll = category === "all";

  return (0, jsx.jsxs)("div", {
    className: "flex min-h-screen flex-col bg-[#F8FAFC]",
    children: [
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
            chart.songs.length === 0 ? (0, jsx.jsx)("div", { className: "mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500", children: "No songs in this category yet." }) : chart.songs.map((song, index) => (0, jsx.jsx)(ChartSong, { song, index, isAll, categories, copied, onCopy: copySearch }, `${song.rank ?? index}-${song.title ?? index}`)),
            chart.disclaimer && (0, jsx.jsx)("p", { className: "mx-auto max-w-2xl text-sm leading-relaxed text-gray-500", children: chart.disclaimer }),
            chart.generatedAt && (0, jsx.jsxs)("p", { className: "mx-auto max-w-2xl text-xs font-bold uppercase tracking-widest text-gray-400", children: ["Updated ", String(chart.generatedAt)] }),
          ] }),
          (0, jsx.jsxs)("section", { className: "mt-12", children: [
            (0, jsx.jsx)("h3", { className: "text-center text-2xl font-black text-gray-900", children: "Custom ideas" }),
            (0, jsx.jsx)("p", { className: "mx-auto mt-3 max-w-2xl text-center text-sm font-medium leading-relaxed text-gray-500", children: "Enter a niche. Region and language are optional. This asks the server for free audio ideas. It is not a live Instagram scan." }),
            (0, jsx.jsxs)("form", {
              onSubmit: submitCustom,
              className: "mx-auto mt-6 max-w-2xl space-y-3 rounded-[2rem] border border-gridBorder bg-white p-4 shadow-sm sm:p-6",
              children: [
                fields.map((field) => (0, jsx.jsxs)("label", {
                  className: "block",
                  htmlFor: `songs-${field.name}`,
                  children: [
                    (0, jsx.jsxs)("span", { className: "mb-1 block text-[11px] font-black uppercase tracking-widest text-gray-400", children: [field.label, field.required ? "" : " · optional"] }),
                    (0, jsx.jsx)("input", { id: `songs-${field.name}`, type: "text", maxLength: field.maxLength, placeholder: field.placeholder, value: values[field.name] || "", onChange: (event) => setValues((current) => ({ ...current, [field.name]: event.target.value })), className: "w-full rounded-2xl border border-gridBorder bg-promptBox p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primaryPurple/20 sm:text-base" }),
                  ],
                }, field.name)),
                (0, jsx.jsx)("button", { type: "submit", disabled: customLoading, className: "w-full rounded-2xl bg-primaryPurple px-8 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 sm:w-auto", children: customLoading ? "Finding audio ideas..." : "FIND SONGS" }),
              ],
            }),
            (0, jsx.jsx)("div", { className: "mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2", children: examples.map((example) => (0, jsx.jsx)("button", { type: "button", onClick: () => setValues((current) => ({ ...current, niche: example })), className: "rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gridBorder hover:text-primaryPurple", children: example }, example)) }),
            customLimit && !customLoading && (0, jsx.jsx)(LimitNote, {}),
            !customLimit && (0, jsx.jsx)(ErrorNote, { message: customError }),
            customResult && !customLoading && (0, jsx.jsx)("div", { className: "mt-10", children: (0, jsx.jsx)(SongResults, { result: customResult }) }),
          ] }),
        ],
      }),
      (0, jsx.jsx)(Footer, {}),
    ],
  });
}

export { ViralSongs as default };
