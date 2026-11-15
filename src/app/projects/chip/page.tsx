import { ProjectPage } from "@/components/project-page";
import { caseStudyMetadata } from "@/lib/metadata";

import { images, tags } from "./data";

const SLUG = "chip";

export const metadata = caseStudyMetadata(SLUG);

export default function Chip() {
  return (
    <ProjectPage images={images} slug={SLUG} tags={tags}>
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
