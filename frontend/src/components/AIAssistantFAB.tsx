import { Bot } from "lucide-react";
import { useAppSelector } from "../hooks/useAppStore";
import { useUIStore } from "../store/useUIStore";

/**
 * Floating Action Button that opens the AI Assistant drawer.
 * Only visible when the user is logged in.
 */
export default function AIAssistantFAB() {
  const { user } = useAppSelector((s) => s.auth);
  const openAssistant = useUIStore((s) => s.openAssistant);

  if (!user) return null;

  return (
    <button
      onClick={openAssistant}
      aria-label="Open AI Assistant"
      className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
    >
      <Bot size={24} />
    </button>
  );
}
