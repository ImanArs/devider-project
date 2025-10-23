import React from "react";

export type CellProps = React.ComponentProps<"div">;

export const Cell = React.forwardRef<HTMLDivElement, CellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-2xl w-[50px] h-[50px] border rounded-[10px] px-4 py-2 ${
          className ?? ""
        }`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Cell.displayName = "Cell";
