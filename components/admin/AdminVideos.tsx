"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { Plus, Pencil, Trash2, X, Check, Video, ExternalLink, Upload, Link, FolderOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  totalWeeks: number;
}

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  category: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: string | null;
  language: string;
  isPublished: boolean;
  sortOrder: number;
  courseId: string | null;
  weekNumber: number | null;
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
  "Other",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  videoUrl: "",
  thumbnailUrl: "",
  duration: "",
  language: "en",
  isPublished: true,
  sortOrder: 0,
  courseId: "",
  weekNumber: "",
};

export function AdminVideos() {
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [urlMode, setUrlMode] = useState<"link" | "drive" | "upload">("link");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchVideos = useCallback(async () => {
    const [vRes, cRes] = await Promise.all([
      fetch("/api/admin/videos"),
      fetch("/api/admin/courses"),
    ]);
    const vData = await vRes.json() as { videos: VideoLesson[] };
    const cData = await cRes.json() as { courses: Course[] };
    setVideos(vData.videos ?? []);
    setCourses(cData.courses ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
    setUrlMode("link");
    setShowForm(true);
  }

  function openEdit(v: VideoLesson) {
    setEditId(v.id);
    setForm({
      title: v.title,
      description: v.description ?? "",
      category: v.category,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl ?? "",
      duration: v.duration ?? "",
      language: v.language,
      isPublished: v.isPublished,
      sortOrder: v.sortOrder,
      courseId: v.courseId ?? "",
      weekNumber: v.weekNumber?.toString() ?? "",
    });
    setError("");
    setUrlMode("link");
    setShowForm(true);
  }

  async function handleFileUpload(file: File) {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    setError("");
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        onUploadProgress: ({ percentage }) => setUploadProgress(Math.round(percentage)),
      });
      setForm((f) => ({ ...f, videoUrl: blob.url }));
      setUploadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function convertDriveLink(url: string): string {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.videoUrl.trim() || !form.category) {
      setError("Title, video and category are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/videos/${editId}` : "/api/admin/videos";
      const method = editId ? "PATCH" : "POST";
      const payload = {
        ...form,
        courseId: form.courseId || null,
        weekNumber: form.weekNumber ? parseInt(form.weekNumber) : null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed to save");
      }
      setShowForm(false);
      await fetchVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setVideos((v) => v.filter((x) => x.id !== id));
    }
    setDeleteId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Lessons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{videos.length} lessons total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">
                {editId ? "Edit Video" : "Add Video Lesson"}
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
                  placeholder="e.g. Introduction to Python"
                />
              </div>

              {/* Video source toggle */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Video Source *</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <button type="button" onClick={() => setUrlMode("link")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${urlMode === "link" ? "bg-brand-purple text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    <Link size={14} /> YouTube / URL
                  </button>
                  <button type="button" onClick={() => setUrlMode("drive")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${urlMode === "drive" ? "bg-brand-purple text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    <Upload size={14} /> Google Drive
                  </button>
                  <button type="button" onClick={() => { setUrlMode("upload"); fileInputRef.current?.click(); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${urlMode === "upload" ? "bg-brand-purple text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    <FolderOpen size={14} /> From Device
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {urlMode === "link" && (
                  <input
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                )}

                {urlMode === "drive" && (
                  <div className="space-y-2">
                    <input
                      value={form.videoUrl}
                      onChange={(e) => setForm({ ...form, videoUrl: convertDriveLink(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      placeholder="Paste Google Drive share link..."
                    />
                    <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 space-y-1">
                      <p className="font-medium">How to share from Google Drive:</p>
                      <p>1. Upload video to Google Drive</p>
                      <p>2. Right-click → &ldquo;Share&rdquo; → &ldquo;Anyone with the link&rdquo;</p>
                      <p>3. Copy link and paste above</p>
                    </div>
                    {form.videoUrl && <p className="text-xs text-green-600">✓ Link ready</p>}
                  </div>
                )}

                {urlMode === "upload" && (
                  <div className="space-y-2">
                    {uploading ? (
                      <div className="space-y-1">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-brand-purple h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p className="text-xs text-gray-500">Uploading… {uploadProgress}%</p>
                      </div>
                    ) : form.videoUrl && form.videoUrl.includes("blob.vercel") ? (
                      <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                        <Check size={14} className="text-green-600" />
                        <p className="text-xs text-green-700 truncate flex-1">Video uploaded successfully</p>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-gray-500 hover:text-gray-700 underline">Change</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-brand-purple hover:text-brand-purple transition-colors">
                        <FolderOpen size={24} />
                        <span className="text-sm">Tap to select video from your device</span>
                        <span className="text-xs">MP4, MOV, WebM — up to 500MB</span>
                      </button>
                    )}
                  </div>
                )}
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
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
                  placeholder="Brief description of the lesson..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail URL</label>
                  <input
                    value={form.thumbnailUrl}
                    onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    placeholder="e.g. 12:30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link to Course</label>
                  <select
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  >
                    <option value="">None (standalone)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Week Number</label>
                  <input
                    type="number"
                    min={1}
                    value={form.weekNumber}
                    onChange={(e) => setForm({ ...form, weekNumber: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    placeholder="e.g. 1"
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
                  {saving ? "Saving..." : editId ? "Save Changes" : "Add Video"}
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

      {/* Video list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Video size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No videos yet</p>
          <p className="text-sm text-gray-400 mt-1">Click &ldquo;Add Video&rdquo; to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Video size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">{v.title}</span>
                  {!v.isPublished && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Draft</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{v.category}</span>
                  {v.duration && <span>· {v.duration}</span>}
                  <span>· {v.language.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={v.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Open video"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => openEdit(v)}
                  className="p-2 text-gray-400 hover:text-brand-purple transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={deleteId === v.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deleteId === v.id ? <Check size={15} /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
