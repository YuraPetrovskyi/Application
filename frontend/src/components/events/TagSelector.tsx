import type { Tag } from "../../types";

interface Props {
  /** Full list of available tags to choose from. */
  tags: Tag[];
  /** IDs of currently selected tags. */
  selectedIds: string[];
  /** Called with the updated selection whenever the user toggles a tag. */
  onChange: (ids: string[]) => void;
  /** Maximum number of tags the user can select. @default 5 */
  maxSelect?: number;
}

/**
 * Multi-select tag picker. Toggles selection on click; enforces `maxSelect` limit.
 *
 * @param tags        — (required) full list of available tags
 * @param selectedIds — (required) array of currently selected tag IDs (controlled)
 * @param onChange    — (required) callback with the new selection array
 * @param maxSelect   — (optional) max tags the user can pick, default `5`
 *
 * @example
 * const [ids, setIds] = useState<string[]>([]);
 *
 * // basic usage
 * <TagSelector tags={allTags} selectedIds={ids} onChange={setIds} />
 *
 * // limit to 3 tags
 * <TagSelector tags={allTags} selectedIds={ids} onChange={setIds} maxSelect={3} />
 */
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
