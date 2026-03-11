import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import TagSelector from "./TagSelector";
import type { Tag } from "../types";

const TAGS: Tag[] = [
  { id: "1", name: "Tech" },
  { id: "2", name: "Art" },
  { id: "3", name: "Business" },
  { id: "4", name: "Music" },
  { id: "5", name: "Science" },
  { id: "6", name: "Sport" },
  { id: "7", name: "Education" },
  { id: "8", name: "Health" },
];

const meta: Meta<typeof TagSelector> = {
  title: "Components/TagSelector",
  component: TagSelector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Multi-select tag picker. Allows selecting up to `maxSelect` tags (default 5).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagSelector>;

/** Interactive controlled wrapper so the story is actually usable */
function Controlled({
  initialIds = [],
  maxSelect = 5,
}: {
  initialIds?: string[];
  maxSelect?: number;
}) {
  const [ids, setIds] = useState<string[]>(initialIds);
  return (
    <div className="p-4">
      <TagSelector
        tags={TAGS}
        selectedIds={ids}
        onChange={setIds}
        maxSelect={maxSelect}
      />
      <p className="mt-3 text-xs text-gray-400">
        Selected: {ids.length ? ids.join(", ") : "(none)"}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const PreSelected: Story = {
  render: () => <Controlled initialIds={["1", "3"]} />,
};

export const MaxReached: Story = {
  name: "Max 2 selections",
  render: () => <Controlled initialIds={["1", "2"]} maxSelect={2} />,
};
