"use client";

interface DeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
}

export function DeleteModal({
  open,
  onConfirm,
  onCancel,
  title = "Are you sure?",
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="delete-modal">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="main-btn text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="delete-btn text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
