import { r as interop } from "./rolldown-runtime-hePW80VL.js";
import { C as CopyIcon, N as ReactNS, c as AlertIcon, w as ClockIcon } from "./vendor-icons-CD2Hvhn_.js";
import { t as jsxRuntime } from "./vendor-react-Ch6a_wip.js";
import { t as axios } from "./vendor-axios-DhiQ7QLW.js";
import { r as artUrl, t as Footer } from "./index-RMZ4YpJu.js";
import { c as serviceById, u as PageHeader } from "./BusinessFacts-Dps7jRTH.js";
import { i as interpretAiResponse, r as interpretAiError } from "./aiFeature-Cx7U9uqu.js";
import { Masonry, PhotoFrame, PhotoMeta } from "./photoFrame.js";

const React = interop(ReactNS(), 1);
const jsx = jsxRuntime();
const service = serviceById("art");

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
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    return "";
  }
  return "";
}

function readOk(response) {
  const judged = interpretAiResponse(response);
  if (judged.kind === "limit") return judged;
  const data = response?.data ?? {};
  if (data && typeof data === "object" && (Array.isArray(data) || Array.isArray(data.trends) || Array.isArray(data.categories) || Array.isArray(data.items) || data.status === "success")) {
    return { kind: "success", data };
  }
  return judged;
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

function CopyBlock({ label, text, buttonLabel = "Copy" }) {
  const [copied, setCopied] = (0, React.useState)(false);
  if (!text) return null;
  return (0, jsx.jsxs)("div", {
    className: "mt-4 rounded-2xl border border-gridBorder bg-promptBox p-4",
    children: [
      (0, jsx.jsx)("p", { className: "text-[11px] font-black uppercase tracking-widest text-gray-400", children: label }),
      (0, jsx.jsx)("p", { className: "mt-2 text-sm leading-relaxed text-gray-700", style: { whiteSpace: "pre-wrap" }, children: text }),
      (0, jsx.jsxs)("button", {
        type: "button",
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          } catch {
            setCopied(false);
          }
        },
        className: "mt-3 inline-flex items-center text-sm font-bold text-primaryPurple hover:underline",
        children: [(0, jsx.jsx)(CopyIcon, { size: 16, className: "mr-1" }), copied ? "Copied" : buttonLabel],
      }),
    ],
  });
}

function ArtVisual({ trend, onMetrics }) {
  const src = safeHttpUrl(trend?.image_url);
  if (!src) {
    return (0, jsx.jsx)("div", {
      className: "flex w-full items-end bg-gradient-to-r from-primaryPurple to-secondaryBlue p-5",
      style: { aspectRatio: "4 / 5" },
      children: (0, jsx.jsx)("span", { className: "text-lg font-black text-white", children: trend?.name || "Trend" }),
    });
  }
  return (0, jsx.jsx)(PhotoFrame, { src, alt: trend?.name || "", meta: trend, hideCaption: true, onMetrics });
}

function TrendFooter({ meta, title, aside }) {
  return (0, jsx.jsxs)("div", {
    className: "p-3",
    children: [
      meta?.caption ? (0, jsx.jsx)(PhotoMeta, { caption: meta.caption, orient: meta.orient }) : null,
      (0, jsx.jsx)("h3", { className: `${meta?.caption ? "mt-2 " : ""}font-bold text-gray-800 text-sm line-clamp-1`, children: title }),
      aside ? (0, jsx.jsx)("div", { className: "mt-2 flex items-center justify-between", children: aside }) : null,
    ],
  });
}

function TrendTile({ trend, aside, onOpen }) {
  const [meta, setMeta] = (0, React.useState)(null);
  return (0, jsx.jsxs)("button", {
    type: "button",
    onClick: () => onOpen(trend),
    className: "w-full overflow-hidden rounded-[2rem] border border-gridBorder bg-white text-left shadow-sm transition-all hover:shadow-lg",
    children: [
      (0, jsx.jsx)(ArtVisual, { trend, onMetrics: setMeta }),
      (0, jsx.jsx)(TrendFooter, {
        meta,
        title: trend.name || "Untitled trend",
        aside: aside ? (0, jsx.jsx)("span", { className: "truncate text-[10px] font-extrabold uppercase tracking-wider text-accentPink", style: { minWidth: 0 }, children: aside }) : null,
      }),
    ],
  });
}

