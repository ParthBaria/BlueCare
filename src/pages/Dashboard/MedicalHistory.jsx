import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicalRecordsAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import Selector from '../../components/Helpers/Selector';
import FormComponent from '../../components/Layout/FormComponent';
import { useNavigate } from 'react-router-dom';
const medicalFormFields = [
    { name: 'visitDate', label: 'Visit Date', type: 'date', validation: { required: 'Visit date is required' }},
    { name: 'diagnosis', label: 'Diagnosis', type: 'text', placeholder: 'e.g. Fever, Infection', validation: { required: 'Diagnosis is required' }},
    { name: 'treatment', label: 'Treatment', type: 'text', placeholder: 'e.g. Paracetamol 500mg', validation: { required: 'Treatment is required' }},
    { name: 'symptoms', label: 'Symptoms', type: 'text', placeholder: 'e.g. Headache, sore throat', validation: {} },
    { name: 'notes', label: 'Doctor Notes', type: 'text', placeholder: 'Optional notes...', validation: {} },
    { name: 'vitalSigns.bloodPressure', label: 'Blood Pressure', type: 'text', placeholder: 'e.g. 120/80', validation: {} },
    { name: 'vitalSigns.temperature', label: 'Temperature (°C)', type: 'text', placeholder: 'e.g. 98.6', validation: {} },
    { name: 'vitalSigns.heartRate', label: 'Heart Rate (bpm)', type: 'text', placeholder: 'e.g. 72', validation: {} },
    { name: 'vitalSigns.weight', label: 'Weight (kg)', type: 'text', placeholder: 'e.g. 65', validation: {} },
    { name: 'doctorId', label: 'Doctor ID', type: 'text', placeholder: 'Doctor ID', validation: { required: 'Doctor ID is required' }},
    { name: 'patientId', label: 'Patient ID', type: 'text', placeholder: 'Patient ID', validation: { required: 'Patient ID is required' }},
];
const MedicalHistory = () => {
    const navigate = useNavigate();
    const { createRecord, getRecords } = medicalRecordsAPI;
    const { user } = useAuthStore();
    const [records, setRecords] = useState([]);
    const [recordData, setRecordData] = useState({});
    const [formPresent, setFromPresent] = useState(false);
    const [showSelector, setShowSelector] = useState(false);

    const fetchHistory = async () => {
        try {
            const res = await getRecords();
            const data = res.data.records || [];
            const filtered = data.filter((record) =>
                user.role === 'patient'
                    ? record.patientId?._id === user._id
                    : record.doctorId?._id === user._id
            );
            setRecords(filtered);
        } catch (error) {
            toast.error('Failed to fetch medical history');
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onSubmit = async (data) => {
        try {
            await createRecord(data);
            toast.success('Record added');
            navigate("/doctor");
        } catch (error) {
            toast.error('Error adding record');
        }
    };

    const newRecord = (id) => {
        setRecordData({ patientId: id, doctorId: user._id });
        setFromPresent(true);
        setShowSelector(false);
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {!formPresent && (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.4 }}
                        className="p-6 md:p-10 bg-gray-50 min-h-screen"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Medical History</h2>
                            {user.role === "doctor" && (
                                <button
                                    onClick={() => setShowSelector(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                                >
                                    + Add Medical Record
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {records.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center py-12 text-gray-500"
                                >
                                    No medical records found.
                                </motion.div>
                            ) : (
                                records.map((record, i) => (
                                    <motion.div
                                        key={record._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                        className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500 mb-3">
                                            <span><strong>Visit:</strong> {new Date(record.visitDate).toLocaleDateString()}</span>
                                            <span><strong>Doctor:</strong> {record.doctorId?.fullName || 'N/A'}</span>
                                        </div>
                                        <div className="text-gray-700 space-y-1 text-sm">
                                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                                            <p><strong>Treatment:</strong> {record.treatment}</p>
                                            <p><strong>Symptoms:</strong> {record.symptoms || '—'}</p>
                                            <p><strong>Notes:</strong> {record.notes || '—'}</p>
                                            <p className="pt-2 text-xs text-gray-500">
                                                <strong>Vitals:</strong> BP {record.vitalSigns?.bloodPressure || 'N/A'}, Temp {record.vitalSigns?.temperature || 'N/A'}°C,
                                                HR {record.vitalSigns?.heartRate || 'N/A'} bpm, Weight {record.vitalSigns?.weight || 'N/A'} kg
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {formPresent && user.role === "doctor" && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.4 }}
                    >
                        <FormComponent
                            title="Add Medical Record"
                            subtitle="Fill in the patient's medical details accurately"
                            buttonText="Save Record"
                            fields={medicalFormFields}
                            defaultValues={recordData}
                            onSubmit={onSubmit}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {showSelector && (
                <Selector
                    onSelect={(id) => newRecord(id)}
                    onClose={() => setShowSelector(false)}
                    role="patient"
                />
            )}
        </>
    );
};

export default MedicalHistory;
