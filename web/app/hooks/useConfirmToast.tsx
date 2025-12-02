import { toast } from "react-toastify";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
};

export function useConfirmToast() {
  const confirm = ({
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  }: ConfirmOptions) => {
    const handleConfirm = async () => {
      toast.dismiss();
      await onConfirm();
    };

    const handleCancel = () => {
      toast.dismiss();
      onCancel?.();
    };

    toast.warning(
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold text-sm mb-1">{title}</p>
          <p className="text-xs text-slate-600">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        hideProgressBar: true,
      }
    );
  };

  return { confirm };
}

