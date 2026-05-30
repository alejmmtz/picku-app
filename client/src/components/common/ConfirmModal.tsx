interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-[2px]">
      <div className="app-card w-full max-w-[340px] bg-background p-6 shadow-xl">
        <h2 className="text-[22px] font-semibold text-black">
          {title}
        </h2>

        <p className="app-subtitle mt-2">
          {description}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="app-ghost-action h-[52px] flex-1 border-black/15 text-black"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="app-action h-[52px] flex-1 bg-maroon"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
