"use client";
import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";

export default function PublicWidgetPage() {
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold">Спасибо за отзыв!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border">
        <h2 className="mb-4 text-center text-xl font-bold">Оцените работу</h2>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-10 w-10 cursor-pointer ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          className="w-full rounded-xl border p-3 mb-4"
          placeholder="Напишите ваш отзыв здесь..."
          rows={3}
        />
        <button
          onClick={() => setIsSubmitted(true)}
          disabled={rating === 0}
          className="w-full rounded-xl bg-slate-900 py-3 text-white disabled:bg-slate-300"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}