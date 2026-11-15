import { ProjectPage } from "@/components/project-page";
import { AppLink } from "@/components/ui/app-link";
import { caseStudyMetadata } from "@/lib/metadata";

import { images, tags, testimonial } from "./data";

const SLUG = "paynt";

export const metadata = caseStudyMetadata(SLUG);

export default function Paynt() {
  return (
    <ProjectPage
      images={images}
      slug={SLUG}
      tags={tags}
      testimonial={testimonial}
    >
      <p>Paydoo (now Paynt) is a European payments acquirer.</p>
      <p>
        As Lead Designer, I led end-to-end product and brand work. I was the
        hands-on product designer for the ISO onboarding platform, POS
        applications, and marketing website, and I managed designers producing
        marketing materials, documents, and other collateral. I also led the
        company&apos;s rebrand from Paydoo to Paynt in partnership with{" "}
        <AppLink external href="https://www.asketic.com" tone="fade">
          Asketic
        </AppLink>
        , aligning the identity, visual language, and messaging with the
        company&apos;s evolution.
      </p>
      <p>
        Samples show both Paydoo and Paynt branding — the rebrand happened
        mid-project.
      </p>
    </ProjectPage>
  );
}
