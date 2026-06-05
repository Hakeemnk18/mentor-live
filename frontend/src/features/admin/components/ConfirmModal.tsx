type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  confirmVariant = "danger",
  loading,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  const confirmCls =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-amber-500 hover:bg-amber-600 text-white";

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={!loading ? onClose : undefined}
      />
      <div className="relative w-full max-w-sm mx-4 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-base font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmCls}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
