import { ProjectPage } from "@/components/project-page";
import { AppLink } from "@/components/ui/app-link";
import { caseStudyMetadata } from "@/lib/metadata";

import { images, tags, testimonial } from "./data";

export const metadata = caseStudyMetadata("paynt");

export default function Paynt() {
  return (
    <ProjectPage
      images={images}
      slug="paynt"
      tags={tags}
      testimonial={testimonial}
    >
      <p>Paydoo (now Paynt) is a European payments acquirer.</p>
      <p>
        As Lead Designer, I led end-to-end product and brand work. I was the
        hands-on product designer for the ISO onboarding platform, POS
        applications, and marketing website, and I managed designers producing
        marketing materials, documents, and other collateral. I also led the
        company's rebrand from Paydoo to Paynt in partnership with{" "}
        <AppLink
          className="hover-fade no-underline"
          external
          href="https://www.asketic.com"
        >
          Asketic
        </AppLink>
        , aligning the identity, visual language, and messaging with the
        company's evolution.
      </p>
      <p>
        Samples show both Paydoo and Paynt branding — the rebrand happened
        mid-project.
      </p>
    </ProjectPage>
  );
}
