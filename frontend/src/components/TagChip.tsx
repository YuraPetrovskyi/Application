import type { Tag } from "../types";
import { getTagColor } from "../utils/tagColors";

interface Props {
  tag: Tag;
  size?: "sm" | "md";
}

export default function TagChip({ tag, size = "sm" }: Props) {
  const color = getTagColor(tag.name);
  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`${sizeClass} font-medium ${color.chipBg} ${color.chipText} rounded-lg border ${color.chipBorder}`}
    >
      {tag.name}
    </span>
  );
}
