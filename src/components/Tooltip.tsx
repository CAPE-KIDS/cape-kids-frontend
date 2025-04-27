// components/ui/Tooltip.tsx
import { ReactNode, useState } from "react";
import { Info } from "lucide-react";
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  Placement,
  useInteractions,
  useHover,
} from "@floating-ui/react";

type TooltipProps = {
  children: ReactNode;
  placement?: Placement;
};

export function Tooltip({ children, placement = "top" }: TooltipProps) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift()],
    placement,
  });

  const hover = useHover(context, { move: false, delay: 100 });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <div className="relative inline-block">
      <Info
        size={16}
        ref={refs.setReference}
        {...getReferenceProps()}
        className="text-blue-500 cursor-pointer hover:opacity-80"
      />
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 min-w-[200px] max-w-xs rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
}
