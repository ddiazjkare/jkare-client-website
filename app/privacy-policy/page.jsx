import React from 'react';
import { Shield, Lock, Users, Eye, FileText, Phone, Mail, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We collect personal and non-personal information to provide and improve our services. This includes:
          </p>
          <div className="space-y-3 ml-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Personal Information:</strong> Name, address, phone number, email address, payment details, and other information you provide during registration, purchase, or inquiries.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Medical Information:</strong> When necessary, we may collect limited health-related information to fulfill prescriptions or deliver therapy-related equipment in compliance with healthcare standards.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, and time spent on our site.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700"><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your user experience and understand site usage.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "How We Use Your Information",
      icon: <Eye className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We use your information for the following purposes:
          </p>
          <div className="grid md:grid-cols-2 gap-3 ml-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">To process and fulfill orders</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">To respond to inquiries or customer support requests</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">To maintain prescription or warranty records in compliance with healthcare regulations</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">To improve our website functionality and user experience</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">To send updates, offers, and service-related communications</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">To comply with legal and regulatory obligations</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Sharing Your Information",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We do not sell your personal information. However, we may share it under the following circumstances:
          </p>
          <div className="space-y-3 ml-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">With trusted service providers and logistics partners to complete order fulfillment and deliveries</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">With healthcare providers or professionals, where required by law or for clinical coordination</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">With government or regulatory authorities, when required by applicable law</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">In connection with business transfers or acquisitions</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Data Security",
      icon: <Lock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. These include secure server infrastructure, encryption protocols, and regular compliance checks.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              However, no online platform can guarantee absolute security. We encourage you to take proper precautions when using our services.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Your Rights and Choices",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            You have the right to:
          </p>
          <div className="space-y-3 ml-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Access and review your personal information</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Request correction or deletion of your information</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Opt out of marketing communications at any time</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">Withdraw consent for non-essential data processing</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mt-4">
            To exercise any of these rights, please contact us at <span className="font-semibold text-blue-600">support@jkare.com</span>.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-10 sm:mt-24">
      {/* Header */}
      <div className="bg-white shadow-lg border-b ">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            {/* <div className="text-lg text-blue-600 font-semibold mb-2">JKARE</div> */}
            <p className="text-gray-600">Effective Date: 09-June-2025</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <p className="text-lg text-gray-700 leading-relaxed">
            At <span className="font-bold text-blue-600">JKARE</span>, we are committed to protecting your privacy and maintaining the trust you place in us. This Privacy Policy outlines how we collect, use, share, and protect your personal information when you interact with our website and eCommerce platform. By accessing or using our website (www.jkare.com), you agree to the terms of this Privacy Policy.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    {React.cloneElement(section.icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {section.id}. {section.title}
                  </h2>
                </div>
              </div>
              <div className="p-8">
                {section.content}
              </div>
            </div>
          ))}

          {/* Additional Sections */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">6. Children's Privacy</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed">
                We do not knowingly collect personal data from children under 13.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">7. Third-Party Links</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to external sites. We are not responsible for the privacy practices of those websites. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">8. Changes to This Policy</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed">
                JKARE reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with a revised effective date. Continued use of our website after such updates constitutes your acceptance of the revised policy.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">9. Contact Us</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                For questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">JKARE Customer Support</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-medium">305‑248‑1003</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-medium">support@jkare.com</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-medium">www.jkare.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;