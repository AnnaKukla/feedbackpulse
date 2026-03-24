"use client";
export const dynamic = 'force-dynamic';


import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Code } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

type Widget = {
  id: number;
  name: string;
  domain: string;
  organization_id: number;
};

function WidgetCreateDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      // Reset form on close
      setName("");
      setDomain("");
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Получить текущего юзера
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Ошибка авторизации");
        setLoading(false);
        return;
      }

      // Получить organization_id через org_members
      const { data: orgMemberData, error: orgError } = await supabase
        .from("org_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (orgError || !orgMemberData) {
        setError("Не удалось получить организацию");
        setLoading(false);
        return;
      }

      // Создать виджет
      const { error: insertError } = await supabase
        .from("widgets")
        .insert([
          {
            name: name.trim(),
            domain: domain.trim(),
            organization_id: orgMemberData.organization_id,
          },
        ]);

      if (insertError) {
        setError("Ошибка при создании виджета");
        setLoading(false);
        return;
      }

      setOpen(false);
      onCreated();
    } catch (e) {
      setError("Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Создать виджет
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать виджет</DialogTitle>
          <DialogDescription>
            Укажите название и домен сайта, где будет размещён виджет.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="widget-name">Название виджета</Label>
            <Input
              id="widget-name"
              placeholder="Например, Мой магазин"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={64}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="widget-domain">Домен</Label>
            <Input
              id="widget-domain"
              placeholder="Например, myshop.ru"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              maxLength={128}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Сохраняем..." : "Сохранить"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Отмена
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WidgetCodeDialog({ widget }: { widget: Widget }) {
  const [open, setOpen] = useState(false);

  // Сгенерировать готовый html-код виджета
  const scriptSrc = "https://cdn.feedbackpulse.ru/widget.js"; // change to actual source
  const widgetHtml = `<script src="${scriptSrc}" async></script>
<div id="feedbackpulse-widget" data-widget-id="${widget.id}"></div>`;

  function handleCopy() {
    navigator.clipboard.writeText(widgetHtml);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code className="w-4 h-4" />
          Код для вставки
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Код для вставки</DialogTitle>
          <DialogDescription>
            Добавьте этот код на вашу страницу перед закрывающимся тегом <code>{"</body>"}</code>.
          </DialogDescription>
        </DialogHeader>
        <div>
          <pre className="bg-muted rounded p-3 text-xs overflow-x-auto whitespace-pre-wrap select-all">
            {widgetHtml}
          </pre>
        </div>
        <DialogFooter>
          <Button onClick={handleCopy} type="button" variant="secondary">
            Скопировать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWidgets = async () => {
    setLoading(true);

    try {
      // Получить текущего юзера
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setWidgets([]);
        setLoading(false);
        return;
      }

      // Получить organization_id
      const { data: orgMemberData } = await supabase
        .from("org_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!orgMemberData) {
        setWidgets([]);
        setLoading(false);
        return;
      }

      // Получить виджеты для организации  
      const { data: widgetData } = await supabase
        .from("widgets")
        .select("*")
        .eq("organization_id", orgMemberData.organization_id)
        .order("id", { ascending: false });

      setWidgets(widgetData || []);
    } catch {
      setWidgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWidgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Мои виджеты</h1>
        <WidgetCreateDialog onCreated={fetchWidgets} />
      </header>

      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : widgets.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12">
            <span>У вас пока нет ни одного виджета.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {widgets.map((widget) => (
              <Card key={widget.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {widget.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-sm text-muted-foreground">
                    Домен:{" "}
                    <span className="text-foreground">{widget.domain}</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto flex justify-between">
                  <WidgetCodeDialog widget={widget} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
