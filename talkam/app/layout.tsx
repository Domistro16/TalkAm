import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalkAm - AI Sign Language Translation",
  description: "Real-time ASL sign language translation powered by Google Gemini AI. Breaking down communication barriers with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                error: 'bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-50 border-red-200 dark:border-red-800',
                success: 'bg-emerald-50 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-50 border-emerald-200 dark:border-emerald-800',
                warning: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-50 border-yellow-200 dark:border-yellow-800',
                info: 'bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-50 border-blue-200 dark:border-blue-800',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
