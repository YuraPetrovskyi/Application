import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import PerPageSelector from "./PerPageSelector";

const meta: Meta<typeof PerPageSelector> = {
  title: "Components/PerPageSelector",
  component: PerPageSelector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toggles the number of items shown per page. Designed for list views with server-side pagination. Highlights the active value and resets the page to 1 on change.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PerPageSelector>;

const Controlled = (
  args: Omit<
    React.ComponentProps<typeof PerPageSelector>,
    "value" | "onChange"
  >,
) => {
  const [value, setValue] = useState(12);
  return <PerPageSelector {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: () => <Controlled />,
};

export const SmallSelection: Story = {
  name: "Active = 6",
  render: () => {
    const [value, setValue] = useState(6);
    return (
      <PerPageSelector
        value={value}
        options={[6, 12, 24]}
        onChange={setValue}
      />
    );
  },
};

export const CustomOptions: Story = {
  name: "Custom options [10, 25, 50]",
  render: () => {
    const [value, setValue] = useState(25);
    return (
      <PerPageSelector
        value={value}
        options={[10, 25, 50]}
        onChange={setValue}
      />
    );
  },
};
