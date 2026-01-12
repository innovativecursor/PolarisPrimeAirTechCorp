import { useEffect, useState } from "react";
import { Select, message } from "antd";
import { useSettings } from "../hooks/useSettings";

export default function AccessControl() {
  const { users, roles, fetchUsers, fetchRoles, updateUserRole, error } =
    useSettings();

  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({});

  useEffect(() => {
    void fetchUsers();
    void fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const pendingUsers = users.filter((u) => u.status === "pending");

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between justify-center md:gap-0 gap-6">
        <div className="flex items-center md:items-start flex-col md:w-fit w-full">
          <h3 className="text-lg font-semibold text-slate-900">
            Access Control
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage pending user access
          </p>
        </div>

        <div className="text-base md:w-fit w-full text-center text-slate-500 border border-stone-300 shadow px-8 py-1 rounded-full">
          <span className="font-semibold text-slate-900">
            {pendingUsers.length}
          </span>{" "}
          pending
        </div>
      </div>

      <div className="space-y-4">
        {pendingUsers.map((user) => (
          <div
            key={user._id}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-sm"
          >
            <div className="flex flex-col gap-5 md:flex-row items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-700">
                  {user.email.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    {user.email}
                  </span>
                  <span className="mt-0.5 inline-flex w-fit rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                    Pending approval
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Select
                  placeholder="Assign role"
                  className="w-44"
                  onChange={(val) =>
                    setSelectedRole((prev) => ({
                      ...prev,
                      [user._id]: val,
                    }))
                  }
                  options={roles.map((r) => ({
                    label: r.name,
                    value: r._id,
                  }))}
                />

                <button
                  disabled={!selectedRole[user._id]}
                  onClick={async () => {
                    try {
                      await updateUserRole({
                        userId: user._id,
                        roleId: selectedRole[user._id],
                        action: "approve",
                      });
                      message.success("User approved");
                    } catch {}
                  }}
                  className="rounded-xl cursor-pointer bg-slate-900 px-4 py-2 text-sm font-semibold text-white
                             hover:bg-slate-800 disabled:opacity-50"
                >
                  Approve
                </button>

                <button
                  onClick={async () => {
                    try {
                      await updateUserRole({
                        userId: user._id,
                        action: "reject",
                      });
                      message.success("User rejected");
                    } catch {}
                  }}
                  className="rounded-xl cursor-pointer border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600
                             hover:bg-slate-100"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {pendingUsers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
            <p className="text-sm text-slate-400">No users awaiting approval</p>
          </div>
        )}
      </div>
    </div>
  );
}
