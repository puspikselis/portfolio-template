import type { ButtonVariant } from "@/components/ui/button";

interface Preview {
  height: number;
  image: string;
  width: number;
}

type Platform = "android" | "ios";

interface BusinessButton {
  href: string;
  icon?: "appStore" | "playStore";
  label: string;
  platform?: Platform;
  preview?: Preview;
  variant?: Extract<ButtonVariant, "link" | "pill">;
}

interface Business {
  buttons: BusinessButton[];
  cardHref?: string;
  color?: string;
  id: number;
  image: string;
  previewOnCardHover?: boolean;
  tags: string[];
  title: string;
  year: string;
}

export type { Platform };

export const businesses: Business[] = [
  {
    buttons: [
      {
        href: "https://datreal.com",
        label: "Website",
      },
    ],
    cardHref: "https://datreal.com",
    color: "#025333",
    id: 3,
    image: "/images/datreal.svg",
    tags: ["DatReal", "Public Business Data"],
    title: "Co-Founder",
    year: "Since 2026",
  },
  {
    buttons: [
      {
        href: "https://apps.apple.com/lv/app/ai-dating-reimagined-wisp/id6738913963",
        icon: "appStore",
        label: "App Store",
        platform: "ios",
        preview: {
          height: 200,
          image: "/images/wisp/appstore.avif",
          width: 248,
        },
      },
      {
        href: "https://play.google.com/store/apps/details?id=com.getwisp.wisp",
        icon: "playStore",
        label: "Google Play",
        platform: "android",
        preview: {
          height: 200,
          image: "/images/wisp/playstore.avif",
          width: 248,
        },
      },
      {
        href: "https://heywisp.com",
        label: "Website",
      },
    ],
    cardHref: "https://heywisp.com",
    color: "#44a1ff",
    id: 1,
    image: "/images/wisp.avif",
    tags: ["Wisp", "AI Dating"],
    title: "Co-Founder",
    year: "Since 2025",
  },
  {
    buttons: [
      {
        href: "https://eloking.com/",
        label: "Website",
        preview: {
          height: 200,
          image: "/images/eloking/preview.webm",
          width: 248,
        },
      },
    ],
    cardHref: "https://eloking.com/",
    color: "#1d1d1d",
    id: 2,
    image: "/images/eloking.avif",
    previewOnCardHover: true,
    tags: ["Eloking", "eSports"],
    title: "Co-Founder",
    year: "Since 2021",
  },
];
