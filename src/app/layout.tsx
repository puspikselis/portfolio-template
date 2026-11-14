import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { CursorPreviewProvider } from "@/components/features/cursor-preview";
import { GridOverlay } from "@/components/features/grid-overlay";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/inline-scripts";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { businesses } from "@/data/businesses";
import { projects } from "@/data/projects";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/constants";
import { buildPersonJsonLd } from "@/lib/json-ld";
import { OPEN_GRAPH_BASE, TWITTER_BASE } from "@/lib/metadata";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const GA_ID = "G-1BYJXYBJPS";

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#000000",
  width: "device-width",
};

export const metadata: Metadata = {
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: {
    apple: "/favicon/apple-icon.png",
    icon: "/favicon/icon.png",
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    ...OPEN_GRAPH_BASE,
    description: SITE_DESCRIPTION,
    title: SITE_TITLE,
    url: SITE_URL,
  },
  publisher: SITE_NAME,
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
    ...TWITTER_BASE,
    description: SITE_DESCRIPTION,
    title: SITE_TITLE,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  author: { "@type": "Person", name: SITE_NAME },
  name: SITE_TITLE,
  url: SITE_URL,
};

const VIDEO_PREVIEWS = [
  ...projects.map((project) => project.preview),
  ...businesses.flatMap((business) =>
    business.buttons.map((button) => button.preview?.image)
  ),
].filter((src): src is string => Boolean(src?.endsWith(".webm")));

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
    >
      <body className="relative">
        {/* Hover previews mount on demand; prefetch videos so the first hover plays at once. */}
        {VIDEO_PREVIEWS.map((href) => (
          <link as="video" href={href} key={href} rel="prefetch" />
        ))}
        <JsonLd data={[buildPersonJsonLd(), websiteJsonLd]} />
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
