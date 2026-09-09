"use client";

import Link from "next/link";
import { type CSSProperties, useCallback } from "react";

import { useCursorPreview } from "@/components/features/cursor-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TagList } from "@/components/ui/tag-list";
import { projects } from "@/data/projects";
import { DEFAULT_PREVIEW_COLOR } from "@/lib/constants";

const YEAR_RE = /\d{4}/;

function fallbackButtonLabel(hasDetailPage: boolean, comingSoon?: boolean) {
  if (hasDetailPage) {
    return "View";
  }
  return comingSoon ? "No case study" : "Archive";
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
  const hasDetailPage = Boolean(project.slug);
  const buttonLabel =
    project.buttonLabel ??
    fallbackButtonLabel(hasDetailPage, project.comingSoon);

  const handlePointerEnter = useCallback(() => {
    if (!project.preview) {
      return;
    }
    showPreview(previewColor, project.preview);
  }, [project.preview, previewColor, showPreview]);

  const yearMatch = project.year.match(YEAR_RE);
  const dateTime = yearMatch ? yearMatch[0] : undefined;

  return (
    <div className="space-y-6">
      <p
        className="font-medium text-13/4 text-dim-gray-100"
        data-align-target={isFirst ? "true" : undefined}
      >
        <time dateTime={dateTime}>{project.year}</time>
      </p>
      <div
        className="relative flex items-center gap-4"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={hidePreview}
      >
        <Avatar
          className="size-12 rounded-xl bg-(--color)"
          style={{ "--color": previewColor } as CSSProperties}
        >
          <AvatarImage alt={`${project.title} logo`} src={project.image} />
          <AvatarFallback className="bg-transparent text-15 text-ink/20 -tracking-[0.02em]">
            {project.Icon ? <project.Icon /> : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-semibold text-15/6 text-ink -tracking-[0.02em]">
            {project.title}
          </h3>
          <TagList tags={project.tags} truncate />
        </div>
        <Button
          asChild={hasDetailPage}
          className="ml-auto"
          disabled={!hasDetailPage}
          variant="pill"
        >
          {hasDetailPage ? (
            <Link className="link-overlay" href={`/projects/${project.slug}`}>
              {buttonLabel}
            </Link>
          ) : (
            buttonLabel
          )}
        </Button>
      </div>
    </div>
  );
}

export function Projects({ excludeSlug }: { excludeSlug?: string } = {}) {
  const filteredProjects = excludeSlug
    ? projects.filter((project) => project.slug && project.slug !== excludeSlug)
    : projects;

  return (
    <section
      aria-labelledby="projects-heading"
      className="narrow-container"
      data-color="var(--color-orange-100)"
      data-title={excludeSlug ? "Other Positions" : "Employment History"}
    >
      <h2 className="sr-only" id="projects-heading">
        {excludeSlug ? "Other Positions" : "Employment History"}
      </h2>
      <div className="space-y-14">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            isFirst={index === 0}
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}
