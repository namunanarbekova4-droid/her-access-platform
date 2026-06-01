"use client";

import { useState, useEffect, useCallback } from "react";
import { StarRating } from "./StarRating";
import { Star, CheckCircle } from "lucide-react";

interface Review {
  id: string;
  reviewText: string;
  rating: number;
  anonymous: boolean;
  status: string;
  createdAt: string;
  user: { name: string | null; nickname: string | null };
}

interface Props {
  currentUserId: string;
}

export function ReviewsPage({ currentUserId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json() as { reviews: Review[]; averageRating: number };
    setReviews(data.reviews ?? []);
    setAverageRating(data.averageRating ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please select a rating"); return; }
    if (!reviewText.trim()) { setError("Please write your review"); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText, rating, anonymous }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        if (d.error?.includes("already submitted")) { setHasReviewed(true); return; }
        throw new Error(d.error ?? "Failed to submit");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  void currentUserId;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">Hear from our community of learners</p>
      </div>

      {/* Average rating display */}
      {!loading && reviews.length > 0 && (
        <div className="bg-gradient-to-br from-brand-purple to-purple-700 rounded-2xl p-5 mb-6 text-white flex items-center gap-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div>
            <StarRating value={Math.round(averageRating)} readonly size={18} />
            <p className="text-white/70 text-xs mt-1">{reviews.length} verified reviews</p>
          </div>
        </div>
      )}

      {/* Submit form */}
      {submitted ? (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6 text-center">
          <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
          <p className="font-semibold text-green-800">Thank you for your review!</p>
          <p className="text-sm text-green-600 mt-1">It will appear after approval.</p>
        </div>
      ) : hasReviewed ? (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-center text-sm text-blue-700">
          You&apos;ve already submitted a review. Thank you!
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Share Your Experience</h2>
          {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Your Rating *</label>
              <StarRating value={rating} onChange={setRating} size={28} />
            </div>
            <div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
                placeholder="How has Her Access helped you? Share your story..."
              />
              <p className="text-xs text-gray-400 text-right mt-1">{reviewText.length}/500</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Post anonymously</span>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-purple text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Approved reviews */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(s => <div key={s} className="w-4 h-4 bg-gray-200 rounded" />)}
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Star size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="font-medium text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const displayName = review.anonymous
              ? "Anonymous Learner"
              : review.user.nickname ?? review.user.name ?? "Learner";
            return (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <StarRating value={review.rating} readonly size={14} />
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{review.reviewText}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">{displayName}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
