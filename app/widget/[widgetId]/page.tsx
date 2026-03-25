"use client";

import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";

export default function PublicWidgetPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Что происходит при нажатии на кнопку "Отправить"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return; // Не даем отправить без оценки
    
    // Позже здесь будет логика отправки в базу данных (Supabase)
    // А пока просто показываем экран успеха:
    setIsSubmitted(true);
  };

  // Если форма отправлена, показываем экран благодарности
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-100">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold text-slate-800">Спасибо за ваш отзыв!</h2>
          <p className="text-slate-600">Ваше мнение очень ценно и помогает делать работу лучше.</p>
        </div>
      </div>
    );
  }

  // Сама форма отзыва
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">Оцените нашу работу</h2>

        <form onSubmit={