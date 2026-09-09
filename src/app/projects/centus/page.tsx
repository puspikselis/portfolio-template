import type { Metadata } from "next";

import { ProjectPage } from "@/components/project-page";

import { images, tags, testimonial } from "./data";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/centus" },
  description:
    "Centus is a localization management platform that helps teams ship multilingual products faster. As Lead Designer, I led end-to-end product work from concept to launch, defining core information architecture, translation workflows, and collaboration patterns.",
  title: "Centus - Lead Designer | Kristaps Krūze",
};

export default function Centus() {
  return (
    <ProjectPage
      color="var(--color-dim-gray-100)"
      images={images}
      name="Centus"
      slug="centus"
      tags={tags}
      testimonial={testimonial}
      year="2023 - 2025"
    >
      <p>
        Centus is a localization management platform that helps teams ship
        multilingual products faster.
      </p>
      <p>
        As Lead Designer, I led end-to-end product work from concept to launch.
        I defined the core information architecture, translation workflows,
        roles and permissions, and collaboration patterns, and I designed
        Centus's Figma and GitHub integrations. I also led designers producing
        marketing materials and illustrations.
      </p>
    </ProjectPage>
  );
}
