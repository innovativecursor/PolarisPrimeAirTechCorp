import { useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

export default function UserDirectory() {
  const { users, fetchUsers, updateUserRole, error, loading } = useSettings();

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-7 mb-32">
      {/* Header */}
      <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between justify-center md:gap-0 gap-6">
        <div className="flex items-center md:items-start flex-col md:w-fit w-full">
          <h3 className="text-lg font-semibold text-slate-900">
            User Directory
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Complete list of all registered users
          </p>
        </div>

        <div className="text-base md:w-fit w-full text-center text-slate-500 border border-stone-300 shadow px-8 py-1 rounded-full">
          <span className="font-semibold text-slate-900">{users.length}</span>{" "}
          users
        </div>
      </div>

      {/* Table */}
      <div className="md:overflow-hidden overflow-auto cursor-pointer rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-6 py-4 text-left font-medium text-slate-600">
                User
              </th>
              <th className="px-6 py-4 text-left font-medium text-slate-600">
                Role
              </th>
              <th className="px-6 py-4 text-center font-medium text-slate-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => {
              const isPending = u.status === "pending";

              return (
                <tr
                  key={u._id}
                  className={`
                    border-b last:border-b-0
                    transition-colors
                    hover:bg-slate-50
                    ${isPending ? "bg-yellow-50/40" : ""}
                  `}
                >
                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {u.email.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {u.role ?? "N/A"}
                    </span>
                  </td>

                  {/* Status + Action */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize
                          ${
                            u.status === "active"
                              ? "bg-green-100 text-green-700"
                              : u.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full
                            ${
                              u.status === "active"
                                ? "bg-green-600"
                                : u.status === "pending"
                                ? "bg-yellow-600"
                                : "bg-slate-600"
                            }`}
                        />
                        {u.status}
                      </span>

                      {/* Deactivate */}
                      {u.status === "active" && (
                        <button
                          onClick={async () => {
                            try {
                              await updateUserRole({
                                userId: u._id,
                                action: "deactivate",
                              });
                            } catch {}
                          }}
                          disabled={loading}
                          className="rounded-md border border-red-200 px-3 py-1 text-[11px] font-medium text-red-600
                                     hover:bg-red-50 disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-16 text-center text-sm text-slate-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
