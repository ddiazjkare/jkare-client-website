import React from 'react';

const RecruitmentStaffingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-customBlue mb-4 text-center">
          Join Our Team
        </h1>
        <p className="text-gray-700 text-lg mb-6 text-center">
          At <span className="font-semibold text-customPink">JKARE</span>, we are always looking for passionate and dedicated <span className="font-semibold">Respiratory Therapists</span> to join our growing team.
        </p>
        <p className="text-gray-700 text-base mb-4 text-center">
          If you’re committed to providing high-quality patient care and want to be part of a supportive, patient-focused organization, we’d love to hear from you.
        </p>
        <div className="bg-blue-50 border-l-4 border-customPink p-4 rounded mb-6 text-center">
          <span className="block text-gray-800 font-medium">
            To explore current opportunities or express your interest, please email your resume to:
          </span>
          <a
            href="mailto:s.garcia@jkare.org"
            className="text-customPink font-semibold underline break-all"
          >
            s.garcia@jkare.org
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentStaffingPage;