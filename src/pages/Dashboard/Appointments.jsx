import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore';
import { Appointment } from '../../components/Layout/Appointment'
import { appointmentsAPI } from '../../lib/api';
import FormComponent from '../../components/Layout/FormComponent';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import Selector from '../../components/Helpers/Selector';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CodeSquare } from 'lucide-react';
const appointmentFormFields = [
    {
        name: 'doctorId',
        label: 'Doctor ID',
        type: 'text',
        placeholder: 'Enter Doctor ID',
        validation: {
            required: 'Doctor ID is required',
        },
    },
    {
        name: 'appointmentDate',
        label: 'Appointment Date',
        type: 'date',
        placeholder: 'Select a date',
        validation: {
            required: 'Appointment date is required',
        },
    },
    {
        name: 'appointmentTime',
        label: 'Appointment Time',
        type: 'time',
        placeholder: 'Select a time',
        validation: {
            required: 'Appointment time is required',
        },
    },
    {
        name: 'reason',
        label: 'Reason for Visit',
        type: 'text',
        placeholder: 'e.g., Cold, Fever',
        validation: {
            required: 'Reason is required',
        },
    },
];
const Appointments = () => {
    const navigate = useNavigate();
    const { createAppointment, updateAppointment } = appointmentsAPI;
    const { user } = useAuthStore();
    const [FormPresent, setFromPresent] = useState(false);
    const [showSelector, setShowSelector] = useState(false);
    const [status, setStatus] = useState(null);
    const [appointmentData, setAppointmentData] = useState({})
    const [recentAppointments, setRecentAppointments] = useState([]);

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [])

    const fetchAppointments = async () => {
        if (!user) return;

        const recentApptResult = await appointmentsAPI.getAppointments({ limit: 5 });
        setRecentAppointments(recentApptResult.data.appointments || []);
    }



    const handleSubmit = async (data) => {
        console.log(data)
        try {
            if (status === "new") {
                const res = await createAppointment(data);
                console.log(res)
                console.log(res)
            } else if (status === "update") {
                const res = await updateAppointment(data.id, data);
                console.log(res)

            }

            navigate("/patient");

        } catch (error) {
            console.error("Error submitting form:", error);
        }

    }
    const handleAppointment = async (data) => {
        if (data == "new") {
            setShowSelector(true);
        } else {
            const newData = {
                id: data._id,
                doctorId: data.doctorId._id,
                appointmentDate: data.appointmentDate.split('T')[0],
                appointmentTime: data.appointmentTime,
                reason: data.reason
            }

            setStatus("update");
            setAppointmentData(newData);
            setFromPresent(true);
        }
    }

    const newAppointment = async (data) => {
        setStatus("new");
        setAppointmentData({ doctorId: data });
        setFromPresent(true);
    }

    const handleCancel = async (Id) => {
        try {
            await appointmentsAPI.cancelAppointment(Id);
            toast.success("appointment cancelled")
            navigate(`/${user.role}`)
        } catch (error) {
            toast.error('cancellation failed')
        }
    }

    const acceptAppointment = async (appointment) => {
        const res = window.confirm("Did you want to accept Appointment");
        if (res) {
            const newAppointment = { ...appointment, status: "scheduled" }
            await appointmentsAPI.updateAppointment(appointment._id, newAppointment)
            toast.success("apoointment accepted");
            const updatedAppointments = recentAppointments.map(appointment =>
                appointment._id === newAppointment._id ? { ...appointment, ...newAppointment } : appointment
            );
            setRecentAppointments(updatedAppointments)
        }
    }
    return (
        <>
            {FormPresent && <FormComponent fields={appointmentFormFields} onSubmit={handleSubmit} title={"Appointment"} buttonText={status === "new" ? "Make Appointment" : "update Appointment"} defaultValues={appointmentData} />}
            {!FormPresent && <Appointment recentAppointments={recentAppointments} handleAppointment={handleAppointment} handleCancel={handleCancel} acceptAppointment={acceptAppointment} />}
            {showSelector && (
                <Selector
                    onSelect={(id) => newAppointment(id)}
                    onClose={() => setShowSelector(false)}
                    role={'doctor'}
                />
            )}
        </>
    )
}

export default Appointments