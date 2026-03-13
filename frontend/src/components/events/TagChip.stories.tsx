import type { Meta, StoryObj } from "@storybook/react-vite";
import TagChip from "./TagChip";

const meta: Meta<typeof TagChip> = {
  title: "Components/TagChip",
  component: TagChip,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagChip>;

export const Tech: Story = {
  args: { tag: { id: "1", name: "Tech" }, size: "sm" },
};

export const Art: Story = {
  args: { tag: { id: "2", name: "Art" }, size: "sm" },
};

export const Music: Story = {
  args: { tag: { id: "3", name: "Music" }, size: "sm" },
};

export const Business: Story = {
  args: { tag: { id: "4", name: "Business" }, size: "sm" },
};

export const Science: Story = {
  args: { tag: { id: "5", name: "Science" }, size: "sm" },
};

export const Sport: Story = {
  args: { tag: { id: "6", name: "Sport" }, size: "sm" },
};

export const Education: Story = {
  args: { tag: { id: "7", name: "Education" }, size: "sm" },
};

export const Health: Story = {
  args: { tag: { id: "8", name: "Health" }, size: "sm" },
};

export const Unknown: Story = {
  args: { tag: { id: "9", name: "Custom Tag" }, size: "sm" },
};

export const MediumSize: Story = {
  args: { tag: { id: "1", name: "Tech" }, size: "md" },
};

export const AllTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      {[
        { id: "1", name: "Tech" },
        { id: "2", name: "Art" },
        { id: "3", name: "Business" },
        { id: "4", name: "Music" },
        { id: "5", name: "Science" },
        { id: "6", name: "Sport" },
        { id: "7", name: "Education" },
        { id: "8", name: "Health" },
      ].map((tag) => (
        <TagChip key={tag.id} tag={tag} size="sm" />
      ))}
    </div>
  ),
};
