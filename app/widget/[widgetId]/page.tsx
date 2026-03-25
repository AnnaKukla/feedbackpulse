"use client";

import { useState } from "react";
import { Plus, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Описываем, как выглядит наш виджет
type Widget = {
  id: string;
  name: string;
  domain: string;
};

export default function WidgetsPage() {
  // Список наших виджетов
  const [widgets, setWidgets] = useState<Widget[]>([]);

  // Состояния для управления модальным окном и формой
  const [open, setOpen] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState("");
  const [newWidgetDomain, setNewWidgetDomain] = useState("");

  // Функция, которая срабатывает при нажатии "Сохранить виджет"
  const handleCreateWidget = () => {
    if (!newWidgetName || !newWidgetDomain) return; // Не сохраняем пустые поля

    const newWidget: Widget = {
      id: Math.random().toString(36).substring(7), // Генерируем случайный ID
      name: newWidgetName,
      domain: newWidgetDomain,
    };

    setWidgets([newWidget, ...widgets]); // Добавляем новый виджет в список
    setOpen(false); // Закрываем окно
    setNewWidgetName(""); // Очищаем форму для следующего раза
    setNewWidgetDomain("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Мои виджеты</h1>

        {/* Само модальное окно */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Создать виджет
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Создать новый виджет</DialogTitle>
              <DialogDescription>
                Введите название и домен сайта, где будет размещен виджет для сбора отзывов.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Название
                </Label>
                <Input
                  id="name"
                  placeholder="Например: Запись на консультации"
                  value={newWidgetName}
                  onChange={(e) => setNewWidgetName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="domain" className="text-right">
                  Домен
                </Label>
                <Input
                  id="domain"
                  placeholder="psy-anna.ru"
                  value={newWidgetDomain}
                  onChange={(e) => setNewWidgetDomain(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateWidget}>Сохранить виджет</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Условие: если виджетов 0, показываем заглушку. Если есть — рисуем карточки */}
      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <Globe className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">У вас пока нет ни одного виджета</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Создайте свой первый виджет, чтобы начать собирать отзывы.
          </p>
          <Button