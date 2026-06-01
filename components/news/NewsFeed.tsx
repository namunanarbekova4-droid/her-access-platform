"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Megaphone } from "lucide-react";
import { NewsPostCard } from "./NewsPostCard";
import { CreatePostModal } from "./CreatePostModal";

interface NewsPost {
  id: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
  likesCount: number;
  createdAt: string;
  author: { id: string; name: string | null; nickname: string | null; isAdmin: boolean };
  likes: { userId: string }[];
}

interface Props {
  currentUserId: string;
  isAdmin: boolean;
}

function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-2.5 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-3/5" />
      </div>
    </div>
  );
}

export function NewsFeed({ currentUserId, isAdmin }: Props) {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editPost, setEditPost] = useState<NewsPost | null>(null);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/news");
    const data = await res.json() as { posts: NewsPost[] };
    setPosts(data.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  async function handleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isLiked = p.likes.some((l) => l.userId === currentUserId);
        return {
          ...p,
          likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
          likes: isLiked
            ? p.likes.filter((l) => l.userId !== currentUserId)
            : [...p.likes, { userId: currentUserId }],
        };
      })
    );
    await fetch(`/api/news/${postId}/like`, { method: "POST" });
  }

  async function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    await fetch(`/api/news/${postId}`, { method: "DELETE" });
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Updates from the Her Access team</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors"
          >
            <Plus size={16} /> Post
          </button>
        )}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-brand-lavender rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Megaphone size={28} className="text-brand-purple" />
          </div>
          <p className="font-semibold text-gray-800 text-lg">No announcements yet</p>
          <p className="text-sm text-gray-400 mt-1">Exciting things are coming — stay tuned!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <NewsPostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onLike={handleLike}
              onEdit={(p) => setEditPost(p)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {(showCreate || editPost) && (
        <CreatePostModal
          post={editPost}
          onClose={() => { setShowCreate(false); setEditPost(null); }}
          onSaved={() => { setShowCreate(false); setEditPost(null); fetchPosts(); }}
        />
      )}
    </div>
  );
}
