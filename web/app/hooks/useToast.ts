import { toast, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export function useToast() {
  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions
  ) => {
    const mergedOptions = { ...defaultOptions, ...options };

    switch (type) {
      case "success":
        toast.success(message, mergedOptions);
        break;
      case "error":
        toast.error(message, mergedOptions);
        break;
      case "warning":
        toast.warning(message, mergedOptions);
        break;
      case "info":
      default:
        toast.info(message, mergedOptions);
        break;
    }
  };

  return {
    success: (message: string, options?: ToastOptions) =>
      showToast(message, "success", options),
    error: (message: string, options?: ToastOptions) =>
      showToast(message, "error", options),
    warning: (message: string, options?: ToastOptions) =>
      showToast(message, "warning", options),
    info: (message: string, options?: ToastOptions) =>
      showToast(message, "info", options),
    toast: showToast,
  };
}

