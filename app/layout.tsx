import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Guestbook — A 1920s Nightclub",
  description: "Celebrities, vaudevillians, and luminaries who passed through our doors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
