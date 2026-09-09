import type { Metadata } from "next";

import { ProjectPage } from "@/components/project-page";

import { images, tags, testimonial } from "./data";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/paynt" },
  description:
    "Paydoo (now Paynt) is a European payments acquirer. As Lead Designer, I led end-to-end product and brand work, including the company's rebrand from Paydoo to Paynt.",
  title: "Paynt - Lead Designer | Kristaps Krūze",
};

export default function Paynt() {
  return (
    <ProjectPage
      color="var(--color-paynt-100)"
      imageColor="var(--color-paynt-100)"
      images={images}
      name="Paynt"
      slug="paynt"
      tags={tags}
      testimonial={testimonial}
      year="2018 - 2021"
    >
      <p>Paydoo (now Paynt) is a European payments acquirer.</p>
      <p>
        As Lead Designer, I led end-to-end product and brand work. I was the
        hands-on product designer for the ISO onboarding platform, POS
        applications, and marketing website, and I managed designers producing
        marketing materials, documents, and other collateral. I also led the
        company's rebrand from Paydoo to Paynt in partnership with{" "}
        <a
          className="no-underline transition-opacity hover:opacity-80"
          href="https://www.asketic.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Asketic
        </a>
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
