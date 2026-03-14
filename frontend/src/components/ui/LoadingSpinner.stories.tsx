import type { Meta, StoryObj } from "@storybook/react-vite";
import LoadingSpinner from "./LoadingSpinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Full-width centered spinner used during data fetching.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};
