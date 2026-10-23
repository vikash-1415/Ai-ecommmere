import { useState, useEffect } from "react";
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Filter,
  Sparkles,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProductReviews({ productId, productName }) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average: 4.8,
    total: 3,
    distribution: { 5: 75, 4: 25, 3: 0, 2: 0, 1: 0 },
    counts: { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("helpful");
  const [filterRating, setFilterRating] = useState("All");

  // Write Review Modal / Form State
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = `?sort=${sort}${filterRating !== "All" ? `&rating=${filterRating}` : ""}`;
      const data = await api.getProductReviews(productId, params);
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.warn("Reviews load notice:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId, sort, filterRating]);

  const handleVoteHelpful = async (reviewId) => {
    try {
      const res = await api.voteReviewHelpful(reviewId);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, helpfulCount: res.helpfulCount, hasVoted: true } : r
          )
        );
      }
    } catch (err) {
      alert(err.message || "Already voted");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!formRating) {
      setFormError("Please select a star rating");
      return;
    }
    if (!formBody.trim() || formBody.trim().length < 5) {
      setFormError("Please enter at least a few words describing your experience");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const res = await api.submitReview(productId, {
        rating: formRating,
        title: formTitle.trim(),
        body: formBody.trim(),
      });

      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowWriteModal(false);
          setSubmitSuccess(false);
          setFormTitle("");
          setFormBody("");
          setFormRating(5);
          loadReviews();
        }, 1200);
      }
    } catch (err) {
      setFormError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-slate-200/80 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Customer Feedback
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
              Ratings & Reviews
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowWriteModal(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            <Plus size={16} />
            Write a Review
          </button>
        </div>

        {/* STATS & BREAKDOWN GRID */}
        <div className="mt-8 grid gap-8 rounded-3xl border border-slate-100 bg-slate-50/60 p-6 sm:p-8 lg:grid-cols-[300px_1fr]">
          {/* LEFT: AVERAGE RATING SCORE */}
          <div className="flex flex-col justify-center border-b border-slate-200/60 pb-6 lg:border-b-0 lg:border-r lg:pr-8">
            <span className="text-5xl font-black text-slate-950">{stats.average || "4.8"}</span>
            <div className="mt-2 flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(stats.average || 5) ? "currentColor" : "none"}
                  className={i < Math.floor(stats.average || 5) ? "text-amber-400" : "text-slate-300"}
                />
              ))}
            </div>
            <p className="mt-2 text-xs font-bold text-slate-500">
              Based on {stats.total || reviews.length} verified customer ratings
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck size={14} />
              <span>100% Authentic verified buyer reviews</span>
            </div>
          </div>

          {/* RIGHT: STAR DISTRIBUTION BARS */}
          <div className="flex flex-col justify-center space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = stats.distribution?.[star] || 0;
              const count = stats.counts?.[star] || 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="flex min-w-10 items-center gap-1">
                    {star} <Star size={12} fill="currentColor" className="text-amber-400" />
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="min-w-8 text-right text-[11px] text-slate-400">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* FILTERS & SORT BAR */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* STAR FILTER PILLS */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1">Filter:</span>
            {["All", "5", "4", "3", "2", "1"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterRating(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  filterRating === s
                    ? "bg-slate-950 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {s === "All" ? "All Stars" : `${s} ★`}
              </button>
            ))}
          </div>

          {/* SORT DROPDOWN */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs outline-none focus:border-slate-900"
            >
              <option value="helpful">Most Helpful</option>
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-100 p-5 space-y-3">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-48 rounded bg-slate-200" />
                  <div className="h-12 w-full rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center">
              <MessageSquare size={32} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-800">No reviews matching this filter</p>
              <p className="mt-1 text-xs text-slate-500">
                Be the first to share your experience with {productName}.
              </p>
              <button
                type="button"
                onClick={() => setShowWriteModal(true)}
                className="mt-4 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Write a Review
              </button>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? "currentColor" : "none"}
                            className={i < rev.rating ? "text-amber-400" : "text-slate-200"}
                          />
                        ))}
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">{rev.userName}</span>
                    </div>

                    {rev.isVerifiedPurchase && (
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 size={13} />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {rev.title && (
                  <h4 className="mt-3 text-sm font-extrabold text-slate-900">{rev.title}</h4>
                )}

                <p className="mt-1.5 text-xs sm:text-sm leading-6 text-slate-600">{rev.body}</p>

                {/* HELPFUL VOTE BUTTON */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-400 text-[11px]">Was this review helpful to you?</span>
                  <button
                    type="button"
                    onClick={() => handleVoteHelpful(rev._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 active:scale-95"
                  >
                    <ThumbsUp size={13} className="text-slate-600" />
                    Helpful ({rev.helpfulCount || 0})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WRITE A REVIEW MODAL */}
      {showWriteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setShowWriteModal(false)}
          />

          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Write a Review</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWriteModal(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
                <h4 className="mt-3 text-base font-extrabold text-slate-900">
                  Review Submitted!
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Thank you for helping fellow shoppers with your valuable feedback.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                {/* RATING STARS */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Overall Rating *</label>
                  <div className="mt-1.5 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormRating(star)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                      >
                        <Star
                          size={24}
                          fill={(hoverRating || formRating) >= star ? "currentColor" : "none"}
                          className={
                            (hoverRating || formRating) >= star ? "text-amber-400" : "text-slate-300"
                          }
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {formRating} Star{formRating > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Review Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Excellent waterproof protection in monsoon!"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Your Review *</label>
                  <textarea
                    rows={4}
                    required
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    placeholder="What did you like or dislike? How did it hold up in the weather?"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3.5 text-xs font-semibold outline-none focus:border-slate-900"
                  />
                </div>

                {formError && (
                  <p className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                    <AlertCircle size={13} /> {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-slate-950 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Post Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
