"use client";
export const dynamic = 'force-dynamic';


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { Star, MessageSquare, Gauge, Puzzle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Компонент для отображения рейтинга звёздами
function Stars({ value, max = 5 }: { value: number; max?: number }) {
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
        }
        if (i === fullStars && hasHalf) {
          return (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400"
              style={{
                clipPath: "inset(0 50% 0 0)",
                fill: "#facc15",
                stroke: "#a16207",
              }}
            />
          );
        }
        return <Star key={i} className="w-4 h-4 text-muted-foreground" />;
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState({
    total: 0,
    avg: 0,
    month: 0,
    widgets: 0,
  });

  const [chart, setChart] = useState<{ date: string; avg: number }[]>([]);
  const [reviews, setReviews] = useState<
    {
      id: string;
      stars: number;
      text: string;
      author: string | null;
      created_at: string;
    }[]
  >([]);

  // Получаю org_id пользователя (через org_members)
  const fetchData = async () => {
    setLoading(true);
    let orgId: string | null = null;
    // 1. Получаем текущего пользователя
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    // 2. Получаем org_id из org_members
    const { data: orgs } = await supabase
      .from("org_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1);
    orgId = orgs?.[0]?.organization_id ?? null;
    if (!orgId) {
      setLoading(false);
      return;
    }

    // 3. Получаем виджеты организации
    const { data: widgets } = await supabase
      .from("widgets")
      .select("id")
      .eq("organization_id", orgId);
    const widgetIds = widgets?.map((w: any) => w.id) ?? [];

    // 4. Получаем отзывы для этих виджетов
    let { data: reviewsData } = await supabase
      .from("feedbacks")
      .select("id,stars,text,author,created_at,widget_id")
      .in("widget_id", widgetIds)
      .order("created_at", { ascending: false });

    reviewsData = reviewsData || [];

    // Карточки
    const total = reviewsData.length;
    const monthReviews = reviewsData.filter((r: any) => {
      const date = new Date(r.created_at);
      const now = new Date();
      return (
        date >= new Date(now.getFullYear(), now.getMonth(), 1) &&
        date <= now
      );
    }).length;
    const avg =
      total === 0
        ? 0
        : Number(
            (
              reviewsData.reduce((s: number, r: any) => s + (r.stars || 0), 0) /
              total
            ).toFixed(2)
          );

    // Виджеты считаются активными, если связан хотя бы 1 отзыв
    const widgetSet = new Set(
      reviewsData.map((r: any) => r.widget_id)
    );
    const activeWidgets = widgetSet.size;

    setCards({
      total,
      avg,
      month: monthReviews,
      widgets: activeWidgets,
    });

    // График — средняя оценка по дням за последние 30 дней
    const days: { [d: string]: number[] } = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      days[key] = [];
    }
    reviewsData.forEach((r: any) => {
      const d = r.created_at.slice(0, 10);
      if (days[d]) days[d].push(r.stars || 0);
    });
    const chartData = Object.entries(days).map(([date, stars]) => ({
      date: date.slice(5), // MM-DD
      avg:
        stars.length === 0
          ? 0
          : Number((stars.reduce((s, a) => s + a, 0) / stars.length).toFixed(2)),
    }));
    setChart(chartData);

    // Последние 5 отзывов
    setReviews(
      reviewsData.slice(0, 5).map((r: any) => ({
        id: r.id,
        stars: r.stars,
        text: r.text,
        author: r.author,
        created_at: r.created_at,
      }))
    );

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Дашборд</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <MessageSquare className="text-muted-foreground" />
              <CardTitle className="text-base font-medium">Всего отзывов</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="w-24 h-7" /> : <span className="text-2xl font-bold">{cards.total}</span>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Star className="text-yellow-400" />
              <CardTitle className="text-base font-medium">Средняя оценка</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-24 h-7" />
              ) : (
                <span className="flex items-center gap-2 text-2xl font-bold">
                  {cards.avg}
                  <Stars value={cards.avg} />
                </span>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Gauge className="text-muted-foreground" />
              <CardTitle className="text-base font-medium">Отзывов за месяц</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="w-24 h-7" /> : <span className="text-2xl font-bold">{cards.month}</span>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Puzzle className="text-muted-foreground" />
              <CardTitle className="text-base font-medium">Активных виджетов</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="w-24 h-7" /> : <span className="text-2xl font-bold">{cards.widgets}</span>}
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>График: средняя оценка по дням (30 дней)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" minTickGap={6} />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip
                      formatter={(v: any) => Number(v).toFixed(2)}
                      labelFormatter={(label) => `Дата: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#facc15"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Последние отзывы</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={fetchData}
              disabled={loading}
            >
              Обновить
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-16" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground">Нет отзывов</p>
            ) : (
              <ul className="divide-y divide-border">
                {reviews.map((r) => (
                  <li key={r.id} className="py-4 flex flex-row gap-4">
                    <div className="flex flex-col items-center px-1 min-w-12">
                      <Stars value={r.stars} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{r.text || <span className="text-muted-foreground">Без текста</span>}</p>
                      <div className="text-xs text-muted-foreground mt-1 flex flex-row gap-2 items-center">
                        <span>
                          {r.author || "Аноним"}
                        </span>
                        <span>·</span>
                        <span suppressHydrationWarning>
                          {new Date(r.created_at).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
