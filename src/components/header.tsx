"use client";

import Link from "next/link";
import { type ChangeEvent, useCallback, useState } from "react";
import { ContactDialog } from "@/components/dialogs/contact-dialog";
import { SpotifyStatus } from "@/components/features/spotify-status";
import { AppLink } from "@/components/ui/app-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RollingText } from "@/components/ui/rolling-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LINKEDIN_URL,
  OWNER_PHOTO_PATH,
  RESUME_PATH,
  RESUME_UPDATED,
  SITE_NAME,
} from "@/lib/constants";

function handleLinksChange(e: ChangeEvent<HTMLSelectElement>) {
  if (e.target.value) {
    window.open(e.target.value, "_blank");
  }
  e.target.value = "";
}

export function Header() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const openContact = useCallback(() => setIsContactOpen(true), []);
  const closeContact = useCallback(() => setIsContactOpen(false), []);

  return (
    <>
      <header className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between bg-canvas p-5 md:sticky md:top-0 md:bg-transparent md:px-12 md:py-8">
        {/* One home link covers avatar and name; the status sits over its empty top-right cell. */}
        <div className="group grid grid-cols-[auto_auto] items-center gap-x-3">
          <Link
            className="focus-ring col-[1/3] row-[1/3] grid grid-cols-subgrid grid-rows-subgrid"
            href="/"
          >
            <Avatar className="row-span-2 size-9 rounded-xl transition-opacity hover:opacity-80">
              <AvatarImage
                alt=""
                className="rounded-none"
                src={OWNER_PHOTO_PATH}
              />
              <AvatarFallback>KK</AvatarFallback>
            </Avatar>
            <RollingText
              className="col-start-2 row-start-2 self-start font-semibold text-13/4 text-ink"
              text={SITE_NAME}
            />
          </Link>
          <SpotifyStatus className="col-start-2 row-start-1 self-end" />
        </div>
        <nav aria-label="Primary" className="flex items-center md:gap-5">
          <select
            aria-label="Links"
            className="focus-ring appearance-none font-semibold text-12 text-nobel-100 md:hidden"
            onChange={handleLinksChange}
          >
            <option value="">Links</option>
            <option value={RESUME_PATH}>
              Resume (updated {RESUME_UPDATED})
            </option>
            <option value={LINKEDIN_URL}>LinkedIn</option>
          </select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                className="group hidden md:inline-flex"
                variant="link"
              >
                <AppLink
                  aria-label="Download Resume PDF"
                  external
                  href={RESUME_PATH}
                >
                  <RollingText text="Resume" />
                </AppLink>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Updated {RESUME_UPDATED}</TooltipContent>
          </Tooltip>
          <Button
            asChild
            className="group hidden md:inline-flex"
            variant="link"
          >
            <AppLink
              aria-label="Visit LinkedIn profile"
              external
              href={LINKEDIN_URL}
            >
              <RollingText text="LinkedIn" />
            </AppLink>
          </Button>
          <Button onClick={openContact} variant="pill">
            Contact
          </Button>
        </nav>
      </header>
      <ContactDialog isOpen={isContactOpen} onClose={closeContact} />
    </>
  );
}
