import type { Metadata } from "next";

import { ProjectPage } from "@/components/project-page";

import { images, tags } from "./data";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/chip" },
  description:
    "Chip is an automated savings app that connects to your bank, analyzes spending, and moves affordable amounts into savings automatically. As Lead Designer, I led end-to-end product and brand work.",
  title: "Chip - Lead Designer | Kristaps Krūze",
};

export default function Chip() {
  return (
    <ProjectPage
      color="var(--color-chip-100)"
      imageColor="var(--color-chip-100)"
      images={images}
      name="Chip"
      slug="chip"
      tags={tags}
      year="2018"
    >
      <p>
        Chip is an automated savings app that connects to your bank, analyzes
        spending, and moves affordable amounts into savings automatically.
      </p>
      <p>
        As Lead Designer, I led end-to-end product and brand work. I designed
        the iOS and Android apps with a conversational UX, set up design
        processes, and owned the marketing website and launch assets. I also led
        the 2.0 rebrand, partnering with product, engineering, and growth to
        keep decisions customer-first and testable.
      </p>
    </ProjectPage>
  );
}
