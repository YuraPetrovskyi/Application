import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Base input with optional label and inline error message. Forwards its ref — compatible with `react-hook-form`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    error: "Password must be at least 6 characters",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    placeholder: "john.doe",
    disabled: true,
    defaultValue: "john.doe",
  },
};

export const PasswordType: Story = {
  args: {
    label: "New password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "••••••••",
  },
};