function ArtTrends() {
  const [categories, setCategories] = (0, React.useState)([]);
  const [category, setCategory] = (0, React.useState)("");
  const [trends, setTrends] = (0, React.useState)([]);
  const [disclaimer, setDisclaimer] = (0, React.useState)("");
  const [generatedAt, setGeneratedAt] = (0, React.useState)("");
  const [loading, setLoading] = (0, React.useState)(true);
  const [error, setError] = (0, React.useState)("");
  const [limit, setLimit] = (0, React.useState)(false);
  const [selected, setSelected] = (0, React.useState)(null);
  const dialogRef = (0, React.useRef)(null);

  (0, React.useEffect)(() => {
    let cancel = false;
    (async () => {
      try {
        const response = await axios.get(`${artUrl}/categories`);
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") {
          setLimit(true);
          setLoading(false);
          return;
        }
        const next = normalizeCategories(outcome.kind === "success" ? outcome.data : {});
        setCategories(next);
        setCategory(pickDefault(next));
      } catch (err) {
        if (cancel) return;
        const outcome = interpretAiError(err);
        if (outcome.kind === "limit") {
          setLimit(true);
          setLoading(false);
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
      setLoading(true);
      setError("");
      setLimit(false);
      setSelected(null);
      try {
        const response = await axios.get(`${artUrl}/browse`, { params: { category } });
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") setLimit(true);
        else if (outcome.kind === "success") {
          const data = outcome.data || {};
          setTrends(Array.isArray(data.trends) ? data.trends : []);
          setDisclaimer(typeof data.disclaimer === "string" ? data.disclaimer : "");
          setGeneratedAt(data.generated_at || "");
        } else setError(outcome.message || "Could not load trends.");
      } catch (err) {
        if (cancel) return;
        const outcome = interpretAiError(err);
        if (outcome.kind === "limit") setLimit(true);
        else setError(outcome.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [category]);

  (0, React.useEffect)(() => {
    if (!selected) return undefined;
    dialogRef.current?.focus();
    const onKey = (event) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

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
            (0, jsx.jsx)("p", { className: "mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500 sm:text-base", children: "Browse AI art trends. Open a card to read the full prompt and copy it." }),
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
          loading && (0, jsx.jsxs)("div", {
            role: "status",
            className: "mx-auto mt-8 max-w-2xl rounded-[2rem] border border-gridBorder bg-white p-8 text-center shadow-sm",
            children: [
              (0, jsx.jsx)("div", { className: "mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" }),
              (0, jsx.jsx)("p", { className: "font-bold text-gray-800", children: "Loading trends..." }),
            ],
          }),
          limit && !loading && (0, jsx.jsx)(LimitNote, {}),
          !limit && (0, jsx.jsx)(ErrorNote, { message: error }),
          !loading && !limit && !error && (0, jsx.jsxs)("div", { className: "mt-8", children: [
            trends.length === 0 ? (0, jsx.jsx)("div", { className: "mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500", children: "No trends in this category yet." }) : (0, jsx.jsx)(Masonry, {
              children: trends.map((trend, index) => (0, jsx.jsx)(TrendTile, {
                trend,
                aside: isAll && trend.category ? categoryLabel(trend.category, categories) : "",
                onOpen: setSelected,
              }, trend.id ?? `${trend.name ?? "trend"}-${index}`)),
            }),
            disclaimer && (0, jsx.jsx)("p", { className: "mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-500", children: disclaimer }),
            generatedAt && (0, jsx.jsxs)("p", { className: "mx-auto mt-2 max-w-2xl text-xs font-bold uppercase tracking-widest text-gray-400", children: ["Updated ", String(generatedAt)] }),
          ] }),
        ],
      }),
      selected && (0, jsx.jsx)("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
        onClick: () => setSelected(null),
        children: (0, jsx.jsxs)("div", {
          ref: dialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "trend-title",
          tabIndex: -1,
          onClick: (event) => event.stopPropagation(),
          className: "w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm outline-none sm:p-8",
          style: { maxHeight: "90vh" },
          children: [
            (0, jsx.jsx)(ArtVisual, { trend: selected }),
            (0, jsx.jsx)("h3", { id: "trend-title", className: "mt-4 text-2xl font-black text-gray-900", children: selected.name || "Untitled trend" }),
            selected.category && (0, jsx.jsx)("p", { className: "mt-1 text-xs font-bold uppercase tracking-widest text-gray-400", children: categoryLabel(selected.category, categories) }),
            selected.why_it_works && (0, jsx.jsx)("p", { className: "mt-3 text-sm leading-relaxed text-gray-600", children: selected.why_it_works }),
            (0, jsx.jsx)(CopyBlock, { label: "Prompt", text: selected.prompt, buttonLabel: "Copy prompt" }),
            (0, jsx.jsx)(CopyBlock, { label: "Negative prompt", text: selected.negative_prompt }),
            (0, jsx.jsx)("button", { type: "button", onClick: () => setSelected(null), className: "mt-6 rounded-2xl bg-primaryPurple px-8 py-4 font-bold text-white", children: "Close" }),
          ],
        }),
      }),
      (0, jsx.jsx)(Footer, {}),
    ],
  });
}

export { ArtTrends as default };
