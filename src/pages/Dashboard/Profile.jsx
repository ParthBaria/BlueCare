import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import FormComponent from '../../components/Layout/FormComponent';
import toast from 'react-hot-toast';
import { usersAPI } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const getProfileFieldsByRole = (user) => {
  const baseFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name', validation: { required: 'Full name is required' } },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', validation: { required: 'Email is required' } },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Phone number' },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Address' },
  ];

  if (user.role === 'doctor') {
    return [
      ...baseFields,
      { name: 'specialization', label: 'Specialization', type: 'text', placeholder: 'e.g. Cardiologist', validation: { required: 'Specialization is required' } },
      { name: 'licenseNumber', label: 'License Number', type: 'text', placeholder: 'License #', validation: { required: 'License number is required' } },
      { name: 'yearsOfExperience', label: 'Years of Experience', type: 'text', placeholder: 'e.g. 5' },
      { name: 'bio', label: 'Bio', type: 'text', placeholder: 'e.g. i am cadiologyst' },
    ];
  }

  if (user.role === 'patient') {
    return [
      ...baseFields,
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
          { label: 'Select Gender', value: '' },
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ],
      },
      { name: 'emergencyContact', label: 'Emergency Contact', type: 'text', placeholder: 'Emergency number' },
    ];
  }

  return baseFields;
};

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fields = getProfileFieldsByRole(user);

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const res = await usersAPI.updateUser(user._id, formData);
      setUser(res.data.user);
      setUserData(res.data.user);
      toast.success('Profile updated!');
      setEditMode(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <motion.h2
        className="text-3xl font-semibold text-blue-800 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        My Profile
      </motion.h2>

      <AnimatePresence mode="wait">
        {!editMode ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-blue-100 p-6 rounded-xl shadow-sm max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 gap-4 text-gray-700">
              <ProfileField label="Full Name" value={userData.fullName} />
              <ProfileField label="Email" value={userData.email} />
              <ProfileField label="Phone" value={userData.phone || '—'} />
              <ProfileField label="Address" value={userData.address || '—'} />

              {user.role === 'doctor' && (
                <>
                  <ProfileField label="Specialization" value={userData.specialization} />
                  <ProfileField label="License #" value={userData.licenseNumber} />
                  <ProfileField label="Experience" value={`${userData.yearsOfExperience || '—'} yrs`} />
                  <ProfileField label="Bio" value={`${userData.bio || 'none'} `} />
                </>
              )}

              {user.role === 'patient' && (
                <>
                  <ProfileField label="DOB" value={userData.dateOfBirth?.slice(0, 10)} />
                  <ProfileField label="Gender" value={userData.gender} />
                  <ProfileField label="Emergency Contact" value={userData.emergencyContact} />
                </>
              )}

              <ProfileField label="Role" value={userData.role} />
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="mt-6 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Edit Profile
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FormComponent
              title="Edit Profile"
              subtitle="Update your profile information"
              buttonText="Save Changes"
              fields={fields}
              onSubmit={onSubmit}
              isLoading={isLoading}
              defaultValues={user}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <span className="text-base text-gray-900">{value}</span>
  </div>
);

export default Profile;
