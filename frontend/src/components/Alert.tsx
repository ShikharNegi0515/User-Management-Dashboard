interface AlertProps {
  type: 'error' | 'success';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const styles =
    type === 'error'
      ? 'bg-red-50 border-red-200 text-red-800'
      : 'bg-green-50 border-green-200 text-green-800';

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded p-1 hover:bg-black/5"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
