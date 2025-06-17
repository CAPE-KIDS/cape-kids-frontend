import { ReactNode } from "react";
import { Info } from "lucide-react";
import TooltipMui, {
  TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";

type TooltipProps = {
  children: ReactNode;
  placement?: MuiTooltipProps["placement"];
};

export function Tooltip({ children, placement = "top" }: TooltipProps) {
  return (
    <TooltipMui
      title={children}
      placement={placement}
      arrow
      enterDelay={100}
      slotProps={{
        tooltip: {
          className:
            "!bg-gray-900 !px-3 !py-2 !text-sm !text-white !rounded-md !shadow-lg !max-w-xs",
        },
        arrow: {
          className: "!text-gray-900",
        },
      }}
    >
      <span className="inline-flex items-center">
        <Info
          size={16}
          className="text-blue-500 cursor-pointer hover:opacity-80"
        />
      </span>
    </TooltipMui>
  );
}
