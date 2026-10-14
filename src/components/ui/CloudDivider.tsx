import { cn } from "@/lib/utils";

interface CloudDividerProps {
  /** Color the divider fades into on the section below it. */
  toColor?: string;
  className?: string;
  flip?: boolean;
}

/**
 * A drifting mist/cloud silhouette that sits between sections — the visual
 * signature of the site. Sajek is known locally as the "kingdom of clouds";
 * this motif repeats that idea structurally, as a soft layer of fog settling
 * between one part of the story and the next, rather than a hard edge.
 */
export default function CloudDivider({
  toColor = "#F5F1E7",
  className,
  flip = false,
}: CloudDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-16 md:h-24 w-full overflow-hidden",
        flip && "rotate-180",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0,96 C180,140 320,40 500,80 C680,120 760,40 960,72 C1160,104 1280,48 1440,88 L1440,160 L0,160 Z"
          fill={toColor}
          opacity="0.55"
          className="motion-safe:animate-[drift_32s_ease-in-out_infinite]"
        />
        <path
          d="M0,120 C200,90 340,150 560,112 C780,74 880,140 1080,110 C1220,90 1340,130 1440,108 L1440,160 L0,160 Z"
          fill={toColor}
          opacity="0.8"
          className="motion-safe:animate-[drift_24s_ease-in-out_infinite_reverse]"
        />
        <path
          d="M0,140 C220,120 360,160 600,132 C820,106 940,150 1160,128 C1280,116 1360,140 1440,130 L1440,160 L0,160 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
