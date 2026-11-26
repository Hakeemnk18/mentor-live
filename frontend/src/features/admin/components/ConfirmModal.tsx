import AdminModal from "./ui/AdminModal";
import AdminButton from "./ui/AdminButton";

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

/** "Are you sure?" dialog in the admin design. Same props as before, so every page using it is updated. */
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
  const danger = confirmVariant === "danger";
  const close = () => {
    if (!loading) onClose();
  };

  return (
    <AdminModal
      open={open}
      onClose={close}
      size="sm"
      zIndex={1100}
      title={
        <span className="flex items-center gap-3">
          <span
            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
              danger ? "bg-[#FFE3DF] text-[#C8372D]" : "bg-[#FFF1D6] text-[#8A5A00]"
            }`}
            aria-hidden
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </span>
          {title}
        </span>
      }
      footer={
        <>
          <AdminButton variant="outline" onClick={close} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            className={danger ? "" : "!bg-[#E0A100] hover:!bg-[#C78F00]"}
          >
            {confirmLabel}
          </AdminButton>
        </>
      }
    >
      <p className="m-0 text-sm leading-relaxed text-[#655B7E]">{message}</p>
    </AdminModal>
  );
}
