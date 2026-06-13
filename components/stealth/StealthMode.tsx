"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type StealthTheme = "recipe" | "weather" | "news" | "calculator";

interface StealthModeProps {
  theme: StealthTheme;
  onExit: () => void;
}

// ─── Recipe Theme ────────────────────────────────────────────────────────────

const recipes = [
  { id: 1, name: "Classic Margherita Pizza", emoji: "🍕", time: "45 min", difficulty: "Easy", description: "A timeless Italian pizza with fresh tomatoes, mozzarella, and basil on a crispy crust.", ingredients: ["Pizza dough", "Tomato sauce", "Fresh mozzarella", "Basil leaves", "Olive oil"], steps: ["Preheat oven to 500°F (260°C)", "Stretch dough into a 12-inch circle", "Spread tomato sauce evenly", "Add torn mozzarella pieces", "Bake 10-12 minutes until golden", "Top with fresh basil and a drizzle of olive oil"] },
  { id: 2, name: "Creamy Mushroom Risotto", emoji: "🍄", time: "35 min", difficulty: "Medium", description: "A rich, velvety Italian rice dish with earthy mushrooms and Parmesan cheese.", ingredients: ["Arborio rice", "Mixed mushrooms", "Vegetable broth", "Parmesan", "White wine", "Onion"], steps: ["Sauté onion in butter until soft", "Add mushrooms and cook 5 minutes", "Toast rice 2 minutes", "Add wine and stir until absorbed", "Add warm broth ladle by ladle", "Finish with Parmesan and black pepper"] },
  { id: 3, name: "Lemon Blueberry Muffins", emoji: "🫐", time: "30 min", difficulty: "Easy", description: "Light, fluffy muffins bursting with fresh blueberries and bright lemon zest.", ingredients: ["Flour", "Blueberries", "Lemon zest", "Eggs", "Butter", "Vanilla", "Baking powder"], steps: ["Preheat oven to 375°F", "Mix dry ingredients in one bowl", "Whisk wet ingredients separately", "Fold together gently", "Fold in blueberries last", "Bake 20-22 minutes until golden"] },
  { id: 4, name: "Thai Green Curry", emoji: "🥘", time: "25 min", difficulty: "Easy", description: "Aromatic and creamy Thai curry with vegetables and coconut milk.", ingredients: ["Green curry paste", "Coconut milk", "Mixed vegetables", "Jasmine rice", "Lime", "Fish sauce"], steps: ["Heat oil in a wok", "Fry curry paste 1 minute", "Pour in coconut milk", "Add vegetables and simmer 10 min", "Season with fish sauce and lime", "Serve over jasmine rice"] },
  { id: 5, name: "Chocolate Lava Cake", emoji: "🍫", time: "20 min", difficulty: "Medium", description: "Decadent individual chocolate cakes with a warm molten center.", ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla extract"], steps: ["Melt chocolate and butter together", "Whisk in eggs and sugar", "Fold in flour gently", "Pour into greased ramekins", "Refrigerate 30 minutes", "Bake 12 minutes at 425°F"] },
];

function RecipeTheme({ onExit }: { onExit: () => void }) {
  const [selected, setSelected] = useState<typeof recipes[0] | null>(null);
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="fixed inset-0 z-[9999] bg-orange-50 overflow-y-auto">
      <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👩‍🍳</span>
            <span className="text-xl font-bold text-orange-700">RecipeNook</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            {["Recipes", "Tutorials", "Tips", "Community"].map((n) => (
              <span key={n} className="cursor-pointer hover:text-orange-600">{n}</span>
            ))}
          </nav>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm">👤</div>
        </div>
      </header>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Discover Delicious Recipes</h1>
        <p className="text-orange-100">From quick weeknight dinners to weekend baking adventures</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {["🍕 Italian","🍜 Asian","🥗 Healthy","🍰 Desserts","🥘 One-Pot","🥦 Vegetarian"].map((c) => (
            <span key={c} className="whitespace-nowrap px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-orange-100 hover:bg-orange-50 cursor-pointer">{c}</span>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((r) => (
            <div key={r.id} onClick={() => setSelected(r)} className="bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
              <div className="h-40 bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center text-6xl">{r.emoji}</div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{r.difficulty}</span>
                  <span className="text-xs text-gray-500">{r.time}</span>
                </div>
                <h3 className="font-semibold text-gray-800">{r.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-2xl p-6 border border-orange-100">
          <h3 className="font-bold text-gray-800 mb-4">🌟 Cooking Tips of the Day</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Always read the full recipe before starting to cook</li>
            <li>• Mise en place — prep all ingredients before you begin</li>
            <li>• Let meat rest before cutting to keep it juicy</li>
            <li>• Season pasta water generously with salt</li>
          </ul>
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-10 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center text-5xl mb-3">{selected.emoji}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{selected.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{selected.description}</p>
            <h3 className="font-semibold text-gray-700 mb-2">Ingredients</h3>
            <ul className="space-y-1 mb-4">{selected.ingredients.map((i) => <li key={i} className="text-sm text-gray-600 flex items-center gap-2"><span className="text-orange-400">•</span>{i}</li>)}</ul>
            <h3 className="font-semibold text-gray-700 mb-2">Steps</h3>
            <ol className="space-y-2">{selected.steps.map((s, i) => <li key={i} className="text-sm text-gray-600 flex gap-3"><span className="font-bold text-orange-500 flex-shrink-0">{i + 1}.</span>{s}</li>)}</ol>
          </div>
        </div>
      )}
      <div className="fixed bottom-4 right-4">
        <button onMouseEnter={() => setShowHint(true)} onMouseLeave={() => setShowHint(false)} onClick={onExit} className="w-8 h-8 rounded-full bg-orange-100 opacity-20 hover:opacity-50 transition-opacity" aria-label="Exit safe mode" />
        {showHint && <div className="absolute bottom-10 right-0 bg-white text-xs text-gray-500 px-3 py-1.5 rounded-xl shadow border whitespace-nowrap">Ctrl+Shift+H to exit</div>}
      </div>
    </div>
  );
}

// ─── Weather Theme ────────────────────────────────────────────────────────────

const CITIES = [
  { name: "New York", country: "US", emoji: "🌤", temp: 18, feels: 16, humidity: 62, wind: 14, condition: "Partly Cloudy", forecast: [{ day: "Mon", emoji: "🌤", hi: 19, lo: 12 }, { day: "Tue", emoji: "🌧", hi: 14, lo: 9 }, { day: "Wed", emoji: "⛈", hi: 12, lo: 8 }, { day: "Thu", emoji: "🌦", hi: 15, lo: 10 }, { day: "Fri", emoji: "☀️", hi: 22, lo: 13 }, { day: "Sat", emoji: "☀️", hi: 24, lo: 14 }, { day: "Sun", emoji: "🌤", hi: 21, lo: 12 }] },
  { name: "London", country: "GB", emoji: "🌧", temp: 11, feels: 9, humidity: 80, wind: 22, condition: "Light Rain", forecast: [{ day: "Mon", emoji: "🌧", hi: 12, lo: 7 }, { day: "Tue", emoji: "🌦", hi: 13, lo: 8 }, { day: "Wed", emoji: "🌤", hi: 15, lo: 9 }, { day: "Thu", emoji: "☀️", hi: 17, lo: 10 }, { day: "Fri", emoji: "🌤", hi: 16, lo: 9 }, { day: "Sat", emoji: "🌧", hi: 12, lo: 7 }, { day: "Sun", emoji: "🌧", hi: 11, lo: 6 }] },
  { name: "Tokyo", country: "JP", emoji: "☀️", temp: 24, feels: 26, humidity: 55, wind: 8, condition: "Sunny", forecast: [{ day: "Mon", emoji: "☀️", hi: 25, lo: 18 }, { day: "Tue", emoji: "☀️", hi: 26, lo: 19 }, { day: "Wed", emoji: "🌤", hi: 24, lo: 17 }, { day: "Thu", emoji: "🌦", hi: 21, lo: 15 }, { day: "Fri", emoji: "🌧", hi: 19, lo: 14 }, { day: "Sat", emoji: "🌤", hi: 23, lo: 16 }, { day: "Sun", emoji: "☀️", hi: 26, lo: 18 }] },
  { name: "Paris", country: "FR", emoji: "🌤", temp: 15, feels: 13, humidity: 70, wind: 18, condition: "Mostly Cloudy", forecast: [{ day: "Mon", emoji: "🌤", hi: 16, lo: 10 }, { day: "Tue", emoji: "☀️", hi: 19, lo: 11 }, { day: "Wed", emoji: "☀️", hi: 21, lo: 12 }, { day: "Thu", emoji: "🌤", hi: 18, lo: 11 }, { day: "Fri", emoji: "🌦", hi: 15, lo: 9 }, { day: "Sat", emoji: "🌧", hi: 13, lo: 8 }, { day: "Sun", emoji: "🌤", hi: 16, lo: 9 }] },
];

function WeatherTheme({ onExit }: { onExit: () => void }) {
  const [cityIdx, setCityIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const city = CITIES[cityIdx]!;
  const bgClass = city.condition.includes("Rain") || city.condition.includes("Storm") ? "from-slate-700 to-slate-900" : city.condition.includes("Cloud") ? "from-blue-400 to-slate-600" : "from-sky-400 to-blue-600";

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-100 overflow-y-auto">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <span className="text-lg font-bold text-blue-700">WeatherNow</span>
          </div>
          <div className="flex gap-2">
            {CITIES.map((c, i) => (
              <button key={c.name} onClick={() => setCityIdx(i)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${i === cityIdx ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-50"}`}>{c.name}</button>
            ))}
          </div>
        </div>
      </header>

      <div className={`bg-gradient-to-br ${bgClass} text-white py-12 px-4`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-100 text-sm font-medium mb-1">{city.name}, {city.country}</p>
          <div className="flex items-start gap-6">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-8xl">{city.emoji}</span>
                <div>
                  <p className="text-7xl font-thin">{city.temp}°</p>
                  <p className="text-blue-200 text-lg">{city.condition}</p>
                </div>
              </div>
              <div className="flex gap-6 mt-4 text-sm text-blue-100">
                <span>Feels like {city.feels}°</span>
                <span>💧 {city.humidity}%</span>
                <span>💨 {city.wind} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">7-Day Forecast</h3>
          <div className="grid grid-cols-7 gap-2 text-center">
            {city.forecast.map((f) => (
              <div key={f.day} className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-500">{f.day}</span>
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-sm font-semibold text-gray-800">{f.hi}°</span>
                <span className="text-xs text-gray-400">{f.lo}°</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Humidity", value: `${city.humidity}%`, emoji: "💧" },
            { label: "Wind Speed", value: `${city.wind} km/h`, emoji: "💨" },
            { label: "Feels Like", value: `${city.feels}°C`, emoji: "🌡️" },
            { label: "UV Index", value: city.temp > 20 ? "High" : "Low", emoji: "☀️" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <span className="text-2xl">{s.emoji}</span>
              <p className="text-lg font-semibold text-gray-800 mt-1">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button onMouseEnter={() => setShowHint(true)} onMouseLeave={() => setShowHint(false)} onClick={onExit} className="w-8 h-8 rounded-full bg-blue-200 opacity-20 hover:opacity-50 transition-opacity" aria-label="Exit safe mode" />
        {showHint && <div className="absolute bottom-10 right-0 bg-white text-xs text-gray-500 px-3 py-1.5 rounded-xl shadow border whitespace-nowrap">Ctrl+Shift+H to exit</div>}
      </div>
    </div>
  );
}

// ─── News Theme ───────────────────────────────────────────────────────────────

const NEWS_ARTICLES = [
  { id: 1, category: "Technology", tag: "TECH", emoji: "💻", headline: "Advances in Solar Panel Efficiency Break Previous Records", summary: "New perovskite solar cells achieve 33.7% efficiency in laboratory tests, potentially transforming the renewable energy landscape.", time: "2 hours ago", author: "Sarah Chen", readTime: "4 min read" },
  { id: 2, category: "Health", tag: "HEALTH", emoji: "🏥", headline: "Mediterranean Diet Linked to Improved Cognitive Function in New Study", summary: "A 5-year longitudinal study of 12,000 participants shows significant cognitive benefits from regular adherence to Mediterranean dietary patterns.", time: "4 hours ago", author: "Dr. James Park", readTime: "6 min read" },
  { id: 3, category: "Environment", tag: "GREEN", emoji: "🌿", headline: "Global Tree-Planting Initiative Surpasses One Billion Trees Milestone", summary: "The international coalition's reforestation effort has restored over 2.3 million hectares of degraded land across 47 countries.", time: "6 hours ago", author: "Maria Santos", readTime: "3 min read" },
  { id: 4, category: "Science", tag: "SCIENCE", emoji: "🔭", headline: "James Webb Telescope Captures Clearest Image of Distant Galaxy Formation", summary: "Astronomers reveal stunning images showing galaxies merging just 400 million years after the Big Bang, rewriting formation timelines.", time: "8 hours ago", author: "Prof. Elena Watts", readTime: "5 min read" },
  { id: 5, category: "Education", tag: "EDUCATION", emoji: "📚", headline: "Finland Introduces AI Literacy as Core Curriculum Subject in All Schools", summary: "Beginning next academic year, Finnish students from age 7 will learn fundamentals of artificial intelligence and critical digital thinking.", time: "10 hours ago", author: "Annika Virtanen", readTime: "4 min read" },
  { id: 6, category: "Business", tag: "BUSINESS", emoji: "📈", headline: "Remote Work Productivity Study Challenges Return-to-Office Mandates", summary: "A Stanford University study of 60,000 employees finds remote workers 13% more productive than office counterparts, reigniting workplace debate.", time: "12 hours ago", author: "Tom Bradley", readTime: "7 min read" },
];

const TAG_COLORS: Record<string, string> = {
  TECH: "bg-blue-50 text-blue-700",
  HEALTH: "bg-green-50 text-green-700",
  GREEN: "bg-emerald-50 text-emerald-700",
  SCIENCE: "bg-purple-50 text-purple-700",
  EDUCATION: "bg-amber-50 text-amber-700",
  BUSINESS: "bg-orange-50 text-orange-700",
};

function NewsTheme({ onExit }: { onExit: () => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const categories = ["All", "Technology", "Health", "Environment", "Science", "Education", "Business"];
  const filtered = activeCategory === "All" ? NEWS_ARTICLES : NEWS_ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-50 overflow-y-auto">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📰</span>
              <span className="text-lg font-bold text-gray-900">DailyBrief</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Friday, June 13, 2025</span>
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">👤</div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeCategory === c ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{c}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {filtered[0] && (
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpanded(expanded === filtered[0]!.id ? null : filtered[0]!.id)}>
            <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-8xl">{filtered[0].emoji}</div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${TAG_COLORS[filtered[0].tag] ?? "bg-gray-100 text-gray-700"}`}>{filtered[0].tag}</span>
                <span className="text-xs text-gray-400">{filtered[0].time}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{filtered[0].headline}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{filtered[0].summary}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                <span>By {filtered[0].author}</span>
                <span>·</span>
                <span>{filtered[0].readTime}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.slice(1).map((article) => (
            <div key={article.id} onClick={() => setExpanded(expanded === article.id ? null : article.id)} className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow flex gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">{article.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${TAG_COLORS[article.tag] ?? "bg-gray-100 text-gray-700"}`}>{article.tag}</span>
                  <span className="text-xs text-gray-400">{article.time}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{article.headline}</h3>
                <AnimatePresence>
                  {expanded === article.id && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-gray-500 leading-relaxed overflow-hidden">{article.summary}</motion.p>
                  )}
                </AnimatePresence>
                <p className="text-xs text-gray-400 mt-1">{article.readTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button onMouseEnter={() => setShowHint(true)} onMouseLeave={() => setShowHint(false)} onClick={onExit} className="w-8 h-8 rounded-full bg-gray-200 opacity-20 hover:opacity-50 transition-opacity" aria-label="Exit safe mode" />
        {showHint && <div className="absolute bottom-10 right-0 bg-white text-xs text-gray-500 px-3 py-1.5 rounded-xl shadow border whitespace-nowrap">Ctrl+Shift+H to exit</div>}
      </div>
    </div>
  );
}

// ─── Calculator Theme ─────────────────────────────────────────────────────────

function CalculatorTheme({ onExit }: { onExit: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const pressDigit = (d: string) => {
    if (resetNext) { setDisplay(d); setResetNext(false); return; }
    setDisplay(display === "0" ? d : display.length < 12 ? display + d : display);
  };
  const pressDot = () => {
    if (resetNext) { setDisplay("0."); setResetNext(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };
  const pressOp = (o: string) => {
    setPrev(display); setOp(o); setResetNext(true);
  };
  const pressEqual = () => {
    if (!prev || !op) return;
    const a = parseFloat(prev), b = parseFloat(display);
    let result = 0;
    if (op === "+") result = a + b;
    else if (op === "−") result = a - b;
    else if (op === "×") result = a * b;
    else if (op === "÷") result = b !== 0 ? a / b : 0;
    const str = parseFloat(result.toPrecision(10)).toString();
    setDisplay(str.length > 12 ? result.toExponential(4) : str);
    setPrev(null); setOp(null); setResetNext(true);
  };
  const pressPercent = () => setDisplay(String(parseFloat(display) / 100));
  const pressPlusMinus = () => setDisplay(String(-parseFloat(display)));
  const pressClear = () => { setDisplay("0"); setPrev(null); setOp(null); setResetNext(false); };

  type BtnDef = { label: string; type: "func" | "op" | "digit" | "zero" | "eq"; action: () => void };
  const buttons: BtnDef[][] = [
    [{ label: "AC", type: "func", action: pressClear }, { label: "+/-", type: "func", action: pressPlusMinus }, { label: "%", type: "func", action: pressPercent }, { label: "÷", type: "op", action: () => pressOp("÷") }],
    [{ label: "7", type: "digit", action: () => pressDigit("7") }, { label: "8", type: "digit", action: () => pressDigit("8") }, { label: "9", type: "digit", action: () => pressDigit("9") }, { label: "×", type: "op", action: () => pressOp("×") }],
    [{ label: "4", type: "digit", action: () => pressDigit("4") }, { label: "5", type: "digit", action: () => pressDigit("5") }, { label: "6", type: "digit", action: () => pressDigit("6") }, { label: "−", type: "op", action: () => pressOp("−") }],
    [{ label: "1", type: "digit", action: () => pressDigit("1") }, { label: "2", type: "digit", action: () => pressDigit("2") }, { label: "3", type: "digit", action: () => pressDigit("3") }, { label: "+", type: "op", action: () => pressOp("+") }],
    [{ label: "0", type: "zero", action: () => pressDigit("0") }, { label: ".", type: "digit", action: pressDot }, { label: "=", type: "eq", action: pressEqual }],
  ];

  const btnClass = (type: BtnDef["type"]) => {
    const base = "flex items-center justify-center rounded-full text-2xl font-light cursor-pointer select-none active:scale-95 transition-transform";
    if (type === "func") return `${base} bg-[#a5a5a5] text-black h-16 w-16`;
    if (type === "op") return `${base} bg-[#ff9f0a] text-white h-16 w-16`;
    if (type === "eq") return `${base} bg-[#ff9f0a] text-white h-16 w-16`;
    if (type === "zero") return `${base} bg-[#333333] text-white h-16 w-[8.5rem] justify-start pl-6`;
    return `${base} bg-[#333333] text-white h-16 w-16`;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="w-full max-w-[320px] px-4">
        {/* Display */}
        <div className="text-right mb-4 px-2">
          {op && <p className="text-gray-500 text-lg">{prev} {op}</p>}
          <p className="text-white font-light leading-none" style={{ fontSize: display.length > 9 ? "2.5rem" : "5rem" }}>{display}</p>
        </div>
        {/* Buttons */}
        <div className="space-y-3">
          {buttons.map((row, ri) => (
            <div key={ri} className="flex gap-3 justify-center">
              {row.map((btn) => (
                <button key={btn.label} onClick={btn.action} className={btnClass(btn.type)}>{btn.label}</button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <button onMouseEnter={() => setShowHint(true)} onMouseLeave={() => setShowHint(false)} onClick={onExit} className="w-8 h-8 rounded-full bg-gray-700 opacity-20 hover:opacity-50 transition-opacity" aria-label="Exit safe mode" />
        {showHint && <div className="absolute bottom-10 right-0 bg-white text-xs text-gray-500 px-3 py-1.5 rounded-xl shadow border whitespace-nowrap">Ctrl+Shift+H to exit</div>}
      </div>
    </div>
  );
}

// ─── Main StealthMode ─────────────────────────────────────────────────────────

export function StealthMode({ theme, onExit }: StealthModeProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === "H") onExit();
  }, [onExit]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
        {theme === "recipe" && <RecipeTheme onExit={onExit} />}
        {theme === "weather" && <WeatherTheme onExit={onExit} />}
        {theme === "news" && <NewsTheme onExit={onExit} />}
        {theme === "calculator" && <CalculatorTheme onExit={onExit} />}
      </motion.div>
    </AnimatePresence>
  );
}
