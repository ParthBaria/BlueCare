import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const STATUS_COLORS = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    scheduled: 'bg-blue-100 text-blue-700',
};

export const Appointment = ({ recentAppointments, handleAppointment, handleCancel, acceptAppointment }) => {
    const { user } = useAuthStore();
    const [filterStatus, setFilterStatus] = useState('');
    const [visibleCount, setVisibleCount] = useState(5);

    const filteredAppointments = recentAppointments.filter(app => {
        return filterStatus ? app.status === filterStatus : true;
    });

    const visibleAppointments = filteredAppointments.slice(0, visibleCount);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="relative p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                <div className="flex gap-4">
                    <select
                        onChange={(e) => setFilterStatus(e.target.value)}
                        value={filterStatus}
                        className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {user.role === 'patient' && (
                        <button onClick={() => handleAppointment("new")} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                            <Plus className="w-4 h-4" /> New
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {visibleAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {visibleAppointments.map((appointment) => (
                            <div
                                key={appointment._id}
                                className="flex justify-between items-start p-4 bg-gray-50 rounded-lg hover:shadow transition"
                                onClick={() => {
                                    if (appointment.status === 'scheduled') handleAppointment(appointment);
                                    else if (appointment.status === 'pending') acceptAppointment(appointment);
                                }}
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                                    </p>
                                    <p className="text-sm text-gray-600">{appointment.reason || 'Regular checkup'}</p>
                                    <p className="text-sm text-gray-500">
                                        {user.role === 'doctor'
                                            ? appointment.patientId?.fullName || 'Unknown'
                                            : `Dr. ${appointment.doctorId?.fullName || 'Unknown'}`}
                                    </p>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="font-medium text-gray-900">{appointment.appointmentTime}</p>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[appointment.status]}`}>
                                        {appointment.status}
                                    </span>
                                    {appointment.status === 'scheduled' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancel(appointment._id);
                                            }}
                                            className="block text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredAppointments.length > visibleCount && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 5)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Show More
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No appointments found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
