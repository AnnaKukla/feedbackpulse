"use client";
import { useState } from "react";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Подключаем базу данных (используем ключи, которые Vercel уже знает)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PublicWidgetPage({ params }: { params: { widgetId: string } }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки

  // Функция отправки в базу данных
  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsLoading(true); // Включаем крутилку загрузки

    // Отправляем данные в таблицу feedback
    const { error } = await supabase
      .from("feedback")
      .insert([
        {
          widget_id: params.widgetId, // ID виджета берем прямо из ссылки
          rating: rating,
          text: text,
        }
      ]);

    setIsLoading(false); // Выключаем крутилку

    if (error) {
      alert("Произошла ошибка при отправке. Попробуйте еще раз.");
      console.error(error);
    } else {
      setIsSubmitted(true); // Показываем экран "Спасибо!"
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold mb-2">Спасибо за отзыв!</h2>
          <p className="text-slate-600">Ваша обратная связь помогает делать консультации еще лучше.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border">
        <h2 className="mb-4 text-center text-xl font-bold">Оцените работу</h2>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-10 w-10 cursor-pointer transition-colors ${
                star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          className="w-full rounded-xl border p-3 mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          placeholder="Что вам понравилось или что можно улучшить?"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isLoading}
          className="w-full rounded-xl bg-slate-900 py-3 text-white flex justify-center items-center gap-2 transition-all hover:bg-slate-800 disabled:bg-slate-300"
        >
          {/* Если грузится — показываем крутилку, если нет — текст */}
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Отправить"}
        </button>
      </div>
    </div>
  );
}