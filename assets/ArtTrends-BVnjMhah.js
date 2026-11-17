import { r as interop } from "./rolldown-runtime-hePW80VL.js";
import { C as CopyIcon, N as ReactNS, c as AlertIcon, s as Sparkles, w as ClockIcon } from "./vendor-icons-CD2Hvhn_.js";
import { t as jsxRuntime } from "./vendor-react-Ch6a_wip.js";
import { t as axios } from "./vendor-axios-DhiQ7QLW.js";
import { r as artUrl, t as Footer } from "./index-RMZ4YpJu.js";
import { c as serviceById, u as PageHeader } from "./BusinessFacts-Dps7jRTH.js";
import { a as normalizeArt, i as interpretAiResponse, n as artRequestBody, r as interpretAiError } from "./aiFeature-Cx7U9uqu.js";
import { n as ReportList } from "./AiToolScreen-ISyi6LGU.js";
import { Masonry, PhotoFrame, PhotoMeta } from "./photoFrame.js";

const React = interop(ReactNS(), 1);
const jsx = jsxRuntime();
const service = serviceById("art");
const fields = [
  { name: "niche", label: "Niche", required: true, maxLength: 80, placeholder: "ceramics" },
  { name: "platform", label: "Platform", maxLength: 40, placeholder: "Leave blank for Instagram" },
];
const examples = ["Ceramics", "Portrait", "Product photo", "Festive"];

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

