import React, { useEffect, useState } from 'react';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { appointmentsAPI, usersAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedToday: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const [patientsResult, todayApptResult, upcomingResult, completedResult] = await Promise.all([
        usersAPI.getDoctorPatients(user._id),
        appointmentsAPI.getAppointments({ date: today }),
        appointmentsAPI.getAppointments({ status: 'scheduled' }),
        appointmentsAPI.getAppointments({ date: today, status: 'completed' }),
      ]);

      setStats({
        totalPatients: patientsResult.data.patients?.length || 0,
        todayAppointments: todayApptResult.data.appointments?.length || 0,
        upcomingAppointments: upcomingResult.data.total || 0,
        completedToday: completedResult.data.total || 0,
      });

      setTodayAppointments(todayApptResult.data.appointments || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'My Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: FileText,
      color: 'bg-purple-500',
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
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. {user?.fullName}!</p>
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

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
        </div>
        <div className="p-6">
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientId?.fullName || 'Unknown Patient'}</p>
                    <p className="text-sm text-gray-600">{appointment.reason || 'Regular checkup'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.appointmentTime}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No appointments scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;