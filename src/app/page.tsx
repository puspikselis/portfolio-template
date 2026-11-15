import type { Metadata } from "next";

import { Businesses } from "@/components/businesses";
import { FloatingThingy } from "@/components/features/floating-thingy";
import { Projects } from "@/components/projects";
import { Section } from "@/components/ui/section";
import { YEARS_OF_EXPERIENCE } from "@/lib/constants";
import { TEXT_DISPLAY } from "@/lib/typography";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <FloatingThingy />
      <main className="pt-13 pb-42">
        <Section
          className="narrow-container space-y-4"
          color="var(--color-orange-100)"
          title="Intro"
        >
          <h1 className={TEXT_DISPLAY}>
            Product designer with {YEARS_OF_EXPERIENCE} years of experience
            based in Latvia. I design digital products people enjoy using.
          </h1>
          {/* Body colour, not ink: the second line reads as secondary. */}
          <p className={cn(TEXT_DISPLAY, "text-nobel-100")}>
            I build with passion and persistence — my own ventures and client
            work worldwide.
          </p>
        </Section>
        <div className="mt-20 md:mt-33.5">
          <Projects />
        </div>
        <div className="mt-20 md:mt-37">
          <Businesses />
        </div>
      </main>
    </>
  );
}
