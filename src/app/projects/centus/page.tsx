import { ProjectPage } from "@/components/project-page";
import { caseStudyMetadata } from "@/lib/metadata";

import { images, tags, testimonial } from "./data";

export const metadata = caseStudyMetadata("centus");

export default function Centus() {
  return (
    <ProjectPage
      color="var(--color-dim-gray-100)"
      images={images}
      slug="centus"
      tags={tags}
      testimonial={testimonial}
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
