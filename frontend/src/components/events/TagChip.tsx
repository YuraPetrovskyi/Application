import type { Tag } from "../../types";
import { getTagColor } from "../../utils/tagColors";

interface Props {
  /** The tag object to display. */
  tag: Tag;
  /** Visual size of the chip. @default "sm" */
  size?: "sm" | "md";
}

/**
 * Displays a single tag as a colored pill/chip badge.
 *
 * @param tag     — (required) tag object `{ id, name }`
 * @param size    — (optional) `"sm"` | `"md"`, default `"sm"`
 *
 * @example
 * // minimal — required props only
 * <TagChip tag={{ id: "1", name: "Tech" }} />
 *
 * // larger chip
 * <TagChip tag={tag} size="md" />
 *
 * // inside a flex row
 * {event.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)}
 */
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
