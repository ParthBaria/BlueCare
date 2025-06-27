import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { prescriptionsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import FormComponent from '../../components/Layout/FormComponent';
import { Download, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DoctorSelector from '../../components/Helpers/Selector';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

const prescriptionFormFields = [
  { name: 'medicationName', label: 'Medication Name', type: 'text', placeholder: 'e.g. Paracetamol', validation: { required: 'Medication name is required' } },
  { name: 'dosage', label: 'Dosage', type: 'text', placeholder: 'e.g. 500mg', validation: { required: 'Dosage is required' } },
  { name: 'frequency', label: 'Frequency', type: 'text', placeholder: 'e.g. Twice a day', validation: { required: 'Frequency is required' } },
  { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 5 days', validation: { required: 'Duration is required' } },
  { name: 'instructions', label: 'Instructions', type: 'text', placeholder: 'Optional instructions...', validation: {} },
  { name: 'patientId', label: 'Patient Name', type: 'text', placeholder: 'Patient ID', validation: { required: 'Patient ID is required' } },
  { name: 'doctorId', label: 'Doctor Name', type: 'text', placeholder: 'Doctor ID', validation: { required: 'Doctor ID is required' } }
];

const Prescriptions = () => {
  const { user } = useAuthStore();
  const { createPrescription, getPrescriptions, deletePrescription, updatePrescription } = prescriptionsAPI;

  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [formDefaults, setFormDefaults] = useState({});
  const navigate = useNavigate();

  const fetchPrescriptions = async () => {
    try {
      const res = await getPrescriptions();
      setPrescriptions(res.data.prescriptions || []);
    } catch (err) {
      toast.error('Failed to fetch prescriptions');
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editMode) {
        await updatePrescription(editData._id, data);
        toast.success('Prescription updated');
      } else {
        await createPrescription(data);
        toast.success('Prescription created');
      }
      setShowForm(false);
      setEditMode(false);
      setEditData(null);
      setFormDefaults({});
      fetchPrescriptions();
      navigate('/doctor/prescriptions');
    } catch (err) {
      toast.error('Failed to save prescription');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrescription(id);
      toast.success('Deleted successfully');
      fetchPrescriptions();
    } catch (err) {
      toast.error('Delete failed');
    }
  };



  const downloadPrescription = (pres) => {
    const doc = new jsPDF();
    const height = doc.internal.pageSize.getHeight();

    // Rectangle Header
    const rectWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, rectWidth, 30, 'F');

    // "BlueCare" text inside the rectangle
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const headerText = 'BlueCare';
    const centerX = (rectWidth - doc.getTextWidth(headerText)) / 2;
    doc.text(headerText, centerX, 20);
    doc.setFontSize(9)
    doc.text('www.BlueCare.com', rectWidth - 60, 28)

    // Main content text style
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const doctor = [
      `Doctor:${pres.doctorId.fullName}`,
      `E-mail:${pres.doctorId.email}`,
      `Specialization:${pres.doctorId.specialization}`

    ];
    const patient = [
      `Patient:${pres.patientId.fullName}`,
      `E-mail:${pres.patientId.email}`,
      `dateOfBirth:${new Date(pres.patientId.dateOfBirth).toLocaleDateString()}`

    ];
    const lines = [
      `Date: ${new Date(pres.datePrescribed).toLocaleDateString()}`,
      `Medication: ${pres.medicationName || 'N/A'}`,
      `Dosage: ${pres.dosage || 'N/A'}`,
      `Frequency: ${pres.frequency || 'N/A'}`,
      `Duration: ${pres.duration || 'N/A'}`,
      `Instructions: ${pres.instructions || 'None'}`,
    ];

    let yPos = 40;
    patient.forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 10;
    })

    doc.line(10, yPos, rectWidth - 10, yPos);
    yPos += 10;

    doc.setFontSize(15);
    doc.text('Medication Details', 20, yPos);
    yPos += 10;

     doc.setFontSize(12);
    lines.forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 10;
    });


    doc.line(10, yPos, rectWidth - 10, yPos);
    yPos += 10;

    doctor.forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 10;
    })


    doc.text(`Dr.${pres.doctorId.fullName}`, rectWidth - 34, height - 30);
    doc.text(`${pres.doctorId.specialization}`, rectWidth - 35, height - 26);

    doc.line(0, height - 12, rectWidth, height - 12)
    doc.text('© 2025 BlueCare. All rights reserved.', 15, height - 10)
    doc.save(`Prescription_${new Date(pres.datePrescribed).toLocaleDateString()}.pdf`);
  };

  const startEdit = (data) => {
    setEditData(data);
    setEditMode(true);
    setFormDefaults(data);
    setShowForm(true);
  };

  const newRecord = (patientId) => {
    setFormDefaults({ doctorId: user._id, patientId });
    setShowForm(true);
    setShowSelector(false);
  };

  return (
    <>
      {!showForm && <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>
          {user.role === 'doctor' && (
            <button
              onClick={() => {
                setShowSelector(true);
                setShowForm(false);
                setEditMode(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create Prescription
            </button>
          )}
        </div>

        {/* DoctorSelector with animation */}
        <AnimatePresence>
          {showSelector && (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorSelector
                onSelect={(id) => newRecord(id)}
                onClose={() => setShowSelector(false)}
                role="patient"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* Prescription List with animation */}
          {!showForm && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {prescriptions.length === 0 ? (
                <div className="text-gray-500 text-center py-12">No prescriptions found.</div>
              ) : (
                prescriptions.map((pres, i) => (
                  <motion.div
                    key={pres._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white p-4 rounded-xl shadow relative"
                  >

                    <div className="absolute top-3 right-3 flex space-x-2">
                      {user.role === 'doctor' && (
                        <>
                          <button onClick={() => startEdit(pres)} className="text-blue-600 hover:text-blue-800" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(pres._id)} className="text-red-600 hover:text-red-800" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                      {user.role === 'patient' && (<button onClick={() => downloadPrescription(pres)} className="text-green-600 hover:text-green-800" title="Download">
                        <Download size={18} />
                      </button>)}
                    </div>

                    <div className="text-sm text-gray-600 mb-1">
                      Prescribed on: {new Date(pres.datePrescribed).toLocaleDateString()}
                    </div>
                    <p><strong>Medication:</strong> {pres.medicationName}</p>
                    <p><strong>Dosage:</strong> {pres.dosage}</p>
                    <p><strong>Frequency:</strong> {pres.frequency}</p>
                    <p><strong>Duration:</strong> {pres.duration}</p>
                    <p><strong>Instructions:</strong> {pres.instructions || 'None'}</p>
                    <p><strong>Doctor:</strong> {pres.doctorId.fullName}</p>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div >}
      <AnimatePresence mode='wait'>
        {/* Form View with animation */}
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <FormComponent
              title={editMode ? 'Edit Prescription' : 'Create Prescription'}
              subtitle={editMode ? 'Update the prescription details' : 'Enter a new prescription'}
              buttonText={editMode ? 'Update' : 'Create'}
              fields={prescriptionFormFields}
              onSubmit={handleSubmit}
              defaultValues={formDefaults}
            />
          </motion.div>
        )}
      </AnimatePresence >
    </>

  );
};

export default Prescriptions;
