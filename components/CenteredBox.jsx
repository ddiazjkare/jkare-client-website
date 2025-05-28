'use client';
import React, { useState } from 'react';
import {
  FiHelpCircle,
  FiCreditCard,
  FiShield,
  FiUserCheck,
  FiChevronDown,
} from 'react-icons/fi';

/* ---------- DATA ---------- */
const FAQ_DATA = {
  general: {
    label: 'General Question',
    icon: FiHelpCircle,
    qa: [
      ["What's JKARE?", 'JKARE is a licensed and certified provider of respiratory care services and medical equipment.'],
      ['Are CPAP machines ventilators?', 'No. CPAP delivers constant airway pressure for sleep-apnea therapy, whereas a ventilator actively breathes for you.'],
      ['Will my machine be brand new?', 'Yes, every CPAP or BiPAP machine we ship is factory-new, never refurbished.'],
      ["I'm a new user, what do I need to buy?", 'Typically you need a CPAP device, a heated humidifier, a compatible mask, and replacement filters/tubing.'],
      ['Do I need to use CPAP all night, every night?', 'For best results you should use it whenever you sleep, including naps.'],
      ['What maintenance do CPAP machines require?', 'Wash the mask & tubing weekly, replace filters monthly, and schedule an annual inspection.'],
      ['Do I need a prescription to buy a CPAP?', 'Yes. FDA regulations require a valid prescription for PAP devices and masks.'],
      ['How long is the product warranty?', 'Most machines include a 2-year manufacturer warranty; extended coverage is available.'],
    ],
  },
  billing: {
    label: 'Payment & Billing',
    icon: FiCreditCard,
    qa: [
      ['Which payment methods do you accept?', 'We accept all major credit cards, HSA/FSA cards, and PayPal.'],
      ['Can I pay in installments?', 'Yes! We offer Affirm and Afterpay at checkout for qualified orders.'],
      ['Do you charge sales tax?', 'Sales tax is applied automatically based on your shipping address.'],
      ['Is there a financing fee?', 'No additional fees—only the cost shown by the financing provider during checkout.'],
      ['How do I get a copy of my invoice?', 'Log in to “My Account → Orders” and click “Download Invoice.”'],
    ],
  },
  safety: {
    label: 'Safety & Security',
    icon: FiShield,
    qa: [
      ['Is my personal data secure?', 'Absolutely. We use 256-bit SSL encryption and do not store payment details on our servers.'],
      ['Are your products FDA-approved?', 'All devices that require FDA clearance are sourced only from FDA-approved manufacturers.'],
      ['How do you ship fragile equipment?', 'We use custom foam inserts and double-boxed packaging to prevent damage.'],
      ['What happens if my package is lost?', 'Contact support within 10 days and we will file a claim and reship at no cost.'],
    ],
  },
  account: {
    label: 'Account & Update',
    icon: FiUserCheck,
    qa: [
      ['How do I reset my password?', 'Click “Forgot Password” on the login page and follow the emailed instructions.'],
      ['Can I update my prescription online?', 'Yes. Go to “My Account → Prescriptions” and upload a new PDF or photo.'],
      ['How do I change my shipping address?', 'Navigate to “My Account → Addresses” and edit or add a new address.'],
      ['How do I delete my account?', 'Please email privacy@jkare.com and our team will process the deletion within 48 hours.'],
    ],
  },
};

/* ---------- COLORS ---------- */
const activeBox =
  'bg-gradient-to-b from-[#7e3bf3] to-[#b63bd8] text-white shadow-lg';
const inactiveBox =
  'bg-[#F2F5F8] text-gray-500 hover:shadow-md transition-colors';

/* ---------- COMPONENT ---------- */
export default function FaqSection() {
  const [activeCat, setActiveCat] = useState('general');
  const [openIdx, setOpenIdx] = useState(null);
  const { qa } = FAQ_DATA[activeCat];
  const [fadeKey, setFadeKey] = useState(0);

  const switchCategory = (key) => {
    if (key === activeCat) return;
    setFadeKey((k) => k + 1);
    setOpenIdx(null);
    setActiveCat(key);
  };

  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#fdf5ff] to-white py-20 pt-0">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
          FAQ's
        </h2>

        {/* ---------- CATEGORY TABS ---------- */}
        <div
          className="mt-14 flex flex-nowrap justify-center gap-2 sm:gap-6
                     overflow-x-auto scrollbar-hide"
        >
          {Object.entries(FAQ_DATA).map(([key, { label, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => switchCategory(key)}
              className={`flex flex-col items-center
                          w-20 p-3 text-[10px]
                          sm:w-32 sm:p-6 sm:text-xs
                          rounded-2xl transition-all duration-300
                          ${activeCat === key ? activeBox : inactiveBox}`}
            >
              {/* smaller icon on phones, original on larger screens */}
              <Icon size={22} className="sm:hidden" />
              <Icon size={32} className="hidden sm:block" />
              <span className="mt-2 sm:mt-4 font-medium leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* ---------- ACCORDION ---------- */}
        <div
          key={fadeKey}
          className="mt-14 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto animate-fade-in"
        >
          {qa.map(([q, a], idx) => {
            const open = idx === openIdx;
            return (
              <div key={idx} className="border-b last:border-none">
                {/* question row */}
                <button
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-gray-800">{q}</span>
                  <FiChevronDown
                    size={20}
                    className={`text-customPink transition-transform duration-300 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* answer */}
                <div
                  style={{ maxHeight: open ? '200px' : '0px' }}
                  className="overflow-hidden transition-all duration-500 px-6"
                >
                  <p className="pb-6 text-sm sm:text-base text-gray-600 text-left">
                    {a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
