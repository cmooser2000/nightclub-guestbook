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
  title: "The Aladdin Studio Tiffin Room — A 1920s San Francisco Nightclub",
  description: "The guestbook of the Aladdin Studio Tiffin Room — a 1920s San Francisco supper club run by Hattie and Minnie Mooser, where vaudevillians, film stars, politicians, and luminaries signed their names.",
  openGraph: {
    title: "The Aladdin Studio Tiffin Room — A 1920s San Francisco Nightclub",
    description: "Vaudevillians, silent film stars, politicians, and luminaries who signed the guestbook of Hattie and Minnie Mooser's legendary San Francisco supper club.",
    images: [{ url: "https://nightclub-guestbook.vercel.app/hero.png", width: 1200, alt: "Hattie and Minnie Mooser at the Aladdin Studio Tiffin Room" }],
    type: "website",
    url: "https://nightclub-guestbook.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aladdin Studio Tiffin Room — A 1920s San Francisco Nightclub",
    description: "Vaudevillians, silent film stars, and luminaries who signed the guestbook of Hattie and Minnie Mooser's legendary SF supper club.",
    images: ["https://nightclub-guestbook.vercel.app/hero.png"],
  },
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
