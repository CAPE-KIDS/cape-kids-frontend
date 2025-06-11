import { useTranslation } from "react-i18next";

// ConfirmDialog.tsx
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: (result: boolean) => void;
}) {
  const { t: tC } = useTranslation("common");
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[400] flex items-center justify-center">
      <div className="bg-white p-3 rounded shadow max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 border text-xs cursor-pointer"
          >
            {cancelLabel || tC("cancel")}
          </button>
          <button
            onClick={() => onClose(true)}
            className="px-4 py-2 bg-blue-600 text-white text-xs cursor-pointer"
          >
            {confirmLabel || tC("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
