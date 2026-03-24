"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase"; // предполагаемая инициализация supabase клиента
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");

  // Логин
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Регистрация
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Ошибка входа");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      // 1. Регистрация пользователя через Supabase
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
      });
      if (error) throw error;
      if (!data.user) throw new Error("Пользователь не создан");

      // 2. Создаём организацию
      const orgName = registerEmail;
      const emailPrefix = registerEmail.split("@")[0];
      const orgSlug = emailPrefix;

      const { data: orgData, error: orgErr } = await supabase
        .from("organizations")
        .insert({ name: orgName, slug: orgSlug })
        .select()
        .single();

      if (orgErr) throw orgErr;

      // 3. Добавляем пользователя в org_members как owner
      const { error: memberErr } = await supabase
        .from("org_members")
        .insert({
          user_id: data.user.id,
          organization_id: orgData.id,
          role: "owner",
        });

      if (memberErr) throw memberErr;

      // 4. Редирект
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Ошибка регистрации");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            FeedbackPulse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={v => setTab(v as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Войти</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Вход..." : "Войти"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Пароль</Label>
                  <Input
                    id="register-password"
                    type="password"
                    autoComplete="new-password"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={registerLoading}>
                  {registerLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}