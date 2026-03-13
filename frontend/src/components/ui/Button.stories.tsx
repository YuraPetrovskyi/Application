import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Base button with `primary`, `secondary`, and `danger` variants. Supports `loading` and `fullWidth` props.",
      },
    },
  },
  args: {
    children: "Click me",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Delete" },
};

export const Loading: Story = {
  args: { variant: "primary", loading: true, children: "Saving..." },
};

export const Disabled: Story = {
  args: { variant: "primary", disabled: true, children: "Unavailable" },
};

export const FullWidth: Story = {
  args: { variant: "primary", fullWidth: true, children: "Submit" },
  parameters: { layout: "padded" },
};
