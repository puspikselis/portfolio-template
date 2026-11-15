"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { EntryAction } from "@/components/entry-action";
import { EntryCard } from "@/components/entry-card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { projects } from "@/data/projects";
import { caseStudyPath } from "@/lib/metadata";
import { getYears } from "@/lib/utils";

// Roles shown before "Show earlier roles"; the rest stay in the DOM (crawlable) but collapsed.
const VISIBLE_ROLES = 5;
const EARLIER_ROLES_ID = "earlier-roles";

function fallbackButtonLabel(hasDetailPage: boolean, comingSoon?: boolean) {
  if (hasDetailPage) {
    return "View";
  }
  return comingSoon ? null : "Archive";
}

function ProjectCard({
  project,
  isFirst,
}: {
  project: (typeof projects)[number];
  isFirst?: boolean;
}) {
  const buttonLabel =
    project.buttonLabel ??
    fallbackButtonLabel(Boolean(project.slug), project.comingSoon);
  const href = project.slug ? caseStudyPath(project.slug) : undefined;

  return (
    <EntryCard
      actions={
        buttonLabel ? (
          <EntryAction
            company={project.company}
            href={href}
            label={buttonLabel}
          />
        ) : null
      }
      cardHref={href}
      color={project.color}
      company={project.company}
      fallback={project.Icon ? <project.Icon /> : undefined}
      image={project.image}
      isFirst={isFirst}
      preview={project.preview ? { image: project.preview } : undefined}
      tags={project.tags}
      title={project.title}
      truncate
      year={project.year}
    />
  );
}

export function Projects({ excludeSlug }: { excludeSlug?: string } = {}) {
  const filteredProjects = excludeSlug
    ? projects.filter((project) => project.slug && project.slug !== excludeSlug)
    : projects;
  const title = excludeSlug ? "Other Positions" : "Employment History";
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = useCallback(() => setIsExpanded(true), []);
  const earlierRef = useRef<HTMLDivElement>(null);

  // The expand button unmounts, so hand keyboard focus to the revealed roles.
  useEffect(() => {
    if (isExpanded) {
      earlierRef.current?.focus({ preventScroll: true });
    }
  }, [isExpanded]);
  const recent = filteredProjects.slice(0, VISIBLE_ROLES);
  const earlier = filteredProjects.slice(VISIBLE_ROLES);
  const earlierYears = earlier.flatMap((project) => getYears(project.year));
  const earliestYear = Math.min(...earlierYears.map(Number));
  const latestEarlierYear = Math.max(...earlierYears.map(Number));

  return (
    <Section
      className="narrow-container"
      headingId="projects-heading"
      title={title}
    >
      <div className="space-y-14">
        {recent.map((project, index) => (
          <ProjectCard
            isFirst={index === 0}
            key={project.id}
            project={project}
          />
        ))}
      </div>
      {earlier.length > 0 && (
        <>
          <div
            className="grid outline-none transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
            id={EARLIER_ROLES_ID}
            inert={!isExpanded}
            ref={earlierRef}
            style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
            tabIndex={-1}
          >
            <div className="overflow-hidden">
              <div className="space-y-14 pt-14">
                {earlier.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
          {!isExpanded && (
            <Button
              aria-controls={EARLIER_ROLES_ID}
              className="mt-14 w-full"
              onClick={expand}
              variant="outline"
            >
              Show {earlier.length} earlier roles ({earliestYear} to{" "}
              {latestEarlierYear})
            </Button>
          )}
        </>
      )}
    </Section>
  );
}
