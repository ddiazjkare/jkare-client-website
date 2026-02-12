import React from 'react';
import { RotateCcw, Heart, Shield, Wrench, AlertTriangle, Phone, Mail, Award, Stethoscope } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 mt-12 sm:mt-24">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Return Policy</h1>
            <div className="text-base sm:text-lg text-teal-600 font-semibold">JKARE</div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Commitment to Clinical Excellence</h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                At <span className="font-bold text-teal-600">JKARE</span>, our focus is on delivering clinical excellence, personalized care, and advanced respiratory solutions that improve lives. As a provider of specialized home respiratory therapy and medical equipment, each product is carefully selected and dispensed based on patient-specific requirements in collaboration with physicians and healthcare facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Statement */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Return Policy Statement</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 sm:p-6 rounded-r-lg">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
                Given the clinical nature of our products and in alignment with regulatory standards, we <strong>do not accept returns or exchanges</strong> once the equipment has been shipped or used.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Our Commitment to Your Satisfaction</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
              However, we are fully committed to your satisfaction and support in the following scenarios:
            </p>

            {/* Support Scenarios */}
            <div className="space-y-4 sm:space-y-6">
              {/* Warranty Support */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Product Under Warranty or Service Agreement</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      If your equipment is covered under warranty or an active maintenance agreement, we will provide necessary support, servicing, or replacement in accordance with the terms of that warranty or agreement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Defective Equipment */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-red-200">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="bg-red-100 p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Defective or Malfunctioning Equipment</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      In the rare event that a product is found to be defective upon delivery, please notify our support team <strong className="text-red-600">within 48 hours of receipt</strong>. We will evaluate the issue and take corrective action as per the manufacturer's warranty.
                    </p>
                  </div>
                </div>
              </div>

              {/* Clinical Compliance */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0 mx-auto sm:mx-0">
                    <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Clinical Compliance</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      As an <strong className="text-purple-600">ACHC-accredited provider</strong>, JKARE strictly adheres to clinical and safety standards. All maintenance or servicing will be carried out in accordance with evidence-based clinical guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Contact Our Support Team</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
              If you have any concerns about your equipment or require support under warranty or service coverage, please reach out to our team at:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                    <p className="text-lg sm:text-xl font-bold text-green-600">305 248 1003</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-lg sm:text-xl font-bold text-blue-600 break-all">support@jkare.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commitment Statement */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Promise to You</h2>
            </div>
          </div>
          <div className="p-8">
            <div className="text-center">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We are here to ensure your care continues uninterrupted—with safety, compassion, and trust.
              </p>
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-xl inline-block">
                <h3 className="text-2xl font-bold mb-2">JKARE</h3>
                <p className="text-lg font-medium opacity-90">Your Partner in Respiratory Wellness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;