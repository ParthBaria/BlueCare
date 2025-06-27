import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const FormComponent = ({ fields, onSubmit, isLoading, title, subtitle, buttonText, defaultValues = {} }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  // For password confirmation logic (if needed)
  const watchPassword = watch('password');

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br  px-4 py-8">
      <div className='text-grey absolute top-0 left-0' onClick={() => { navigate(-1) }}>
        <ArrowLeft className="w-10 h-10 text-gray-700" />
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
          {fields.map((field) => {
            const show = !field.condition || field.condition(watch);
            if (!show) return null;

            const isDoctorId = field.name === 'doctorId' || field.name === 'patientId';
            const hasDoctorId = defaultValues?.doctorId || defaultValues?.patientId;

            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>

                {isDoctorId && hasDoctorId ? (
                  <>
                    <input
                      type="text"
                      value="Doctor already selected"
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <input
                      type="hidden"
                      {...register(field.name)}
                      value={defaultValues.doctorId ? defaultValues.doctorId : field.name === 'doctorId' ? "Doctor already selected": "Patient already selected"}
                    />
                  </>
                ) : field.type === 'select' ? (
                  <select
                    {...register(field.name, field.validation)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...register(field.name, {
                      ...field.validation,
                      validate:
                        field.name === 'confirmPassword'
                          ? (value) => value === watchPassword || 'Passwords do not match'
                          : undefined
                    })}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                )}

                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            );
          })}


          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium mt-6"
          >
            {isLoading ? 'Submitting...' : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
