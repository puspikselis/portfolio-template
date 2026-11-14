import type { Metadata } from "next";

import { Businesses } from "@/components/businesses";
import { FloatingThingy } from "@/components/features/floating-thingy";
import { Projects } from "@/components/projects";
import { YEARS_OF_EXPERIENCE } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <FloatingThingy />
      <main className="pt-13 pb-42">
        <section
          className="narrow-container space-y-4"
          data-color="var(--color-orange-100)"
          data-title="Intro"
        >
          <h1 className="font-medium text-28/10 text-ink -tracking-[0.01em]">
            Product designer with {YEARS_OF_EXPERIENCE} years of experience
            based in Latvia. I design digital products people enjoy using.
          </h1>
          <p className="font-medium text-28/10 -tracking-[0.01em]">
            I build with passion and persistence — my own ventures and client
            work worldwide.
          </p>
        </section>
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
