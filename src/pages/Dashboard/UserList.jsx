import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { User, Trash2, Search, X, AlertTriangle } from 'lucide-react';

const roleBadgeColors = {
    doctor: 'bg-green-100 text-green-700',
    patient: 'bg-purple-100 text-purple-700',
    admin: 'bg-yellow-100 text-yellow-700'
};

const UserList = () => {
    const { user } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        try {
            let res, data;
            if (user.role === 'admin') {
                res = await usersAPI.getUsers();
                data = res.data.users.filter(u => u.role !== 'admin');
            } else {
                res = await usersAPI.getDoctorPatients(user._id);
                data = res.data.patients;
            }

            setUsers(data || []);
            setFilteredUsers(data || []);
        } catch (error) {
            toast.error('Failed to load users');
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await usersAPI.deleteUser(selectedUser._id);
            toast.success('User deleted successfully');
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error('Error deleting user');
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        const filtered = users.filter((user) =>
            user.fullName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">User Directory</h2>

            <div className="mb-6 relative w-full md:w-1/2">
                <Search className="absolute left-3 top-2.5 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by full name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {filteredUsers.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition duration-300 border border-gray-200 flex flex-col justify-between"
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 capitalize">{user.fullName}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-700 space-y-1 mb-3">
                                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                                <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeColors[user.role]}`}>
                                    {user.role}
                                </span>
                            </div>

                            {user.role !== 'admin' && (
                                <button
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setShowModal(true);
                                    }}
                                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium mt-auto"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            <X />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-red-500" />
                            <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedUser.fullName}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
