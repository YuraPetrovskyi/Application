import type { Tag } from "../types";

interface Props {
  tags: Tag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxSelect?: number;
}

export default function TagSelector({
  tags,
  selectedIds,
  onChange,
  maxSelect = 5,
}: Props) {
  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((t) => t !== id)
        : selectedIds.length < maxSelect
          ? [...selectedIds, id]
          : selectedIds,
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => {
        const selected = selectedIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors ${
              selected
                ? "bg-indigo-400 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
