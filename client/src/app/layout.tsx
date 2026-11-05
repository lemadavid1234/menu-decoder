import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeToggle from "./theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menu Decoder",
  description: "Menu Decoder App made by David Lema",
};

const themeScript = 
`
(function () {
  try {
    let t = localStorage.getItem("theme");
    if (t === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    } 
  } catch (e) {
    console.warn("localStorage is unavailable: ", e);
  }
})();
`

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={ {
          __html: themeScript,
        }}/>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeToggle/>
      </body>
    </html>
  );
}
