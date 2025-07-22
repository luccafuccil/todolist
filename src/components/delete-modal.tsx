"use client";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onUndo?: () => void;
  title?: string;
}

export function DeleteModal({
  open,
  onClose,
  onUndo,
  title = "Task Deleted",
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          >
            OK
          </button>
          {onUndo && (
            <button
              onClick={onUndo}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
