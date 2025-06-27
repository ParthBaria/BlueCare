import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  FileText,
  Share2,
  ClipboardList,
  FlaskConical,
  Badge
} from 'lucide-react';

import doctorImage from '../../assets/default-doctor.png'; // Replace with your actual path

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-50 text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-sky-700">BlueCare</h1>
        <nav className="flex gap-6 items-center">
          <a href="#how-it-works" className="text-sm font-medium hover:text-sky-700">How it Works</a>
          <a href="#about" className="text-sm font-medium hover:text-sky-700">About</a>
          <a href="#blog" className="text-sm font-medium hover:text-sky-700">Blog</a>
          <button
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 py-16 bg-white">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Take Control of Your Health with Confidence
          </h2>
          <p className="text-gray-600 mb-6 text-base md:text-lg">
            Store and manage your health data securely. Access medical records, prescriptions,
            lab results, and appointments in one unified digital health card.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <button
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md font-medium"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-full max-w-md mx-auto rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 bg-sky-100 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">You Deserve Better Healthcare</h3>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          We help you take the guesswork out of your health decisions. Digital Health Cards
          give you quick, secure access to your vital health history — empowering you to
          make smarter choices with your doctors and care providers.
        </p>
        <button
          className="mt-6 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-md font-medium"
          onClick={() => navigate('/how-it-works')}
        >
          Learn More
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-white text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">About BlueCare</h3>
        <p className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed mb-12">
          BlueCare is on a mission to revolutionize personal healthcare by giving individuals control
          over their medical history and data. From digital prescriptions to appointment tracking and
          health analytics, our platform is built with security, accessibility, and convenience at its core.
        </p>

        {/* Functionality Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <div className="bg-sky-50 p-6 rounded-xl shadow-md text-left relative">
            <Badge className="w-6 h-6 text-sky-700 mb-2" />
            <h4 className="text-xl font-semibold text-sky-700 mb-2">Digital Health Card</h4>
            <p className="text-gray-600 text-sm">
              Access all your health records, prescriptions, and consultations in a unified digital format
              that's always available and secure.
            </p>
          </div>

          <div className="bg-sky-50 p-6 rounded-xl shadow-md text-left relative">
            <Stethoscope className="w-6 h-6 text-sky-700 mb-2" />
            <h4 className="text-xl font-semibold text-sky-700 mb-2">Doctor Consultations</h4>
            <p className="text-gray-600 text-sm">
              Schedule appointments and consult with verified doctors directly through the platform.
            </p>
          </div>

          <div className="bg-sky-50 p-6 rounded-xl shadow-md text-left relative">
            <FileText className="w-6 h-6 text-sky-700 mb-2" />
            <h4 className="text-xl font-semibold text-sky-700 mb-2">Medical History Tracker</h4>
            <p className="text-gray-600 text-sm">
              Keep track of your past medical reports, allergies, and diagnoses for informed decision-making.
            </p>
          </div>

          <div className="bg-sky-50 p-6 rounded-xl shadow-md text-left relative">
            <Share2 className="w-6 h-6 text-sky-700 mb-2" />
            <h4 className="text-xl font-semibold text-sky-700 mb-2">Secure Record Sharing</h4>
            <p className="text-gray-600 text-sm">
              Share specific health records with doctors or family members through permission-based access.
            </p>
          </div>

          <div className="bg-sky-50 p-6 rounded-xl shadow-md text-left relative">
            <ClipboardList className="w-6 h-6 text-sky-700 mb-2" />
            <h4 className="text-xl font-semibold text-sky-700 mb-2">Prescription Management</h4>
            <p className="text-gray-600 text-sm">
              View, download, and organize your doctor-issued prescriptions with dosage instructions.
            </p>
          </div>

          <div className="bg-sky-50 p-6 rounded-xl shadow-md text-left relative">
            <FlaskConical className="w-6 h-6 text-sky-700 mb-2" />
            <h4 className="text-xl font-semibold text-sky-700 mb-2">Lab Report Storage</h4>
            <p className="text-gray-600 text-sm">
              Upload and manage lab reports securely with quick previews and date-wise filtering.
            </p>
          </div>
        </div>

      </section>


      {/* Blog Section */}
      <section id="blog" className="py-16 px-6 bg-sky-100 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">From Our Blog</h3>
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Why Digital Health Records Matter</h4>
            <p className="text-sm text-gray-600">
              Discover how managing your health history digitally can reduce medical errors and
              improve continuity of care.
            </p>
            <button
              className="mt-4 text-sky-600 font-medium hover:underline"
              onClick={() => navigate('/blog/why-digital-health')}
            >
              Read More →
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">5 Tips for Smarter Doctor Visits</h4>
            <p className="text-sm text-gray-600">
              Learn how to prepare for appointments and ask the right questions using your digital health data.
            </p>
            <button
              className="mt-4 text-sky-600 font-medium hover:underline"
              onClick={() => navigate('/blog/smarter-doctor-visits')}
            >
              Read More →
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-2">BlueCare</h4>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} BlueCare. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#how-it-works" className="hover:text-sky-400">How It Works</a>
            <a href="#about" className="hover:text-sky-400">About</a>
            <a href="#blog" className="hover:text-sky-400">Blog</a>
            <a href="/privacy-policy" className="hover:text-sky-400">Privacy</a>
            <a href="/terms" className="hover:text-sky-400">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
