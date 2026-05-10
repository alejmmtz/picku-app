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
      <div className="w-full max-w-[340px] rounded-[24px] bg-background p-6 shadow-xl">
        <h2 className="text-[22px] font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-[15px] leading-relaxed text-[#7A716D]">
          {description}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-[52px] flex-1 rounded-[12px] border border-[#D8D1CD] text-[15px]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-[52px] flex-1 rounded-[12px] bg-[#A40019] text-[15px] text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;