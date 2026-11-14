interface Preview {
  height: number;
  image: string;
  width: number;
}

type Platform = "android" | "ios";

interface BusinessButton {
  /** Kept in the data but not rendered. */
  hidden?: boolean;
  /** Omitted for the website button: it links to the business's `website`. */
  href?: string;
  icon?: "appStore" | "playStore";
  label: string;
  platform?: Platform;
  preview?: Preview;
}

interface Business {
  buttons: BusinessButton[];
  color?: string;
  company: string;
  id: number;
  image: string;
  previewOnCardHover?: boolean;
  tags: string[];
  title: string;
  website: string;
  year: string;
}

export type { Platform };

export const businesses: Business[] = [
  {
    buttons: [
      {
        label: "Website",
        preview: {
          height: 140,
          image: "/images/datreal/preview.webm",
          width: 248,
        },
      },
    ],
    color: "#003E2D",
    company: "DatReal",
    id: 3,
    image: "/images/datreal.svg",
    tags: ["Public Business Data"],
    title: "Co-Founder",
    website: "https://datreal.com",
    year: "Since 2025",
  },
  {
    buttons: [
      {
        hidden: true,
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
        hidden: true,
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
        label: "Website",
        preview: {
          height: 156,
          image: "/images/wisp/preview.webm",
          width: 248,
        },
      },
    ],
    color: "#44a1ff",
    company: "Wisp",
    id: 1,
    image: "/images/wisp.avif",
    tags: ["AI Dating"],
    title: "Co-Founder",
    website: "https://heywisp.com",
    year: "Since 2025",
  },
  {
    buttons: [
      {
        label: "Website",
        preview: {
          height: 200,
          image: "/images/eloking/preview.webm",
          width: 248,
        },
      },
    ],
    color: "#1d1d1d",
    company: "Eloking",
    id: 2,
    image: "/images/eloking.avif",
    previewOnCardHover: true,
    tags: ["eSports"],
    title: "Co-Founder",
    website: "https://eloking.com/",
    year: "Since 2021",
  },
];
