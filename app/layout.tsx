import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, EB_Garamond, Cinzel } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '700', '900'],
  display: 'swap',
})

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
    <html lang="en" className={`${playfair.variable} ${garamond.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
