"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, Clock } from "lucide-react";
import { StarRating } from "@/components/reviews/StarRating";

interface Review {
  id: string;
  reviewText: string;
  rating: number;
  anonymous: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: { name: string | null; nickname: string | null; email: string | null };
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json() as { reviews: Review[] };
    setReviews(data.reviews ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const filtered = filter === "ALL" ? reviews : reviews.filter((r) => r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

  const statusColor = (s: string) => {
    if (s === "APPROVED") return "bg-green-100 text-green-700";
    if (s === "REJECTED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount} pending review{pendingCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filter === f ? "bg-brand-purple text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            {f === "PENDING" && pendingCount > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Clock size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No {filter.toLowerCase()} reviews</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <StarRating value={review.rating} readonly size={13} />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{review.reviewText}</p>
                  <p className="text-xs text-gray-400">
                    {review.anonymous ? "Anonymous" : (review.user.nickname ?? review.user.name ?? review.user.email ?? "User")}
                    {" · "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {review.status !== "APPROVED" && (
                    <button
                      onClick={() => updateStatus(review.id, "APPROVED")}
                      className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                      title="Approve"
                    >
                      <Check size={15} />
                    </button>
                  )}
                  {review.status !== "REJECTED" && (
                    <button
                      onClick={() => updateStatus(review.id, "REJECTED")}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                      title="Reject"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
