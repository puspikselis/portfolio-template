"use client";

import {
  Content as TooltipContentPrimitive,
  Portal as TooltipPortal,
  Provider as TooltipProviderPrimitive,
  Root as TooltipRoot,
  Trigger as TooltipTriggerPrimitive,
} from "@radix-ui/react-tooltip";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function TooltipProvider(
  props: ComponentProps<typeof TooltipProviderPrimitive>
) {
  return <TooltipProviderPrimitive {...props} />;
}

function Tooltip(props: ComponentProps<typeof TooltipRoot>) {
  return <TooltipRoot {...props} />;
}

function TooltipTrigger(props: ComponentProps<typeof TooltipTriggerPrimitive>) {
  return <TooltipTriggerPrimitive {...props} />;
}

function TooltipContent({
  children,
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof TooltipContentPrimitive>) {
  return (
    <TooltipPortal>
      <TooltipContentPrimitive sideOffset={sideOffset} {...props}>
        <div
          className={cn(
            "animate-[tooltip-in_480ms_var(--ease-spring-tooltip)_both] rounded-md bg-nero-100 px-2.5 py-1.5 font-medium text-12 text-ink",
            className
          )}
        >
          {children}
        </div>
      </TooltipContentPrimitive>
    </TooltipPortal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
