import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import BackButton from "./BackButton";

const meta: Meta<typeof BackButton> = {
  title: "Components/BackButton",
  component: BackButton,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="p-6 bg-gray-50 min-h-32 relative">
          <Story />
          <p className="text-xs text-gray-400 mt-4 md:mt-2">
            Resize the viewport to see the mobile fixed variant.
          </p>
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Navigation back button. On **desktop** (md+): inline text button above page content. On **mobile**: fixed pill in the bottom-left corner, always visible during scroll.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: "Back to Events" },
};

export const WithExplicitTarget: Story = {
  args: { label: "Go to Home", to: "/" },
};
