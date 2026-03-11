interface Props {
  /** The question or warning text shown inside the dialog. */
  message: string;
  /** Called when the user clicks the confirm (destructive) button. */
  onConfirm: () => void;
  /** Called when the user clicks the cancel button or dismisses the dialog. */
  onCancel: () => void;
  /** Label for the confirm button. @default "Delete" */
  confirmLabel?: string;
  /** Label for the cancel button. @default "Cancel" */
  cancelLabel?: string;
}

/**
 * Full-screen modal dialog that asks the user to confirm a destructive action.
 *
 * @param message       — (required) the question / warning text shown in the dialog
 * @param onConfirm     — (required) called when the user clicks the confirm button
 * @param onCancel      — (required) called when the user clicks Cancel or dismisses
 * @param confirmLabel  — (optional) confirm button text, default `"Delete"`
 * @param cancelLabel   — (optional) cancel button text, default `"Cancel"`
 *
 * @example
 * // minimal — delete event
 * <ConfirmModal
 *   message="Are you sure you want to delete this event?"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowConfirm(false)}
 * />
 *
 * // custom labels — leave event
 * <ConfirmModal
 *   message="Are you sure you want to leave this event?"
 *   confirmLabel="Leave"
 *   cancelLabel="Stay"
 *   onConfirm={handleLeave}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */
export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm action
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
