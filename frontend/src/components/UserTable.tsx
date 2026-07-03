import type { SortField, SortOrder, User } from '../types/user';

interface UserTableProps {
  users: User[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  loading: boolean;
}

const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
];

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: SortField;
  sortBy: SortField;
  sortOrder: SortOrder;
}) {
  if (sortBy !== field) return <span className="text-slate-300">↕</span>;
  return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
}

export function UserTable({
  users,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  loading,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        No users found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COLUMNS.map(({ key, label }) => (
                <th key={key} className="px-4 py-3 font-semibold text-slate-700">
                  <button
                    onClick={() => onSort(key)}
                    className="inline-flex items-center gap-1 hover:text-blue-600"
                  >
                    {label}
                    <SortIcon field={key} sortBy={sortBy} sortOrder={sortOrder} />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-600">{user.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {user.firstName}
                </td>
                <td className="px-4 py-3 text-slate-700">{user.lastName}</td>
                <td className="px-4 py-3 text-slate-700">{user.email}</td>
                <td className="px-4 py-3 text-slate-700">{user.department}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-500">ID: {user.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(user)}
                  className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600">{user.email}</p>
            <p className="mt-1 text-sm text-slate-500">{user.department}</p>
          </div>
        ))}
      </div>
    </>
  );
}
