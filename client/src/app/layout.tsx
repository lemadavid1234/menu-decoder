import type { Metadata } from "next";
import { Noto_Serif, Great_Vibes } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({ variable: "--font-noto-serif", subsets: ['latin'], weight: ['400', '600', '700']})
const greatVibes = Great_Vibes({ variable: "--font-great-vibes", subsets: ['latin'], weight: '400'})

export const metadata: Metadata = {
  title: "Menu Decoder",
  description: "Menu Decoder App made by David Lema",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
