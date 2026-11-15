import { QuoteIcon } from "@/components/icons/quote-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Section } from "@/components/ui/section";
import { MUTED_ACCENT } from "@/lib/styles";
import { TEXT_BODY, TEXT_CAPTION, TEXT_DISPLAY } from "@/lib/typography";
import { cn, densitySrcSet } from "@/lib/utils";

/** Splits a paragraph into lines; every line but the last ends in a <br>. */
export function toLines(paragraph: string) {
  const lines = paragraph.split("\n");
  return lines.map((text, index) => ({
    breakAfter: index < lines.length - 1,
    key: `${index}-${text.slice(0, 30)}`,
    text,
  }));
}

interface TestimonialProps {
  author: {
    image: string;
    name: string;
    title: string;
  };
  children: string;
  className?: string;
}

export function Testimonial({ author, children, className }: TestimonialProps) {
  const paragraphs = children.split("\n\n").filter(Boolean);

  return (
    <Section
      className={cn("narrow-container", className)}
      color={MUTED_ACCENT}
      headingId="testimonial-heading"
      title="Reference"
    >
      <figure className="relative">
        {/* Inline on purpose: it keeps the line box the old wrapper div had. */}
        <QuoteIcon className="mb-9 size-5 text-dim-gray-100 md:absolute md:top-2 md:-left-24 md:mb-0" />

        <blockquote className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p
              className={
                index === 0 ? TEXT_DISPLAY : cn("font-medium", TEXT_BODY)
              }
              key={paragraph.slice(0, 50)}
            >
              {toLines(paragraph).map((line) => (
                <span key={line.key}>
                  {line.text}
                  {line.breakAfter ? <br /> : null}
                </span>
              ))}
            </p>
          ))}
        </blockquote>

        <figcaption className="mt-9 flex items-center gap-3 pb-2">
          <Avatar className="size-9 rounded-xl">
            <AvatarImage
              alt={author.name}
              src={author.image}
              srcSet={densitySrcSet(author.image)}
            />
            <AvatarFallback className="rounded-xl bg-dim-gray-100 text-ink">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-semibold text-13/4 text-ink -tracking-[0.03em]">
              {author.name}
            </p>
            <p className={TEXT_CAPTION}>{author.title}</p>
          </div>
        </figcaption>
      </figure>
    </Section>
  );
}
