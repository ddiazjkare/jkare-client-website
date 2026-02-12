'use client';
import React, { useState } from 'react';
import {
  FiHelpCircle,
  FiCreditCard,
  FiShield,
  FiUserCheck,
  FiChevronDown,
} from 'react-icons/fi';

// Map API category keys to labels and icons
const CATEGORY_MAP = {
  generalquestion: {
    label: 'General Question',
    icon: FiHelpCircle,
  },
  'payment&billing': {
    label: 'Payment & Billing',
    icon: FiCreditCard,
  },
  'safety&security': {
    label: 'Safety & Security',
    icon: FiShield,
  },
  'account&update': {
    label: 'Account & Update',
    icon: FiUserCheck,
  },
};

const activeBox =
  'bg-gradient-to-b from-[#7e3bf3] to-[#b63bd8] text-white shadow-lg';
const inactiveBox =
  'bg-[#F2F5F8] text-gray-500 hover:shadow-md transition-colors';

export default function FaqSection({ faqs = [] }) {
  // Transform API faqs array to an object for easier access
  const faqData = {};
  faqs.forEach((cat) => {
    const map = CATEGORY_MAP[cat.category];
    if (map) {
      faqData[cat.category] = {
        label: map.label,
        icon: map.icon,
        qa: cat.qna.map(q => [q.question, q.answer]),
      };
    }
  });

  // Default to first available category
  const categories = Object.keys(faqData);
  const [activeCat, setActiveCat] = useState(categories[0] || '');
  const [openIdx, setOpenIdx] = useState(null);
  const [fadeKey, setFadeKey] = useState(0);

  const switchCategory = (key) => {
    if (key === activeCat) return;
    setFadeKey((k) => k + 1);
    setOpenIdx(null);
    setActiveCat(key);
  };

  if (!categories.length) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">FAQ's</h2>
        <p className="mt-8 text-gray-500">No FAQs available at this time.</p>
      </section>
    );
  }

  const { qa, label, icon: Icon } = faqData[activeCat];

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
          {categories.map((key) => {
            const { label, icon: Icon } = faqData[key];
            return (
              <button
                key={key}
                onClick={() => switchCategory(key)}
                className={`flex flex-col items-center
                            w-20 p-3 text-[10px]
                            sm:w-32 sm:p-6 sm:text-xs
                            rounded-2xl transition-all duration-300
                            ${activeCat === key ? activeBox : inactiveBox}`}
              >
                <Icon size={22} className="sm:hidden" />
                <Icon size={32} className="hidden sm:block" />
                <span className="mt-2 sm:mt-4 font-medium leading-tight">
                  {label}
                </span>
              </button>
            );
          })}
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
                    className={`text-customPink transition-transform duration-300 ${open ? 'rotate-180' : ''
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