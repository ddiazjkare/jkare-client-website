'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      className="relative isolate text-white font-montserrat"
      style={{
        backgroundImage:
          "url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/footer+base+image+1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* purple veil */}
      <div className="absolute inset-0 bg-gradient-to-t from-customBaseBlue/70 via-[#9f3bb0]/50 to-customBlue/80 mix-blend-multiply" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 space-y-10">

        {/* ---------------- TOP STRIP ---------------- */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          {/* logo + tagline */}
          <div className="max-w-lg">
            <img
              src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
              alt="JKARE logo"
              className="w-36 mb-4"
            />
            <h3 className="text-lg font-semibold text-white/95">
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
            <h4 className="text-base font-semibold mb-2 text-center lg:text-left">
              SIGN UP FOR NEWSLETTER
            </h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500
                           text-sm focus:outline-none focus:ring-2 focus:ring-customPink"
              />
              <button
                type="submit"
                className="rounded-lg bg-customPink px-5 py-2 text-sm
                           font-semibold hover:bg-customBlue transition-colors"
              >
                Signup
              </button>
            </form>
          </div>
        </div>

        <hr className="border-white/20" />

        {/* ---------------- LINK GRID ---------------- */}
        <div className="grid gap-8 md:grid-cols-3 text-sm">
          {/* QUICK LINKS */}
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

          {/* SHOP & RESOURCES */}
          <Col
            title="Shop & Resources"
            links={[
              ['Shop All Products', '/shop'],
              ['Online Partnership', '/partnership'],
              ['Return Policy', '/return-policy'],
              ['Submit Prescription', '/submit-prescription'],
              ['Blogs', '/blogs'],
              ['Patient Resources', '/patient-resources'],
            ]}
          />

          {/* SERVICES + SOCIAL */}
          <div className="flex flex-col gap-6">
            <Col
              title="Services"
              links={[
                ['In‑home Clinical Respiratory Services', '#'],
                ['Medical Equipment & Supplies', '#'],
                ['Medical Oxygen & Supplies', '#'],
                ['Healthcare Recruitment Staffing', '#'],
              ]}
            />

            <div>
              <p className="font-semibold mb-2 text-customLightBlue">
                Follow Us
              </p>
              <div className="flex gap-3">
                {[
                  ['https://instagram.com', <FaInstagram size={20} />],
                  ['https://facebook.com', <FaFacebook size={20} />],
                  ['https://twitter.com', <FaTwitter size={20} />],
                ].map(([href, icon]) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-full
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

        {/* ---------------- BOTTOM ---------------- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 text-xs text-white/80">
          <span>© 2024 JKARE. All Rights Reserved.</span>
          <span className="space-x-2">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/cookie-policy" className="hover:text-white">
              Cookie Policy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- simple column helper ---------- */
function Col({ title, links }) {
  return (
    <ul className="space-y-1">
      <li className="font-extraBold mb-1 text-customLightBlue">{title}</li>
      {links.map(([label, href]) => (
        <li key={label}>
          <Link href={href} className="hover:text-customPink text-customLightBlue font-normal">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
