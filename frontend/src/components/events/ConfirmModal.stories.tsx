import type { Meta, StoryObj } from "@storybook/react-vite";
import ConfirmModal from "./ConfirmModal";

const meta: Meta<typeof ConfirmModal> = {
  title: "Components/ConfirmModal",
  component: ConfirmModal,
  tags: ["autodocs"],
  args: {
    onConfirm: () => {},
    onCancel: () => {},
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Blocking confirmation dialog rendered over a dark overlay. Used before destructive actions (e.g. deleting an event).",
      },
      story: {
        inline: false,
        iframeHeight: 320,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const ShortMessage: Story = {
  args: {
    message: "Delete this event?",
  },
};

export const CustomLabels: Story = {
  args: {
    message: "Are you sure you want to leave this event?",
    confirmLabel: "Leave",
    cancelLabel: "Stay",
  },
};
