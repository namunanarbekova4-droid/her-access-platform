"use client";

import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";

interface Props {
  post?: { id: string; title: string | null; content: string; imageUrl: string | null } | null;
  onClose: () => void;
  onSaved: () => void;
}

export function CreatePostModal({ post, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) { setError("Content is required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = post ? `/api/news/${post.id}` : "/api/news";
      const method = post ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || null, content, imageUrl: imageUrl || null }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed to save");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">{post ? "Edit Post" : "Create Announcement"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-xl">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 font-medium"
              placeholder="Title (optional)"
            />
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
              placeholder="Share an announcement, opportunity, or update with your community..."
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{content.length} chars</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1.5">
              <ImageIcon size={13} /> Image URL (optional)
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-purple text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Publishing..." : post ? "Save Changes" : "Publish"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
