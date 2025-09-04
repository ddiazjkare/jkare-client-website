'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------- helper: one column of links ---------- */
function Col({ title, links }) {
  return (
    <ul className="space-y-1 text-center sm:text-left">
      <li className="font-medium text-[22px] md:text-lg mb-1 text-cyan-300 sm:text-white">
        {title}
      </li>

      {links.map(([label, href]) => (
        <li key={label}>
          <Link
            href={href}
            className="text-[14px] sm:text-base font-normal text-white hover:text-customBlue"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch('https://qjcsu9oco5.execute-api.ap-south-1.amazonaws.com/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed!');
        setIsSubscribed(true);
        setEmail('');
      } else {
        toast.error(data.message || 'Email Already Subscribed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <footer
        className="relative isolate text-white font-montserrat"
        style={{
          backgroundImage:
            "url('https://s3.ap-south-1.amazonaws.com/jkare.data/footer+image.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
  


        {/* top white fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-full h-20 sm:h-32
                   bg-gradient-to-b from-white/95 to-transparent z-20"
        />

        {/* purple veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#461f4d] via-[#632a6d]/80 to-white" />

        <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-4">
          {/* ---------- TOP STRIP ---------- */}
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            {/* logo + tagline */}
            <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <img
                src="https://s3.ap-south-1.amazonaws.com/jkare.data/jkarelogo.png"
                alt="JKARE logo"
                className="w-36 sm:w-36 mx-auto lg:mx-0 mb-2"
              />
            </div>

            {/* newsletter */}
            <div className="w-full max-w-[420px] mx-auto lg:mx-0">
              <h4 className="text-[14px] sm:text-base font-semibold mb-2 text-center lg:text-left text-black">
                SIGNUP FOR NEWSLETTER
              </h4>

              <form
                onSubmit={handleSubscribe}
                className="flex overflow-hidden rounded-full shadow-lg"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email ID"
                  disabled={isSubscribing || isSubscribed}
                  className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none disabled:bg-gray-200 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isSubscribing || isSubscribed}
                  className="bg-pink-500 text-white px-6 py-2 text-sm font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <FaSpinner className="animate-spin" size={14} />
                      Subscribing...
                    </>
                  ) : isSubscribed ? (
                    'Subscribed!'
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            </div>

          </div>

          <hr className="border-white/20" />

          {/* ---------- LINK BLOCK (mobile-centered) ---------- */}
          <div
            className="grid md:grid-cols-3 gap-10 sm:gap-8
                     justify-items-center sm:justify-items-start
                     text-[13px] sm:text-sm"
          >
            <Col
              title="Quick Links"
              links={[
                // ['Home', '/'],
                ['About Us', '/about-us'],
                ['Services', '/our-services'],
                ['Contact', '/contact-us'],
                ['Privacy Policy', '/privacy-policy'],
                ['Return Policy', '/return-policy'],
              ]}
            />

            <Col
              title="Shop & Resources"
              links={[
                ['Shop All Products', '/product'],
                ['News & Media', '/news-media'],
                // ['Submit Prescription', '/'],
                ['Patient Resources', '/Safety&Emergency'],
                ['Blogs', '/blog'],
              ]}
            />

            {/* Services & socials */}
            <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
              <Col
                title="Services"
                links={[
                  ['Clinical Respiratory Services', '/our-services'],
                  ['Medical Equipment and Supplies', '/our-services'],
                  // ['Medical Oxygen and Supplies', '/our-services'],
                  ['Health Care Services Pool', '/Recruitment-Staffing'],
                ]}
              />

              {/* hide socials on phones to match mock-up */}
              <div className="sm:block">
                <p className="hidden sm:block font-semibold mb-2 text-white">Follow Us</p>
                <div className="flex justify-center sm:justify-start gap-3">
                  {[
                    ['https://www.instagram.com/jkaremiami/', <FaInstagram key="ig" size={18} />],
                    ['https://www.facebook.com/JKAREMiami', <FaFacebook key="fb" size={18} />],
                    ['https://www.linkedin.com/company/jkaremiami/', <FaLinkedin key="li" size={18} />],
                  ].map(([href, icon]) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-8 w-8 place-items-center rounded-full
                   border border-white/40 hover:bg-customPink transition-colors"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
          <hr className="border-white/20" />
          {/* ---------- BOTTOM LINE ---------- */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3
                         text-[12px] sm:text-xs text-white/80 text-center sm:text-left">
            <span>© 2024 JKARE. All Rights Reserved.</span>
            <span className="space-x-2">
              <span aria-hidden> | </span>
              <Link href="https://hexerve.com/" className="hover:text-white">
                Designed and Developed by Hexerve Solutions
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}