function IdeaCard({ trend }) {
  const [meta, setMeta] = (0, React.useState)(null);
  return (0, jsx.jsxs)("article", {
    className: "overflow-hidden rounded-[2rem] border border-gridBorder bg-white shadow-sm",
    children: [
      trend.imageUrl ? (0, jsx.jsx)(PhotoFrame, { src: trend.imageUrl, alt: trend.name || "", meta: { image_url: trend.imageUrl }, hideCaption: true, onMetrics: setMeta }) : null,
      (0, jsx.jsxs)("div", { className: "p-3", children: [
        meta?.caption ? (0, jsx.jsx)(PhotoMeta, { caption: meta.caption, orient: meta.orient }) : null,
        (0, jsx.jsx)("h3", { className: `${meta?.caption ? "mt-2 " : ""}font-bold text-gray-800 text-sm line-clamp-1`, children: trend.name }),
        trend.why && (0, jsx.jsx)("p", { className: "mt-3 text-sm leading-relaxed text-gray-600", children: trend.why }),
        trend.visualCues.length > 0 && (0, jsx.jsx)("div", { className: "mt-3 flex flex-wrap gap-2", children: trend.visualCues.map((cue) => (0, jsx.jsx)("span", { className: "rounded-full bg-pink-50 px-2.5 py-1 text-xs font-bold text-accentPink", children: cue }, cue)) }),
        trend.caption && (0, jsx.jsxs)("p", { className: "mt-3 text-sm text-gray-700", children: [(0, jsx.jsx)("span", { className: "font-black text-gray-400", children: "Caption · " }), trend.caption] }),
        trend.prompt && (0, jsx.jsx)(CopyBlock, { label: "Prompt", text: trend.prompt, buttonLabel: "Copy prompt" }),
        trend.negativePrompt && (0, jsx.jsx)(CopyBlock, { label: "Negative prompt", text: trend.negativePrompt }),
      ] }),
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

function ArtResults({ result }) {
  const hasBody = result.summary || result.trends.length || result.workflow.length;
  if (!hasBody) {
    return (0, jsx.jsx)("div", { className: "mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500", children: "The report came back empty. Try a different niche." });
  }
  const context = [result.niche, result.platform].filter(Boolean).join(" · ");
  return (0, jsx.jsxs)("div", {
    className: "space-y-6",
    children: [
      (result.summary || result.disclaimer) && (0, jsx.jsxs)("div", {
        className: "rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm sm:p-8",
        children: [
          (0, jsx.jsxs)("div", { className: "mb-3 flex items-center text-accentPink", children: [(0, jsx.jsx)(Sparkles, { size: 20, className: "mr-2" }), (0, jsx.jsx)("h3", { className: "text-lg font-black text-gray-900", children: "Style notes" })] }),
          result.summary && (0, jsx.jsx)("p", { className: "text-sm leading-relaxed text-gray-700 sm:text-base", children: result.summary }),
          context && (0, jsx.jsx)("p", { className: "mt-3 text-xs font-bold uppercase tracking-widest text-gray-400", children: context }),
          result.disclaimer && (0, jsx.jsx)("p", { className: "mt-4 text-sm leading-relaxed text-gray-500", children: result.disclaimer }),
        ],
      }),
      result.trends.length > 0 && (0, jsx.jsx)(Masonry, {
        children: result.trends.map((trend) => (0, jsx.jsx)(IdeaCard, { trend }, trend.id)),
      }),
      (0, jsx.jsx)(ReportList, { title: "Workflow", items: result.workflow }),
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
  const [values, setValues] = (0, React.useState)({ niche: "", platform: "" });
  const [customLoading, setCustomLoading] = (0, React.useState)(false);
  const [customResult, setCustomResult] = (0, React.useState)(null);
  const [customError, setCustomError] = (0, React.useState)("");
  const [customLimit, setCustomLimit] = (0, React.useState)(false);

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
      const response = await axios.post(artUrl, artRequestBody(values));
      const outcome = interpretAiResponse(response);
      if (outcome.kind === "limit") setCustomLimit(true);
      else if (outcome.kind === "success") setCustomResult(normalizeArt(outcome.data));
      else setCustomError(outcome.message);
    } catch (err) {
      const outcome = interpretAiError(err);
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
          (0, jsx.jsxs)("section", { className: "mt-12", children: [
            (0, jsx.jsx)("h3", { className: "text-center text-2xl font-black text-gray-900", children: "Custom ideas" }),
            (0, jsx.jsx)("p", { className: "mx-auto mt-3 max-w-2xl text-center text-sm font-medium leading-relaxed text-gray-500", children: "Enter a niche. Platform is optional and defaults to Instagram on the server. This asks for free style notes and original prompts. It is not a live Instagram scrape." }),
            (0, jsx.jsxs)("form", {
              onSubmit: submitCustom,
              className: "mx-auto mt-6 max-w-2xl space-y-3 rounded-[2rem] border border-gridBorder bg-white p-4 shadow-sm sm:p-6",
              children: [
                fields.map((field) => (0, jsx.jsxs)("label", {
                  className: "block",
                  htmlFor: `art-${field.name}`,
                  children: [
                    (0, jsx.jsxs)("span", { className: "mb-1 block text-[11px] font-black uppercase tracking-widest text-gray-400", children: [field.label, field.required ? "" : " · optional"] }),
                    (0, jsx.jsx)("input", { id: `art-${field.name}`, type: "text", maxLength: field.maxLength, placeholder: field.placeholder, value: values[field.name] || "", onChange: (event) => setValues((current) => ({ ...current, [field.name]: event.target.value })), className: "w-full rounded-2xl border border-gridBorder bg-promptBox p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primaryPurple/20 sm:text-base" }),
                  ],
                }, field.name)),
                (0, jsx.jsx)("button", { type: "submit", disabled: customLoading, className: "w-full rounded-2xl bg-primaryPurple px-8 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 sm:w-auto", children: customLoading ? "Checking AI art trends..." : "SHOW TRENDS" }),
              ],
            }),
            (0, jsx.jsx)("div", { className: "mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2", children: examples.map((example) => (0, jsx.jsx)("button", { type: "button", onClick: () => setValues((current) => ({ ...current, niche: example })), className: "rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gridBorder hover:text-primaryPurple", children: example }, example)) }),
            customLimit && !customLoading && (0, jsx.jsx)(LimitNote, {}),
            !customLimit && (0, jsx.jsx)(ErrorNote, { message: customError }),
            customResult && !customLoading && (0, jsx.jsx)("div", { className: "mt-10", children: (0, jsx.jsx)(ArtResults, { result: customResult }) }),
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
