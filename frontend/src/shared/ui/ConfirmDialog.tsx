import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-3xl border bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl p-6 shadow-2xl"
          >
            <h2 className="text-xl font-bold">{title}</h2>

            {description && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-6">
                {description}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 rounded-2xl border disabled:opacity-50"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white disabled:opacity-50"
              >
                {loading ? "..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};