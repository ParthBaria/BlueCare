import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../../lib/api';
import defaultDoctorImg from '../../assets/default-doctor.png'; // Make sure this path is valid

const AllDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await usersAPI.getUsers({ role: 'doctor' });
                const data = res.data.users;
                setDoctors(data);
                setFilteredDoctors(data);
            } catch (err) {
                console.error('Error fetching doctors:', err);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        let filtered = doctors;

        if (specialization) {
            filtered = filtered.filter(doc =>
                doc.specialization?.toLowerCase().includes(specialization.toLowerCase())
            );
        }

        if (experience) {
            if (experience === '5+') {
                filtered = filtered.filter(doc =>
                    parseInt(doc.yearsOfExperience) >= 5
                );
            } else {
                filtered = filtered.filter(doc =>
                    parseInt(doc.yearsOfExperience) === parseInt(experience)
                );
            }

        }
        setFilteredDoctors(filtered);
    }, [specialization, experience, doctors]);

    return (
        <div className="p-6 min-h-screen bg-white">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Explore Doctors</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
                <input
                    type="text"
                    placeholder="Search by specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
                />
                <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
                >
                    <option value="">Filter by experience</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5+">5+ years</option>
                </select>
            </div>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredDoctors.map((doc) => (
                    <div
                        key={doc._id}
                        onClick={() => navigate(`/patient/doctors/${doc._id}`)}
                        className="bg-blue-50 border border-blue-100 rounded-2xl shadow hover:shadow-xl p-6 cursor-pointer transition transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={doc.photo || defaultDoctorImg}
                                alt={doc.fullName}
                                className="w-28 h-28 object-cover rounded-full border border-blue-300 mb-4"
                            />
                            <h3 className="text-xl font-bold text-blue-900">{doc.fullName}</h3>
                            <p className="text-sm text-blue-700">{doc.specialization}</p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Experience:</strong> {doc.yearsOfExperience || 'N/A'} years
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Email:</strong> {doc.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Phone:</strong> {doc.phone || 'N/A'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No doctors found with selected filters.</p>
            )}
        </div>
    );
};

export default AllDoctors;
