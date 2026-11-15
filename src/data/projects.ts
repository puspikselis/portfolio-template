import type { ComponentType } from "react";

import {
  CentusIcon,
  InzpireIcon,
  PayntIcon,
  UbiquitiIcon,
} from "@/components/icons/projects";

interface Project {
  buttonLabel?: string;
  /** Logo tile and hover preview colour; defaults to DEFAULT_PREVIEW_COLOR. */
  color?: string;
  comingSoon?: boolean;
  company: string;
  /** Meta description of the case study page (140-155 characters). */
  description?: string;
  Icon?: ComponentType;
  id: number;
  image?: string;
  /** ISO date the case study page last changed, for the sitemap. */
  lastModified?: string;
  preview?: string;
  slug?: string;
  tags: string[];
  title: string;
  year: string;
}

/** A project with its own case study page under /projects/[slug]. */
type CaseStudy = Project & {
  description: string;
  lastModified: string;
  slug: string;
};

export const projects: Project[] = [
  {
    buttonLabel: "Under NDA",
    color: "#0055D0",
    company: "Ubiquiti",
    Icon: UbiquitiIcon,
    id: 9,
    preview: "/images/ubiquiti/preview.webm",
    tags: ["Protect & LCM"],
    title: "Senior Designer",
    year: "Since 2025",
  },
  {
    company: "Centus",
    description:
      "Centus is a localization platform that helps teams ship multilingual products faster. As Lead Designer I led its product work from concept to launch.",
    Icon: CentusIcon,
    id: 1,
    lastModified: "2025-01-15",
    preview: "/images/centus/preview.avif",
    slug: "centus",
    tags: ["Localization"],
    title: "Lead Designer",
    year: "2023 - 2025",
  },
  {
    color: "#b1ce1b",
    comingSoon: true,
    company: "Inzpire",
    Icon: InzpireIcon,
    id: 2,
    tags: ["Marketing"],
    title: "Lead Designer",
    year: "2022 - 2023",
  },
  {
    color: "var(--color-paynt-100)",
    company: "Paynt",
    description:
      "Paydoo, now Paynt, is a European payments acquirer. As Lead Designer I led product and brand work, including the company rebrand from Paydoo to Paynt.",
    Icon: PayntIcon,
    id: 3,
    lastModified: "2021-12-31",
    preview: "/images/paynt/preview.avif",
    slug: "paynt",
    tags: ["Finance"],
    title: "Lead Designer",
    year: "2018 - 2021",
  },
  {
    color: "var(--color-chip-100)",
    company: "Chip",
    description:
      "Chip is an automated savings app that analyzes spending and moves affordable amounts into savings. As Lead Designer I led its product and brand work.",
    id: 4,
    image: "/images/chip.avif",
    lastModified: "2018-12-31",
    preview: "/images/chip/preview.avif",
    slug: "chip",
    tags: ["Finance"],
    title: "Lead Designer",
    year: "2018",
  },
  {
    company: "Showroom",
    id: 5,
    image: "/images/showroom.avif",
    tags: ["Staging"],
    title: "Product Designer",
    year: "2013 - 2015",
  },
  {
    color: "#189af5",
    company: "Yupp",
    id: 6,
    image: "/images/yupp.avif",
    tags: ["Social"],
    title: "Product Designer",
    year: "2013 - 2015",
  },
  {
    color: "#ffffff",
    company: "CDI",
    id: 7,
    image: "/images/cdi.avif",
    tags: ["Technology"],
    title: "Product Designer",
    year: "2013",
  },
  {
    company: "Draugiem Group",
    id: 8,
    image: "/images/draugiem-group.avif",
    tags: ["Technology"],
    title: "Product Designer",
    year: "2012",
  },
];

const isCaseStudy = (project: Project): project is CaseStudy =>
  Boolean(project.slug && project.description && project.lastModified);

export const caseStudies: CaseStudy[] = projects.filter(isCaseStudy);

export const getCaseStudy = (slug: string): CaseStudy => {
  const caseStudy = caseStudies.find((project) => project.slug === slug);
  if (!caseStudy) {
    throw new Error(`Unknown case study: ${slug}`);
  }
  return caseStudy;
};

/** Roles held now ("Since 2025") versus roles that have ended. */
export const isCurrentRole = (year: string): boolean =>
  year.startsWith("Since");
