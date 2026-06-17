"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check, BookOpen, Sparkles, Wand2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  totalWeeks: number;
  difficulty: string;
  imageEmoji: string;
  isPublished: boolean;
  sortOrder: number;
  _count: { materials: number; lessons: number };
}

const CATEGORIES = [
  "English", "Science", "Math", "Coding", "Leadership",
  "Digital Skills", "Financial Literacy", "Health & Rights", "Career Skills", "Other",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  totalWeeks: 4,
  difficulty: "Beginner",
  imageEmoji: "📚",
  isPublished: true,
  sortOrder: 0,
};

const AI_EMPTY = {
  topic: "",
  category: "Digital Skills",
  difficulty: "Beginner",
  weeks: 4,
};

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [aiForm, setAiForm] = useState(AI_EMPTY);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = useCallback(async () => {
    const res = await fetch("/api/admin/courses");
    const data = await res.json() as { courses: Course[] };
    setCourses(data.courses ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEdit(c: Course) {
    setEditId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      category: c.category,
      totalWeeks: c.totalWeeks,
      difficulty: c.difficulty,
      imageEmoji: c.imageEmoji,
      isPublished: c.isPublished,
      sortOrder: c.sortOrder,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed-courses", { method: "POST" });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success(data.message ?? "Seeded!", {
        style: { borderRadius: "16px", background: "#3B1347", color: "#fff" },
      });
      await fetchCourses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  async function handleAIGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!aiForm.topic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm),
      });
      const data = await res.json() as { message?: string; error?: string; title?: string };
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      toast.success(data.message ?? `Created "${data.title}"!`, {
        style: { borderRadius: "16px", background: "#3B1347", color: "#fff" },
        duration: 5000,
      });
      setShowAI(false);
      setAiForm(AI_EMPTY);
      await fetchCourses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.category || !form.totalWeeks) {
      setError("Title, category and weeks are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/courses/${editId}` : "/api/admin/courses";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed to save");
      }
      setShowForm(false);
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    if (res.ok) setCourses((c) => c.filter((x) => x.id !== id));
    setDeleteId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} courses total</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={() => setShowAI(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm"
          >
            <Wand2 size={16} /> Generate with AI
          </button>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <Sparkles size={16} />
            {seeding ? "Seeding…" : "Seed 11 Courses"}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors"
          >
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      {courses.length === 0 && !loading && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5 mb-6">
          <p className="font-semibold text-purple-900 mb-1">Library is empty — add courses in 3 ways:</p>
          <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
            <li><strong>Seed 11 Courses</strong> — instantly populates with pre-written English, Math, Science, Coding & Leadership courses</li>
            <li><strong>Generate with AI</strong> — type any topic and Gemini writes a full course with weekly lessons</li>
            <li><strong>Add Course</strong> — create manually and add content yourself</li>
          </ol>
        </div>
      )}

      {/* AI Generate Modal */}
      {showAI && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Wand2 size={18} className="text-purple-600" /> Generate Course with AI
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Gemini will write a full course with weekly lessons</p>
              </div>
              <button onClick={() => { setShowAI(false); setAiForm(AI_EMPTY); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAIGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Topic / Course Idea *</label>
                <input
                  value={aiForm.topic}
                  onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g. Microsoft Excel Basics, Canva for Beginners, Budgeting & Saving Money…"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={aiForm.category}
                    onChange={(e) => setAiForm({ ...aiForm, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={aiForm.difficulty}
                    onChange={(e) => setAiForm({ ...aiForm, difficulty: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Number of Weeks: {aiForm.weeks}</label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={aiForm.weeks}
                  onChange={(e) => setAiForm({ ...aiForm, weeks: parseInt(e.target.value) })}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>2 weeks</span><span>8 weeks</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-700">
                Gemini will write all lesson content automatically. This takes ~30 seconds. You can edit any content afterwards.
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={generating || !aiForm.topic.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating…</>
                  ) : (
                    <><Wand2 size={16} /> Generate Course</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAI(false); setAiForm(AI_EMPTY); }}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">
                {editId ? "Edit Course" : "Add Course"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Emoji Icon</label>
                <input
                  value={form.imageEmoji}
                  onChange={(e) => setForm({ ...form, imageEmoji: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  placeholder="📚"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  placeholder="e.g. Python Basics"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  >
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  >
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total Weeks *</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={form.totalWeeks}
                    onChange={(e) => setForm({ ...form, totalWeeks: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Published (visible to students)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-purple text-white py-2 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Save Changes" : "Add Course"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No courses yet</p>
          <p className="text-sm text-gray-400 mt-1">Use the buttons above to seed or create courses</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-brand-lavender-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {c.imageEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">{c.title}</span>
                  {!c.isPublished && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Draft</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{c.category}</span>
                  <span>·</span>
                  <span>{c.totalWeeks} weeks</span>
                  <span>·</span>
                  <span>{c.difficulty}</span>
                  <span>·</span>
                  <span>{c._count.lessons} videos, {c._count.materials} readings</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(c)}
                  className="p-2 text-gray-400 hover:text-brand-purple transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deleteId === c.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  {deleteId === c.id ? <Check size={15} /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
