import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
