"use client";

import { useState } from "react";
import { Heart, Share2, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";

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

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

interface Props {
  post: NewsPost;
  currentUserId: string;
  isAdmin: boolean;
  onLike: (postId: string) => void;
  onEdit: (post: NewsPost) => void;
  onDelete: (postId: string) => void;
}

export function NewsPostCard({ post, currentUserId, isAdmin, onLike, onEdit, onDelete }: Props) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isLiked = post.likes.some((l) => l.userId === currentUserId);
  const authorName = post.author.name ?? post.author.nickname ?? "Her Access Team";

  async function handleShare() {
    const text = post.title ? `${post.title}\n\n${post.content}` : post.content;
    if (navigator.share) {
      await navigator.share({ title: post.title ?? "Her Access Update", text: text.slice(0, 200) });
    } else {
      await navigator.clipboard.writeText(text.slice(0, 300));
    }
  }

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {authorName[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">{authorName}</span>
              <span className="text-xs bg-brand-lavender text-brand-purple px-2 py-0.5 rounded-full font-medium">
                {post.author.isAdmin ? "Founder" : "Team"}
              </span>
            </div>
            <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 min-w-[120px]">
                <button
                  onClick={() => { onEdit(post); setShowMenu(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => { onDelete(post.id); setShowMenu(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        {post.title && (
          <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{post.title}</h3>
        )}
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && !imgError && (
        <div className="relative mx-5 mb-4 rounded-xl overflow-hidden bg-gray-100">
          {!imgLoaded && (
            <div className="w-full h-48 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
          )}
          <Image
            src={post.imageUrl}
            alt={post.title ?? "Post image"}
            width={600}
            height={300}
            className={`w-full h-auto object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-5 pb-4 border-t border-gray-50 pt-3">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            isLiked
              ? "bg-red-50 text-red-500"
              : "text-gray-500 hover:bg-gray-50 hover:text-red-400"
          }`}
        >
          <Heart size={15} className={isLiked ? "fill-red-500" : ""} />
          <span>{post.likesCount}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-brand-purple transition-all"
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
