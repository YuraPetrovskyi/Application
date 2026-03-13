import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Page navigation with smart ellipsis. Renders `null` when `totalPages <= 1`.",
      },
    },
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const Interactive = (args: React.ComponentProps<typeof Pagination>) => {
  const [page, setPage] = useState(args.page);
  return <Pagination {...args} page={page} onPageChange={setPage} />;
};

export const FewPages: Story = {
  render: (args) => <Interactive {...args} />,
  args: { page: 1, totalPages: 5 },
};

export const ManyPages: Story = {
  render: (args) => <Interactive {...args} />,
  args: { page: 1, totalPages: 20 },
};

export const MiddlePage: Story = {
  render: (args) => <Interactive {...args} />,
  args: { page: 8, totalPages: 20 },
};

export const LastPage: Story = {
  render: (args) => <Interactive {...args} />,
  args: { page: 20, totalPages: 20 },
};
