"use client";

import Link from "next/link";
import { type ChangeEvent, useCallback, useState } from "react";

import { ContactDialog } from "@/components/dialogs/contact-dialog";
import { SpotifyStatus } from "@/components/features/spotify-status";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RollingText } from "@/components/ui/rolling-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <div className="group flex items-center gap-3">
          <Link className="focus:outline-none md:focus:outline-auto" href="/">
            <Avatar className="size-9 rounded-xl transition-opacity hover:opacity-80">
              <AvatarImage
                alt="Kristaps Krūze"
                className="rounded-none"
                src="/images/KK.avif"
              />
              <AvatarFallback>KK</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col-reverse justify-center">
            <SpotifyStatus />
          </div>
        </div>
        <nav aria-label="Primary" className="flex items-center md:gap-5">
          <select
            aria-label="Links"
            className="appearance-none font-semibold text-12 text-nobel-100 focus:outline-none md:hidden"
            onChange={handleLinksChange}
          >
            <option value="">Links</option>
            <option value="/documents/kristaps-kruze-resume.pdf">
              Resume (updated October 5, 2025)
            </option>
            <option value="https://www.linkedin.com/in/kristapskruze/">
              LinkedIn
            </option>
          </select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                className="group hidden md:inline-flex"
                variant="link"
              >
                <a
                  aria-label="Download Resume PDF"
                  href="/documents/kristaps-kruze-resume.pdf"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <RollingText text="Resume" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Updated October 5, 2025</TooltipContent>
          </Tooltip>
          <Button
            asChild
            className="group hidden md:inline-flex"
            variant="link"
          >
            <a
              aria-label="Visit LinkedIn profile"
              href="https://www.linkedin.com/in/kristapskruze/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <RollingText text="LinkedIn" />
            </a>
          </Button>
          <ThemeToggle />
          <Button onClick={openContact} variant="pill">
            Contact
          </Button>
        </nav>
      </header>
      <ContactDialog isOpen={isContactOpen} onClose={closeContact} />
    </>
  );
}
