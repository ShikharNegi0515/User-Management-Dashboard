import { useEffect, useState } from 'react';
import type { UserFilters } from '../types/user';

interface FilterModalProps {
  isOpen: boolean;
  filters: UserFilters;
  onApply: (filters: UserFilters) => void;
  onClose: () => void;
}

export function FilterModal({
  isOpen,
  filters,
  onApply,
  onClose,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<UserFilters>(filters);

  useEffect(() => {
    if (isOpen) setLocalFilters(filters);
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    const cleared = { firstName: '', lastName: '', email: '', department: '' };
    setLocalFilters(cleared);
    onApply(cleared);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Filter Users</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {(
            [
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['email', 'Email'],
              ['department', 'Department'],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {label}
              </label>
              <input
                type="text"
                value={localFilters[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={`Filter by ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleClear}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              onApply(localFilters);
              onClose();
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
