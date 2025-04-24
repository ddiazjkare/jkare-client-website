'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

/* ---------------- small column helper ---------------- */
function Col({ title, links }) {
  return (
    <ul className="space-y-1">
      <li className="font-extraBold text-lg mb-1 text-white">{title}</li>
      {links.map(([label, href]) => (
        <li key={label}>
          <Link
            href={href}
            className="hover:text-customBlue text-white font-normal"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer
      className="relative isolate text-white font-montserrat "
      style={{
        backgroundImage:
          "url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/footer+base+image+1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* ===== top-edge white fade ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full
                   h-24 sm:h-32 bg-gradient-to-b from-white/95 to-transparent z-20"
      />

      {/* purple veil over the background image */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#8c409a] via-black/50 to-white " />

      <div className="relative z-30 mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* ---------- TOP STRIP ---------- */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          {/* logo + tagline */}
          <div className="max-w-lg">
            <img
              src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
              alt="JKARE logo"
              className="w-32 sm:w-36 mb-4"
            />
            <h3 className="text-base sm:text-lg font-semibold text-white/95">
              “Oxygen for Life, Care for&nbsp;You”
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
              Reflects <span className="font-semibold">JKARE’s</span> mission to
              provide vital oxygen services with compassionate, personalized
              care.
            </p>
          </div>

          {/* newsletter */}
          <div className="w-full lg:w-[380px]">
            <h4 className="text-sm sm:text-base font-semibold mb-2 text-center lg:text-left text-customBlue ">
              SIGN UP FOR NEWSLETTER
            </h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500
                           text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-customPink"
              />
              <button
                type="submit"
                className="rounded-lg bg-customPink px-4 sm:px-5 py-2 text-xs sm:text-sm
                           font-semibold hover:bg-customBlue transition-colors"
              >
                Signup
              </button>
            </form>
          </div>
        </div>

        <hr className="border-white/20" />

        {/* ---------- LINK GRID ---------- */}
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 text-xs sm:text-sm">
          <Col
            title="Quick Links"
            links={[
              ['Home', '/'],
              ['About Us', '/about-us'],
              ['Services', '/services'],
              ['Contact', '/contact'],
              ['Employment', '/employment'],
              ['Community', '/community'],
            ]}
          />

          <Col
            title="Shop & Resources"
            links={[
              ['Shop All Products', '/product'],
              ['Online Partnership', '/'],
              ['Return Policy', '/'],
              ['Submit Prescription', '/'],
              ['Blogs', '/blog'],
              ['Patient Resources', '/Safety&Emergency'],
            ]}
          />

          {/* Services + socials grouped */}
          <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
            <Col
              title="Services"
              links={[
                ['In-home Clinical Respiratory Services', '/our-services'],
                ['Medical Equipment & Supplies', '/our-services'],
                ['Medical Oxygen & Supplies', '/our-services'],
                ['Healthcare Recruitment Staffing', '/our-services'],
              ]}
            />

            <div>
              <p className="font-semibold mb-2 text-customLightBlue">
                Follow Us
              </p>
              <div className="flex gap-3">
                {[
                  ['https://www.instagram.com/jkaremiami/', <FaInstagram size={18} />],
                  ['https://www.facebook.com/JKAREMiami',  <FaFacebook  size={18} />],
                  ['https://www.linkedin.com/company/jkaremiami/',   <FaLinkedin   size={18} />],
                ].map(([href, icon]) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-8 w-8 place-items-center rounded-full
                               border border-white/40 hover:bg-customPink
                               transition-colors"
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 text-[12px] sm:text-xs text-white/80">
          <span>© 2024 JKARE. All Rights Reserved.</span>
          <span className="space-x-2">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden> | </span>
            <Link href="/cookie-policy" className="hover:text-white">
              Cookie Policy
            </Link>
            <span aria-hidden> | </span>
            <Link href="https://hexerve.com/" className="hover:text-white">
              Design and Developed by : Hexerve Solutions
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
