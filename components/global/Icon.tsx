import { cn } from "@/lib/utils";
import type { IconProps } from "@/typescript/types/general/Icon";

export default function Icon({
  IconComponent,
  className,
  toneTwoColor,
  ...props
}: IconProps) {
  return (
    <IconComponent
      className={cn(
        "text-primary-1",
        toneTwoColor && "[&_path[opacity]]:opacity-100",
        toneTwoColor && "[&_path[opacity]]:stroke-[var(--tone-two-color)]",
        className,
      )}
      style={
        toneTwoColor
          ? ({ "--tone-two-color": `var(${toneTwoColor})` } as React.CSSProperties)
          : undefined
      }
      {...props}
    />
  );
}
