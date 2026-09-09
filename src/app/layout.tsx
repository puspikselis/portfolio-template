import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { CursorPreviewProvider } from "@/components/features/cursor-preview";
import { GridOverlay } from "@/components/features/grid-overlay";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd, ThemeInitScript } from "@/components/inline-scripts";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_URL } from "@/lib/constants";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const SITE_TITLE = "Kristaps Krūze — Designer";
const SITE_DESCRIPTION =
  "Product designer with 10+ years of experience. I've built my own ventures and designed digital products for clients worldwide.";
const GA_ID = "G-1BYJXYBJPS";

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#000000", media: "(prefers-color-scheme: dark)" },
  ],
  width: "device-width",
};

export const metadata: Metadata = {
  authors: [{ name: "Kristaps Krūze", url: SITE_URL }],
  creator: "Kristaps Krūze",
  description: SITE_DESCRIPTION,
  icons: {
    apple: "/favicon/apple-icon.png",
    icon: "/favicon/icon.png",
  },
  keywords: [
    "Product Designer",
    "UX/UI Design",
    "Kristaps Krūze",
    "Digital Product Design",
    "Latvia",
    "Portfolio",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: "en_US",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    type: "website",
    url: SITE_URL,
  },
  publisher: "Kristaps Krūze",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: SITE_TITLE,
  twitter: {
    card: "summary_large_image",
    description: SITE_DESCRIPTION,
    title: SITE_TITLE,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/images/KK.avif`,
  jobTitle: "Designer",
  knowsAbout: [
    "Product Design",
    "UX Design",
    "UI Design",
    "Digital Product Design",
  ],
  name: "Kristaps Krūze",
  nationality: "Latvian",
  sameAs: [
    "https://www.linkedin.com/in/kristapskruze/",
    "https://github.com/puspikselis",
    "https://heywisp.com",
    "https://datreal.com",
  ],
  url: SITE_URL,
  worksFor: { "@type": "Organization", name: "Ubiquiti" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  author: { "@type": "Person", name: "Kristaps Krūze" },
  name: SITE_TITLE,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          "--default-font-family": inter.style.fontFamily,
        } as React.CSSProperties
      }
      suppressHydrationWarning
    >
      <body className="relative">
        <ThemeInitScript />
        <JsonLd data={[personJsonLd, websiteJsonLd]} />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        <TooltipProvider delayDuration={150}>
          <ToastProvider>
            <CursorPreviewProvider>
              <GridOverlay />
              <div className="relative mx-auto max-w-404 border-nero-500 border-r border-l">
                <Header />
                {children}
                <Footer />
              </div>
            </CursorPreviewProvider>
          </ToastProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
