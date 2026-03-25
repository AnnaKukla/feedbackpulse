"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Фейковые данные для графика (оценки по дням)
const chartData = [
  { name: "1 Мар", avg: 4.0 },
  { name: "5 Мар", avg: 4.5 },
  { name: "10 Мар", avg: 4.8 },
  { name: "15 Мар", avg: 4.2 },
  { name: "20 Мар", avg: 4.9 },
  { name: "25 Мар", avg: 5.0 },
];

// Фейковые последние отзывы
const recentReviews = [
  {
    id: 1,
    text: "Очень комфортная сессия, удалось снять тревожность. Спасибо большое!",
    rating: 5,
    date: "Сегодня",
  },
  {
    id: 2,
    text: "Спасибо за помощь в сложной ситуации, стало гораздо легче и понятнее, куда двигаться дальше.",
    rating: 5,
    date: "Вчера",
  },
  {
    id: 3,
    text: "Хороший специалист, помогла взглянуть на проблему под другим углом.",
    rating: 4,
    date: "3 дня назад",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Обзор</h1>

      {/* Верхние карточки со статистикой */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего отзывов</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+14 за последний месяц</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средняя оценка</CardTitle>
            <Star className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">На основе 128 оценок</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активность</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Клиентов оставляют отзыв</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных виджетов</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Работают без сбоев</p>
          </CardContent>
        </Card>
      </div>

      {/* График и последние отзывы */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Блок с графиком */}
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Динамика оценок</CardTitle>
            <CardDescription>Средний балл за последние 30 дней</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Блок с отзывами */}
        <Card className="col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Последние отзывы</CardTitle>
            <CardDescription>Недавно полученная обратная связь</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentReviews.map((review) => (
                <div key={review.id} className="flex flex-col space-y-1 relative pl-4 border-l-2 border-slate-100 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 italic">«{review.text}»</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}