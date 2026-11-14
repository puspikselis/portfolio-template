import { QuoteIcon } from "@/components/icons/quote-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const IMAGE_EXT_RE = /\.(jpg|png|avif)$/;

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
}

export function Testimonial({ author, children }: TestimonialProps) {
  const paragraphs = children.split("\n\n").filter(Boolean);

  return (
    <section
      aria-labelledby="testimonial-heading"
      className="narrow-container"
      data-title="Reference"
    >
      <h2 className="sr-only" id="testimonial-heading">
        Reference
      </h2>
      <figure className="relative">
        {/* Inline on purpose: it keeps the line box the old wrapper div had. */}
        <QuoteIcon className="mb-9 size-5 text-dim-gray-100 md:absolute md:top-2 md:-left-24 md:mb-0" />

        <blockquote className="space-y-4">
          {paragraphs.map((paragraph) => (
            <p
              className="font-medium not-first:text-15/7 not-first:text-nobel-100 text-28/10 text-ink -tracking-[0.01em] not-first:-tracking-[0.02em]"
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
              srcSet={`${author.image} 1x, ${author.image.replace(IMAGE_EXT_RE, "@2x.$1")} 2x, ${author.image.replace(IMAGE_EXT_RE, "@3x.$1")} 3x`}
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
            <p className="font-medium text-12/4 text-dim-gray-100 -tracking-[0.03em]">
              {author.title}
            </p>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
