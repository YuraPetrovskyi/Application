export interface TagColor {
  bg: string;
  border: string;
  text: string;
  hoverBg: string;
  dividerBg: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
}

const TAG_COLORS: Record<string, TagColor> = {
  Tech: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    hoverBg: "hover:bg-blue-100",
    dividerBg: "bg-blue-300",
    chipBg: "bg-blue-50",
    chipText: "text-blue-700",
    chipBorder: "border-blue-400",
  },
  Art: {
    bg: "bg-orange-50",
    border: "border-orange-400",
    text: "text-orange-800",
    hoverBg: "hover:bg-orange-100",
    dividerBg: "bg-orange-300",
    chipBg: "bg-orange-50",
    chipText: "text-orange-700",
    chipBorder: "border-orange-400",
  },
  Business: {
    bg: "bg-blue-200",
    border: "border-blue-400",
    text: "text-blue-800",
    hoverBg: "hover:bg-blue-100",
    dividerBg: "bg-blue-300",
    chipBg: "bg-blue-200",
    chipText: "text-blue-700",
    chipBorder: "border-blue-400",
  },
  Music: {
    bg: "bg-purple-50",
    border: "border-purple-400",
    text: "text-purple-800",
    hoverBg: "hover:bg-purple-100",
    dividerBg: "bg-purple-300",
    chipBg: "bg-purple-50",
    chipText: "text-purple-700",
    chipBorder: "border-purple-400",
  },
  Science: {
    bg: "bg-cyan-50",
    border: "border-cyan-400",
    text: "text-cyan-800",
    hoverBg: "hover:bg-cyan-100",
    dividerBg: "bg-cyan-300",
    chipBg: "bg-cyan-50",
    chipText: "text-cyan-700",
    chipBorder: "border-cyan-400",
  },
  Sport: {
    bg: "bg-green-300",
    border: "border-green-400",
    text: "text-green-800",
    hoverBg: "hover:bg-green-400",
    dividerBg: "bg-green-300",
    chipBg: "bg-green-300",
    chipText: "text-green-700",
    chipBorder: "border-green-400",
  },
  Education: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
    hoverBg: "hover:bg-yellow-100",
    dividerBg: "bg-yellow-300",
    chipBg: "bg-yellow-50",
    chipText: "text-yellow-700",
    chipBorder: "border-yellow-400",
  },
  Health: {
    bg: "bg-rose-50",
    border: "border-rose-400",
    text: "text-rose-800",
    hoverBg: "hover:bg-rose-100",
    dividerBg: "bg-rose-300",
    chipBg: "bg-rose-50",
    chipText: "text-rose-700",
    chipBorder: "border-rose-400",
  },
};

const DEFAULT_COLOR: TagColor = {
  bg: "bg-indigo-50",
  border: "border-indigo-200",
  text: "text-indigo-800",
  hoverBg: "hover:bg-indigo-100",
  dividerBg: "bg-indigo-200",
  chipBg: "bg-indigo-50",
  chipText: "text-indigo-600",
  chipBorder: "border-indigo-100",
};

export function getTagColor(tagName?: string): TagColor {
  if (!tagName) return DEFAULT_COLOR;
  return TAG_COLORS[tagName] ?? DEFAULT_COLOR;
}
