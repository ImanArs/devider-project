import React from "react";
import { cn } from "@/shared/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
  open?: boolean;
  placement?: "bottom" | "top";
  offset?: number;
}

export function Tooltip({
  children,
  content,
  className,
  open = false,
  placement = "bottom",
  offset = 8,
}: TooltipProps) {
  const show = open && !!content;

  return (
    <div className="relative inline-block align-top">
      {children}
      {show && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs min-w-[150px] w-fit max-w-[260px] rounded-md shadow-sm",
            "text-white bg-gray-900",
            placement === "bottom"
              ? "left-1/2 -translate-x-1/2 top-full"
              : "left-1/2 -translate-x-1/2 bottom-full",
            className
          )}
          style={
            placement === "bottom"
              ? { marginTop: offset }
              : { marginBottom: offset }
          }
        >
          {content}
          {/* стрелка */}
          <span
            className={cn(
              "absolute w-2 h-2 rotate-45 bg-gray-900",
              placement === "bottom"
                ? "-top-1 left-1/2 -translate-x-1/2"
                : "-bottom-1 left-1/2 -translate-x-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
}
