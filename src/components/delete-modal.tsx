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
  title,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="delete-btn text-sm">
            Delete
          </button>
          {onUndo && (
            <button onClick={onUndo} className="main-btn text-sm">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
