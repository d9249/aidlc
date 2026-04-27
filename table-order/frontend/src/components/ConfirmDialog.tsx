"use client";

interface Props {
  title: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, isOpen, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" data-testid="confirm-dialog">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button data-testid="confirm-dialog-cancel" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">취소</button>
          <button data-testid="confirm-dialog-confirm" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white">확인</button>
        </div>
      </div>
    </div>
  );
}
