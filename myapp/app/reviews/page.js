"use client";

import { useState, useEffect, useCallback } from "react";
import { reviewsByRating } from "./reviews";

const GOOGLE_REVIEW_URL = "https://g.page/r/CbPeGrBI5kFMEBM/review";
const SHOP_NAME = "Optical Galaxy";



const starLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function OpticalGalaxyReview() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const typeReview = useCallback((text) => {
    setIsTyping(true);
    setReviewText("");
    let i = 0;
    const interval = setInterval(() => {
      setReviewText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 14);
    return () => clearInterval(interval);
  }, []);

  const generateReview = useCallback(
    (r = rating, idx = null) => {
      const pool = reviewsByRating[r] || reviewsByRating[3];
      const nextIdx = idx !== null ? idx : Math.floor(Math.random() * pool.length);
      setCurrentReviewIndex(nextIdx);
      typeReview(pool[nextIdx % pool.length]);
    },
    [rating, typeReview]
  );

  useEffect(() => {
    generateReview(5, 0);
  }, []);

  const handleRating = (val) => {
    setRating(val);
    generateReview(val, 0);
  };

  const handleRegenerate = () => {
    const pool = reviewsByRating[rating] || reviewsByRating[3];
    let next;
    do { next = Math.floor(Math.random() * pool.length); }
    while (pool.length > 1 && next === currentReviewIndex);
    generateReview(rating, next);
  };

  const handlePost = async () => {
    try {
      await navigator.clipboard.writeText(reviewText);
    } catch {
      const el = document.createElement("textarea");
      el.value = reviewText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => {
      window.open(GOOGLE_REVIEW_URL, "_blank");
      setTimeout(() => setDone(true), 800);
    }, 400);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-200">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Thank you!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your review means a lot to us. It helps others in the community find quality eye care.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 tracking-widest uppercase">Optical Galaxy</p>
          </div>
        </div>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        .review-font { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        .cursor-blink::after {
          content: '|';
          animation: blink 0.8s step-end infinite;
          color: #d97706;
          font-weight: 300;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .fade-in { animation: fadeIn 0.5s ease both; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .slide-up { animation: slideUp 0.6s ease both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>

      <div className="review-font min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">

        {/* Header */}
        <div className="slide-up text-center mb-10">
          {/* Logo mark */}
          <div className="w-14 h-14 mx-auto mb-4 relative">
            <div className="w-14 h-14 rounded-full border-2 border-amber-300 flex items-center justify-center bg-white shadow-sm">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                {/* Glasses icon */}
                <path d="M4 20 Q4 14 10 14 Q16 14 16 20 Q16 26 10 26 Q4 26 4 20Z" stroke="#d97706" strokeWidth="2" fill="none"/>
                <path d="M24 20 Q24 14 30 14 Q36 14 36 20 Q36 26 30 26 Q24 26 24 20Z" stroke="#d97706" strokeWidth="2" fill="none"/>
                <path d="M16 20 L24 20" stroke="#d97706" strokeWidth="2"/>
                <circle cx="10" cy="20" r="2.5" fill="#d97706" opacity="0.4"/>
                <circle cx="30" cy="20" r="2.5" fill="#d97706" opacity="0.4"/>
              </svg>
            </div>
          </div>

          <h1 className="display-font text-3xl font-medium text-gray-900 tracking-wide">
            {SHOP_NAME}
          </h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
            Eye Care · Lenses · Frames
          </p>
        </div>

        {/* Main card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden slide-up" style={{ animationDelay: '0.1s' }}>

          {/* Card header strip */}
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
            <p className="text-sm font-medium text-amber-800">
              How was your experience with us?
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Your review helps others find quality eye care
            </p>
          </div>

          <div className="px-6 py-6 space-y-6">

            {/* Star Rating */}
            <div>
              <label className="text-xs font-medium text-gray-400 tracking-widest uppercase block mb-3">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform duration-100 hover:scale-110 focus:outline-none"
                  >
                    <svg
                      className="w-8 h-8 transition-colors duration-150"
                      viewBox="0 0 24 24"
                      fill={val <= displayRating ? "#f59e0b" : "none"}
                      stroke={val <= displayRating ? "#f59e0b" : "#d1d5db"}
                      strokeWidth="1.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-sm font-medium text-amber-600">
                  {starLabels[displayRating]}
                </span>
              </div>
            </div>

            {/* AI Review */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                  Your Review
                </label>
                <span className="text-xs text-amber-500 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4zm-1 4h2v5h-2V8zm0 6h2v2h-2v-2z"/>
                  </svg>
                  AI generated
                </span>
              </div>

              <div className="relative bg-stone-50 rounded-xl border border-gray-200 p-4 min-h-[110px]">
                <p className={`text-sm text-gray-700 leading-relaxed ${isTyping ? 'cursor-blink' : ''}`}>
                  {reviewText || <span className="text-gray-300">Generating your review...</span>}
                </p>
              </div>

              {!isTyping && reviewText && (
                <button
                  onClick={handleRegenerate}
                  className="mt-2 text-xs text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate another version
                </button>
              )}
            </div>

            {/* How it works */}
            <div className="bg-stone-50 rounded-xl p-4 space-y-2.5">
              {[
                { n: "1", t: "Copy & open Google below" },
                { n: "2", t: "Paste the review (long press → Paste)" },
                { n: "3", t: "Tap submit — you're done!" },
              ].map(({ n, t }) => (
                <div key={n} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {n}
                  </span>
                  <span className="text-xs text-gray-500">{t}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handlePost}
              disabled={isTyping || !reviewText}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-sm py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied! Opening Google...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy & Open Google Review
                </>
              )}
            </button>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-gray-300 tracking-widest uppercase slide-up" style={{ animationDelay: '0.2s' }}>
          Optical Galaxy · Trusted Eye Care
        </p>

      </div>
    </>
  );
}