import { caseStudyImage } from "@/components/project-page";

export const tags = [
  "Product design",
  "Design leadership",
  "Design Systems",
  "UX/UI Design",
  "Prototyping",
  "Handoff",
  "Design QA",
  "Mobile applications",
  "Stakeholder management",
];

export const testimonial = {
  author: {
    image: "/images/paynt/sam-reference.jpg",
    name: "Sam Kohli",
    title: "Founder & Paynt Group CEO",
  },
  text: `I am pleased to recommend Kristaps Kruze, who worked as a UI/UX Designer at Paynt, a leading fintech platform specializing in digital payments and embedded finance solutions.

I have personally known Kristaps for over 10 years and in that time he has worked as both a consultant and full time employee consistently demonstrating exceptional creativity, technical ability, and strategic thinking.

He has worked across our products as well as brand, bringing his own perspective to our approach and always coming up with well researched and thought through ideas. He brought a strong understanding of user behaviour that he translated through to his designs.

Kristaps was an engaged and valued team member during his time at Paynt and I am happy to recommend him.`,
};

export const images = [
  caseStudyImage({
    alt: "Paynt marketing website",
    description:
      "Marketing website presenting Paynt's payment solutions to prospective merchants.",
    id: "website",
    src: "/images/paynt/1-website@3x.avif",
    title: "Marketing Website",
  }),
  caseStudyImage({
    alt: "Paynt POS Application interface",
    description:
      "Point-of-sale app for merchants, built for fast, error-free transactions.",
    height: 10_320,
    id: "pos-app",
    src: "/images/paynt/2-posApplication@3x.avif",
    title: "POS Application",
  }),
  caseStudyImage({
    alt: "Paynt product screenshots",
    description:
      "Merchant dashboards and transaction flows for the payment platform.",
    height: 3204,
    id: "product-screens",
    src: "/images/paynt/3-someImages@3x.avif",
    title: "Product Interfaces",
  }),
  caseStudyImage({
    alt: "Paynt merchant onboarding portal",
    description:
      "Internal portal that streamlines bringing new merchants onto the platform.",
    height: 7473,
    id: "onboarding-portal",
    src: "/images/paynt/4-merchantOnboardingPortal@3x.avif",
    title: "Merchant Onboarding Portal",
  }),
  caseStudyImage({
    alt: "Paynt design system",
    description:
      "Design system keeping Paynt products and marketing materials consistent.",
    id: "design-system",
    src: "/images/paynt/5-designSystem@3x.avif",
    title: "Design System",
  }),
  caseStudyImage({
    alt: "Paynt merchant onboarding form",
    description:
      "Merchant onboarding form with clear structure and forgiving validation.",
    height: 4560,
    id: "onboarding-form",
    src: "/images/paynt/6-merchantOnboardingForm@3x.avif",
    title: "Merchant Onboarding Form",
  }),
];
