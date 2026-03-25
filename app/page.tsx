import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Слушайте своих клиентов с <span className="text-blue-600">FeedbackPulse</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Удобные виджеты для сбора отзывов, простая аналитика и всё, что нужно для улучшения вашей работы — в одном месте.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Перейти в Дашборд <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}