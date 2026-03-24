"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function WidgetFeedbackPage() {
  const params = useParams() as { widgetId: string };
  const currentWidgetId = params.widgetId;

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: supabaseError } = await supabase
      .from("feedback")
      .insert([
        {
          widget_id: currentWidgetId,
          rating,
          review,
          name: name.trim() || null,
          email: email.trim() || null,
        },
      ]);

    setLoading(false);

    if (supabaseError) {
      setError("Не удалось отправить отзыв. Попробуйте позже.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "transparent",
      }}
    >
      <Card className="w-full max-w-md bg-white bg-opacity-90 shadow-md border">
        <CardHeader>
          <CardTitle className="text-center text-2xl mb-2">Оцените наш сервис</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-semibold text-xl mb-1">Спасибо за ваш отзыв!</div>
              <div className="text-muted-foreground text-sm">Ваше мнение очень важно для нас.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium ">Рейтинг</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      aria-label={`Оценка ${val}`}
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(val)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors
                          ${((hoverRating || rating) >= val) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                          ${((hoverRating || rating) >= val) ? "" : "fill-none"}
                        `}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="review" className="text-sm font-medium">
                  Ваш отзыв
                </label>
                <Textarea
                  id="review"
                  required
                  minLength={3}
                  maxLength={1000}
                  rows={3}
                  placeholder="Напишите ваш отзыв здесь..."
                  value={review}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReview(e.target.value)}
                  className="resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm">Имя (необязательно)</label>
                <Input
                  id="name"
                  type="text"
                  maxLength={80}
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm">Email (необязательно)</label>
                <Input
                  id="email"
                  type="email"
                  maxLength={120}
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  autoComplete="email"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <CardFooter className="p-0 pt-2 flex flex-col items-stretch">
                <Button
                  type="submit"
                  disabled={loading || rating < 1 || review.length < 3}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Отправка..." : "Отправить отзыв"}
                </Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}