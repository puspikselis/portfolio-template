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

const TooltipProvider = (
  props: ComponentProps<typeof TooltipProviderPrimitive>
) => <TooltipProviderPrimitive {...props} />;

const Tooltip = (props: ComponentProps<typeof TooltipRoot>) => (
  <TooltipRoot {...props} />
);

const TooltipTrigger = (
  props: ComponentProps<typeof TooltipTriggerPrimitive>
) => <TooltipTriggerPrimitive {...props} />;

const TooltipContent = ({
  children,
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof TooltipContentPrimitive>) => (
  <TooltipPortal>
    <TooltipContentPrimitive sideOffset={sideOffset} {...props}>
      <div
        className={cn(
          "animate-tooltip-in rounded-md bg-nero-100 px-2.5 py-1.5 text-12 font-medium text-ink",
          className
        )}
      >
        {children}
      </div>
    </TooltipContentPrimitive>
  </TooltipPortal>
);

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
