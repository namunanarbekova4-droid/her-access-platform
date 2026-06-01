"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check, Library } from "lucide-react";

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  language: string;
  duration: string | null;
  difficulty: string | null;
  createdAt: string;
}

const CATEGORIES = [
  "STEM & Science",
  "Digital Skills",
  "Leadership",
  "Entrepreneurship",
  "Health & Wellbeing",
  "Arts & Creativity",
  "Language & Literacy",
  "Life Skills",
  "Stories & Inspiration",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  content: "",
  language: "en",
  duration: "",
  difficulty: "",
};

export function AdminLibrary() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/admin/library");
    const data = await res.json() as { items: LibraryItem[] };
    setItems(data.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEdit(item: LibraryItem) {
    setEditId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      language: item.language,
      duration: item.duration ?? "",
      difficulty: item.difficulty ?? "",
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      setError("Title, category and content are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/library/${editId}` : "/api/admin/library";
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
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    const res = await fetch(`/api/admin/library/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((i) => i.filter((x) => x.id !== id));
    }
    setDeleteId(null);
  }

  const difficultyColor = (d: string | null) => {
    if (d === "beginner") return "bg-green-100 text-green-700";
    if (d === "intermediate") return "bg-yellow-100 text-yellow-700";
    if (d === "advanced") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} items total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">
                {editId ? "Edit Library Item" : "Add Library Item"}
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  placeholder="e.g. Introduction to Programming"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Content * <span className="text-gray-400 font-normal">(article text, markdown supported)</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-y font-mono"
                  placeholder="Write the full article content here...&#10;&#10;You can use **bold**, *italic*, and # headings."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  >
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="ky">Kyrgyz</option>
                    <option value="kk">Kazakh</option>
                    <option value="ar">Arabic</option>
                    <option value="fa">Persian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Read time</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    placeholder="5 min"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  >
                    <option value="">None</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-purple text-white py-2 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Save Changes" : "Add Item"}
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

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Library size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No library items yet</p>
          <p className="text-sm text-gray-400 mt-1">Click &ldquo;Add Item&rdquo; to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Library size={18} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">{item.title}</span>
                  {item.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{item.category}</span>
                  {item.duration && <span>· {item.duration}</span>}
                  <span>· {item.language.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 text-gray-400 hover:text-brand-purple transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteId === item.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deleteId === item.id ? <Check size={15} /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
