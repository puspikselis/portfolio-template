import Image from "next/image";
import type { ReactNode } from "react";

import { FloatingThingy } from "@/components/features/floating-thingy";
import { JsonLd } from "@/components/inline-scripts";
import { Projects } from "@/components/projects";
import { Section } from "@/components/ui/section";
import { TagChip } from "@/components/ui/tag-chip";
import { Testimonial } from "@/components/ui/testimonial";
import { YearLabel } from "@/components/ui/year-label";
import { getCaseStudy } from "@/data/projects";
import { MD_BREAKPOINT_QUERY, SITE_URL } from "@/lib/constants";
import { AUTHOR, schemaNode } from "@/lib/json-ld";
import { caseStudyUrl } from "@/lib/metadata";
import { TEXT_BODY, TEXT_DISPLAY } from "@/lib/typography";
import { cn, getYear } from "@/lib/utils";

interface ProjectImage {
  alt: string;
  description: string;
  height: number;
  id: number | string;
  src: string;
  title: string;
  width: number;
}

// Case study screenshots are exported at 2784x1872 (928x624 @3x); tall ones override the height.
const CASE_STUDY_IMAGE_SIZE = { height: 1872, width: 2784 };

/** One gallery image at the default export size, unless it sets its own height. */
export const caseStudyImage = (
  image: Omit<ProjectImage, "height" | "width"> & { height?: number }
): ProjectImage => ({ ...CASE_STUDY_IMAGE_SIZE, ...image });

interface TestimonialData {
  author: { image: string; name: string; title: string };
  text: string;
}

interface ProjectPageProps {
  children: ReactNode;
  /** Floating label colour of the intro; defaults to the project's colour. */
  color?: string;
  /** Floating label colour over the gallery; defaults to the project's colour. */
  imageColor?: string;
  images: readonly ProjectImage[];
  /** Key into the projects data, which supplies the name and years. */
  slug: string;
  tags: readonly string[];
  testimonial?: TestimonialData;
}

export const ProjectPage = ({
  children,
  color: colorProp,
  imageColor: imageColorProp,
  images,
  slug,
  tags,
  testimonial,
}: ProjectPageProps) => {
  const project = getCaseStudy(slug);
  const { company: name, year } = project;
  const color = colorProp ?? project.color;
  const imageColor = imageColorProp ?? project.color;
  const url = caseStudyUrl(slug);
  const startYear = getYear(year);

  const jsonLd = [
    schemaNode("BreadcrumbList", {
      itemListElement: [
        { "@type": "ListItem", item: SITE_URL, name: "Home", position: 1 },
        { "@type": "ListItem", item: url, name, position: 2 },
      ],
    }),
    schemaNode("CreativeWork", {
      author: AUTHOR,
      dateCreated: startYear,
      name,
      url,
    }),
  ];

  return (
    <>
      <FloatingThingy />
      <JsonLd data={jsonLd} />
      <main className="pt-15 pb-42">
        <Section color={color} title="Intro" variant="narrow">
          <div>
            <YearLabel year={year} />
            <h1 className={cn("mt-2", TEXT_DISPLAY)}>{name}</h1>
            {/* Body copy is inherited by every paragraph the page passes in. */}
            <div className={cn("mt-4 space-y-4", TEXT_BODY)}>{children}</div>
          </div>
          <ul className="mt-11 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
          </ul>
        </Section>
        <section
          aria-label="Project Gallery"
          className="mt-20 space-y-3 px-5 md:mx-auto md:mt-37 md:max-w-232 md:px-0"
        >
          {images.map((image, index) => (
            <figure key={image.id}>
              <Image
                alt={image.alt}
                className="h-auto w-full rounded-3xl"
                data-color={imageColor}
                data-title={image.title}
                height={image.height}
                priority={index === 0}
                sizes={`${MD_BREAKPOINT_QUERY} 928px, 100vw`}
                src={image.src}
                width={image.width}
              />
              {/* Read by screen readers and search engines only; the images speak for themselves. */}
              <figcaption className="sr-only">
                {image.title}: {image.description}
              </figcaption>
            </figure>
          ))}
        </section>
        {testimonial ? (
          <Testimonial author={testimonial.author} className="mt-20 md:mt-35">
            {testimonial.text}
          </Testimonial>
        ) : null}
        <div className={testimonial ? "mt-20 md:mt-35" : "mt-20 md:mt-37"}>
          <Projects excludeSlug={slug} />
        </div>
      </main>
    </>
  );
};
