"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  username: string;
  avatar_url: string;
}

interface ReviewStats {
  count: number;
  average: number;
}

interface Props {
  toolSlug: string;
  toolName: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-lg ${
            star <= value ? "text-yellow-500" : "text-text-muted/30"
          } ${readonly ? "cursor-default" : "cursor-pointer hover:text-yellow-400"} transition-colors`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function ReviewSection({ toolSlug, toolName }: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ count: 0, average: 0 });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?tool=${toolSlug}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch {
      // silently fail
    } finally {
      setLoaded(true);
    }
  }, [toolSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || comment.length < 10) {
      setError("Select a rating and write at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug, rating, comment }),
      });

      if (res.ok) {
        setRating(0);
        setComment("");
        fetchReviews();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted">
            Community Reviews
          </h2>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-10 bg-surface-secondary rounded-lg" />
          <div className="h-24 bg-surface-secondary rounded-lg" />
          <div className="h-16 bg-surface-secondary rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono font-semibold text-sm uppercase tracking-wider text-text-muted">
          Community Reviews
        </h2>
        {stats.count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(stats.average)} readonly />
            <span className="text-sm font-mono text-text-primary font-semibold">
              {stats.average}
            </span>
            <span className="text-xs font-mono text-text-muted">
              ({stats.count} {stats.count === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {/* Review form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            {(session.user?.image) && (
              <img
                src={session.user.image}
                alt=""
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm font-mono text-text-secondary">
              {session.user?.name}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono text-text-muted">Your rating</span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`What's your experience with ${toolName}?`}
            rows={3}
            maxLength={500}
            className="input-field resize-none mb-2"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted">
              {comment.length}/500
            </span>
            <button
              type="submit"
              disabled={submitting || !rating || comment.length < 10}
              className="px-4 py-2 rounded-lg brand-gradient text-white text-sm font-mono font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
          {error && (
            <p className="text-xs font-mono text-red-400 mt-2">{error}</p>
          )}
        </form>
      ) : (
        <button
          onClick={() => signIn("github")}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-surface-secondary border border-border hover:border-brand-500/40 text-sm font-mono text-text-secondary hover:text-brand-400 transition-all flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Sign in with GitHub to leave a review
        </button>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-t border-border pt-4">
              <div className="flex items-center gap-3 mb-2">
                {review.avatar_url && (
                  <img
                    src={review.avatar_url}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-sm font-mono text-text-primary">
                  {review.username}
                </span>
                <StarRating value={review.rating} readonly />
                <span className="text-xs font-mono text-text-muted ml-auto">
                  {timeAgo(review.created_at)}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted font-mono text-center py-4">
          No reviews yet. Be the first to review {toolName}.
        </p>
      )}
    </div>
  );
}
