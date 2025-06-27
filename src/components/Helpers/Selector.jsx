import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../lib/api';

const Selector = ({ onSelect, onClose, role }) => {
    const { getUsers } = usersAPI;
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await getUsers({ role: role });
                const data = res.data.users;
                setDoctors(data);
                setFilteredDoctors(data);
            } catch (err) {
                console.error('Error fetching doctors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        setFilteredDoctors(
            doctors.filter((doctor) =>
                doctor.fullName.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, doctors]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Select a {role}</h2>

                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="max-h-72 overflow-y-auto space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : filteredDoctors.length === 0 ? (
                        <p className="text-center text-gray-400">No {role}s found.</p>
                    ) : (
                        filteredDoctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                onClick={() => {
                                    onSelect(doctor._id);
                                    onClose();
                                }}
                                className="cursor-pointer px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:bg-blue-50 transition flex flex-col"
                            >
                                <span className="text-lg font-medium text-gray-800">
                                    {doctor.fullName}
                                </span>
                                {doctor.specialization && (
                                    <span className="text-sm text-gray-500">
                                        {doctor.specialization}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Selector;
