"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Shield, MessageCircle } from "lucide-react";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  isAdmin: boolean;
  createdAt: string;
  _count: { messages: number };
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json() as { users: UserRow[] };
    setUsers(data.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} registered students</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          placeholder="Search by name or email..."
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">{search ? "No matching users" : "No users yet"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">Email</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Messages</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Joined</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-lavender rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-purple text-xs font-bold">
                          {(u.name ?? u.email ?? "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800 truncate max-w-[120px]">
                        {u.name ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell truncate max-w-[180px]">
                    {u.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500">
                      <MessageCircle size={13} />
                      <span>{u._count.messages}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400 hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.isAdmin ? (
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                        <Shield size={10} /> Admin
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Student</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
