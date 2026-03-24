import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "FeedbackPulse",
  description: "Платформа обратной связи",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}