import Image from "next/image";
import type { ReactNode } from "react";

import { FloatingThingy } from "@/components/features/floating-thingy";
import { JsonLd } from "@/components/inline-scripts";
import { Projects } from "@/components/projects";
import { TagChip } from "@/components/ui/tag-chip";
import { Testimonial } from "@/components/ui/testimonial";
import { getCaseStudy } from "@/data/projects";
import { SITE_URL } from "@/lib/constants";
import { AUTHOR, schemaNode } from "@/lib/json-ld";
import { caseStudyUrl } from "@/lib/metadata";
import { getYear } from "@/lib/utils";

interface ProjectImage {
  alt: string;
  description: string;
  height: number;
  id: number | string;
  src: string;
  title: string;
  width: number;
}

interface TestimonialData {
  author: { image: string; name: string; title: string };
  text: string;
}

interface ProjectPageProps {
  children: ReactNode;
  color: string;
  imageColor?: string;
  images: readonly ProjectImage[];
  /** Key into the projects data, which supplies the name and years. */
  slug: string;
  tags: readonly string[];
  testimonial?: TestimonialData;
}

export function ProjectPage({
  children,
  color,
  imageColor,
  images,
  slug,
  tags,
  testimonial,
}: ProjectPageProps) {
  const { company: name, year } = getCaseStudy(slug);
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
        <section
          className="narrow-container"
          data-color={color}
          data-title="Intro"
        >
          <div>
            <p className="font-medium text-13/4 text-dim-gray-100">
              <time dateTime={startYear}>{year}</time>
            </p>
            <h1 className="mt-2 font-medium text-28/10 text-ink -tracking-[0.01em]">
              {name}
            </h1>
            <div className="mt-4 space-y-4 *:text-15/7 *:text-nobel-100 *:-tracking-[0.02em]">
              {children}
            </div>
          </div>
          <ul className="mt-11 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
          </ul>
        </section>
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
                sizes="(min-width: 768px) 928px, 100vw"
                src={image.src}
                width={image.width}
              />
              <figcaption className="mt-3 text-13/5 text-nobel-100">
                <span className="sr-only">{image.title}: </span>
                {image.description}
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
}
