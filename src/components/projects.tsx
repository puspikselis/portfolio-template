"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { EntryCard } from "@/components/entry-card";
import { useCursorPreview } from "@/components/features/cursor-preview";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { DEFAULT_PREVIEW_COLOR } from "@/lib/constants";
import { getYears } from "@/lib/utils";

// Roles shown before "Show earlier roles"; the rest stay in the DOM (crawlable) but collapsed.
const VISIBLE_ROLES = 5;

function fallbackButtonLabel(hasDetailPage: boolean, comingSoon?: boolean) {
  if (hasDetailPage) {
    return "View";
  }
  return comingSoon ? null : "Archive";
}

function ProjectAction({
  company,
  label,
  slug,
}: {
  company: string;
  label: string;
  slug?: string;
}) {
  return (
    <Button asChild className="ml-auto" variant="pill">
      {slug ? (
        <Link className="link-overlay" href={`/projects/${slug}`}>
          {label}
          <span className="sr-only"> {company}</span>
        </Link>
      ) : (
        <span data-inactive="">{label}</span>
      )}
    </Button>
  );
}

function ProjectCard({
  project,
  isFirst,
}: {
  project: (typeof projects)[number];
  isFirst?: boolean;
}) {
  const { hidePreview, showPreview } = useCursorPreview();

  const previewColor = project.color || DEFAULT_PREVIEW_COLOR;
  const buttonLabel =
    project.buttonLabel ??
    fallbackButtonLabel(Boolean(project.slug), project.comingSoon);

  const handlePointerEnter = useCallback(() => {
    if (!project.preview) {
      return;
    }
    showPreview(previewColor, project.preview);
  }, [project.preview, previewColor, showPreview]);

  return (
    <EntryCard
      actions={
        buttonLabel ? (
          <ProjectAction
            company={project.company}
            label={buttonLabel}
            slug={project.slug}
          />
        ) : null
      }
      color={previewColor}
      company={project.company}
      fallback={project.Icon ? <project.Icon /> : undefined}
      image={project.image}
      isFirst={isFirst}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={hidePreview}
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
    <section
      aria-labelledby="projects-heading"
      className="narrow-container"
      data-color="var(--color-orange-100)"
      data-title={title}
    >
      <h2 className="sr-only" id="projects-heading">
        {title}
      </h2>
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
            id="earlier-roles"
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
              aria-controls="earlier-roles"
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
    </section>
  );
}
