'use client';

import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const USERS_PER_PAGE = 5;

export default function AdminUsers() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/user')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch(() => {
                setUsers([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const res = await fetch(`/api/user/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
            setUsers((prev) => prev.filter((u) => u._id !== id));
            fetchUsers();
        }
    };

    const filteredUsers =
        roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    return (
        <div className="p-6 mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin: Manage Users</h1>
                <button
                    onClick={() => router.push('/admin/users/create')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" /> Create User
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <label className="mr-2 font-medium">Filter by role:</label>
                <select
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border rounded px-3 py-1"
                >
                    <option value="all">All</option>
                    <option value="admin">Admins</option>
                    <option value="reader">Readers</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Avatar</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Bio</th>
                                <th className="p-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user._id} className="border-t">
                                    <td className="p-2">
                                        {user.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                N/A
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2 capitalize">{user.role}</td>
                                    <td className="p-2">{user.bio || '-'}</td>
                                    <td className="p-2 text-right">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="inline w-4 h-4" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center gap-2 text-sm">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-100'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
