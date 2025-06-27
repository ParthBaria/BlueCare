import React, { useEffect, useState } from 'react';
import { Calendar, FileText, Pill, User } from 'lucide-react';

import { appointmentsAPI, medicalRecordsAPI, prescriptionsAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Appointment } from '../../components/Layout/Appointment';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    medicalRecords: 0,
    lastVisit: null,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const [upcomingResult, prescriptionsResult, recordsResult, recentApptResult] = await Promise.all([
        appointmentsAPI.getAppointments({ status: 'scheduled' }),
        prescriptionsAPI.getPrescriptions({ isActive: true }),
        medicalRecordsAPI.getRecords({}),
        appointmentsAPI.getAppointments({ limit: 5 }),
      ]);

      const completedAppointments = recentApptResult.data.appointments?.filter(apt => apt.status === 'completed') || [];
      const lastVisit = completedAppointments.length > 0 ? completedAppointments[0].appointmentDate : null;

      setStats({
        upcomingAppointments: upcomingResult.data.total || 0,
        activePrescriptions: prescriptionsResult.data.total || 0,
        medicalRecords: recordsResult.data.total || 0,
        lastVisit,
      });

      setRecentAppointments(recentApptResult.data.appointments || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Prescriptions',
      value: stats.activePrescriptions,
      icon: Pill,
      color: 'bg-green-500',
    },
    {
      title: 'Medical Records',
      value: stats.medicalRecords,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Days Since Last Visit',
      value: stats.lastVisit
        ? Math.floor((new Date().getTime() - new Date(stats.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
        : '-',
      icon: User,
      color: 'bg-orange-500',
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments */}

      <Appointment recentAppointments={recentAppointments} />
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors" onClick={() => { navigate('/patient/appointments') }}>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <div className="font-medium text-gray-900">Book Appointment</div>
              <div className="text-sm text-gray-600">Schedule your next visit</div>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors" onClick={() => { navigate('/patient/history') }} >
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <div className="font-medium text-gray-900">View Records</div>
              <div className="text-sm text-gray-600">Access your medical history</div>
            </button>
            <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors" onClick={() => { navigate('/patient/medications') }}>
              <Pill className="h-8 w-8 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900">Medications</div>
              <div className="text-sm text-gray-600">View prescriptions</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;