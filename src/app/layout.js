import "@/app/globals.scss";
import "@/styles/tailwind.css";
import ThemeProvider from "@/utils/ThemeProvider";
import { AuthModalProvider, useAuthModal } from "@/context/AuthModalContext";
import { AuthProvider } from "@/context/AuthContext";
import { inter, noto, poppins, ubuntu } from "@/font/fonts";
import Script from "next/script";
import { ProtectedRouteProvider, useProtectedRoute } from "@/context/ProtectedRoute";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Flollama – Open‑Source Gemini 3.1 Flash Lite AI Chatbot by Pratyush",
  description:
    "Flollama by Pratyush is an open‑source, privacy‑first AI chatbot built with Gemini and Next.js. Enjoy fast, stylish conversations powered by the Gemini 3.1 Flash Lite.",
  keywords: [
    "Flollama",
    "AI chatbot",
    "Gemini 3.1 Flash Lite",
    "open‑source",
    "Gemini",
    "Next.js",
    "private AI",
    "React AI",
    "Tailwind CSS",
    "Pratyush",
  ],
  authors: [{ name: "Pratyush Kumar", url: "https://nvmpratyush.vercel.app/" }],
  creator: "Pratyush Kumar",
  robots: "index, follow",
  metadataBase: new URL("https://flollama.in"),
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.webp", type: "image/webp", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title:
      "Flollama – Open‑Source Gemini 3.1 Flash Lite AI Chatbot by Pratyush",
    description:
      "Flollama is a blazing‑fast, private AI chatbot powered by Gemini 3.1 Flash Lite, built with Next.js and Tailwind CSS. No API key required—chat instantly.",
    url: "https://flollama.in/",
    siteName: "Flollama",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Banner for Flollama AI",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Flollama – Open‑Source LLaMA 3 AI Chatbot",
    description:
      "Flollama by Pratyush is an open‑source AI chatbot with Ollama + Next.js. Enjoy private, fast chats powered by LLaMA 3—no API key needed.",
    images: ["/og-image.png"],
    creator: "@nvmpratyush",
  },

  verification: {
    google: "jRUy_ry4PSX-sDVpjn9c4bc-eVC5f_w4E5IVyTepHC8",
  },

  other: {
    "geo.region": "IN-CT",
    "geo.placename": "Durg, Chhattisgarh",
    "geo.position": "21.1905;81.2849",
    ICBM: "21.1905, 81.2849",
    "revisit-after": "7 days",
    language: "en-US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-952YL3MK2V"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-952YL3MK2V');
          `}
        </Script>
      </head>
      <body
        className={`app-body ${inter.variable} ${poppins.variable} ${ubuntu.variable} ${noto.variable}`}
      >
        <ThemeProvider>
          <AuthModalProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
