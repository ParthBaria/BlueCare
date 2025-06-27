import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI, appointmentsAPI } from '../../lib/api';
import { Star, MapPin } from 'lucide-react';
import defaultDoctorImg from '../../assets/default-doctor.png';
import FormComponent from '../../components/Layout/FormComponent';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const demoReviews = [
    {
        name: 'Aarav Shah',
        comment: 'Dr. John was incredibly kind and professional. He really took the time to explain everything.',
    },
    {
        name: 'Meera Iyer',
        comment: 'Helped me with my daughter’s fever. Clear diagnosis and quick relief. Highly recommended!',
    },
    {
        name: 'Raj Verma',
        comment: 'Great experience. Appointment was on time and the doctor is very knowledgeable.',
    },
    {
        name: 'Sneha Kulkarni',
        comment: 'Very caring and patient. Listened to all my concerns and provided a clear plan.',
    },
    {
        name: 'Aditya Mehta',
        comment: 'Polite and professional. Made me feel comfortable during the consultation.',
    },
];


const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchDoctorAndReviews = async () => {
            try {
                const doctorRes = await usersAPI.getUserById(id);
                setDoctor(doctorRes.data.user);
                console.log(doctorRes.data.user)
                setReviews(demoReviews); 
            } catch (err) {
                console.error('Failed to load doctor or reviews:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorAndReviews();
    }, [id]);

    const appointmentFormFields = [
        {
            name: 'doctorId',
            label: 'Doctor ID',
            type: 'text',
            placeholder: 'Doctor ID',
            validation: { required: 'Doctor ID is required' },
            defaultValue: id,
            disabled: true,
        },
        {
            name: 'appointmentDate',
            label: 'Appointment Date',
            type: 'date',
            placeholder: 'Select a date',
            validation: { required: 'Appointment date is required' },
        },
        {
            name: 'appointmentTime',
            label: 'Appointment Time',
            type: 'time',
            placeholder: 'Select a time',
            validation: { required: 'Appointment time is required' },
        },
        {
            name: 'reason',
            label: 'Reason for Visit',
            type: 'text',
            placeholder: 'e.g., Cold, Fever',
            validation: { required: 'Reason is required' },
        },
    ];

    const handleSubmit = async (formData) => {
        try {
            const res = await appointmentsAPI.createAppointment(formData);
            toast.success('Appointment booked successfully!');
            navigate(`/${user?.role || 'patient'}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to create appointment');
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
    if (!doctor) return <div className="text-center py-10 text-red-500">Doctor not found.</div>;

    const {
        fullName,
        specialization,
        experience = doctor.yearsOfExperience,
        location = 'Not specified',
        bio = 'No bio available.',
        photo,
        stats = {
            livesSaved: 256,
            peopleHelped: 955714,
            doctorAgrees: 714,
        },
    } = doctor;

    return (
        <>
            {/* Form to Make Appointment */}
            {showForm && (
                <FormComponent
                    fields={appointmentFormFields}
                    onSubmit={handleSubmit}
                    title="Book an Appointment"
                    buttonText="Confirm Appointment"
                    defaultValues={{ doctorId: id }}
                />
            )}

            {!showForm && <div className="max-w-5xl mx-auto p-6">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center relative">
                    <div className="absolute top-4 right-4 text-sm text-gray-400">⭐ {experience}+ yrs</div>

                    <img
                        src={photo || defaultDoctorImg}
                        alt={fullName}
                        className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">{fullName}</h2>
                    <p className="text-sm text-gray-500 mt-1">{specialization}</p>
                    <p className="flex items-center text-gray-400 mt-1 text-sm">
                        <MapPin size={14} className="mr-1" />
                        {location}
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                        ))}
                    </div>

                    <div className="mt-4 flex gap-4">
                        <button
                            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full shadow transition"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Close Form' : 'Make Appointment'}
                        </button>
                    </div>
                </div>



                {/* Doctor Info and Stats */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">A Little About Me</h3>
                        <p className="text-gray-600 text-sm">{bio}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">My Answers and Insights Have:</h3>
                        <ul className="text-sm text-gray-700 space-y-2 mt-2">
                            <li>✅ Trusted by patients across the country</li>
                            <li>✅ Providing care with compassion and excellence</li>
                            <li>✅ Endorsed by experienced medical professionals</li>
                        </ul>
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-white mt-8 p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Patient Reviews</h3>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {reviews.map((review, idx) => (
                                <li key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                                    <p className="text-xs text-gray-500 mt-2 text-right">– {review.name}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>}
        </>
    );
};

export default DoctorProfile;
