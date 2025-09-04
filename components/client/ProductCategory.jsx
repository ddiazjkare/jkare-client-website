'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const brands = [
  { name: 'ReactHealth', logo: 'https://www.reacthealth.com/images/logo.jpg' },
  { name: 'Fisher & Paykel Healthcare', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa-cLefRJBviWevw-tHOvGUyrUyrLQs4b-pelpY0BzwmSOJV4ntg&s=10&ec=72940545' },
  { name: 'ABM Respiratory Care', logo: 'https://abmrc.com/wp-content/uploads/2021/02/ABM-Logo-08.png' },
  { name: 'Percussionaire', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5kRz6HKcS3W6GHg0_9h2FpUVtGNNPJjZOTw&s' },
  { name: 'AffloVest', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeWQ-I6yTCCMLMlub13OcVid3xIMUzrMoksVWfYDcQ1A&s&ec=72940545' },
];

/* ---------- COMPONENT ---------- */
export default function ProductCategory({ categories = [] }) {
  /* --- determine how many logos fit on the screen --- */
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* --- carousel state --- */
  const [index, setIndex] = useState(0);
  const total = brands.length;
  const next = () => setIndex(i => (i + 1) % total);
  const prev = () => setIndex(i => (i - 1 + total) % total);

  /* --- slice visible brands --- */
  const visibleBrands = useMemo(() => {
    return Array.from({ length: Math.min(visibleCount, total) }, (_, k) => (
      brands[(index + k) % total]
    ));
  }, [index, visibleCount, total]);

  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#F3F9FF] to-white  lg:py-16 py-12 pt-0">
      {/* ---------- SHOP BY CATEGORY ---------- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8
                      grid lg:grid-cols-[300px_1fr] gap-4 lg:gap-6">

        {/* gradient sidebar / header */}
        <aside className="rounded-xl overflow-hidden shadow-lg">
          <div className="h-full bg-gradient-to-b from-[#702D6E] via-[#702D6E]/90 to-purple-200/90
                          p-6 sm:p-8 text-center lg:text-left">
            <h2 className="text-white text-xl sm:text-3xl font-light leading-snug mb-4 sm:mb-6">
              SHOP&nbsp;BY<br />CATEGORY
            </h2>
            {/* <p className="text-white text-sm sm:text-base leading-normal">
              Explore our advanced medical equipment collection, designed for precision and reliability.
              From diagnostic tools to therapeutic devices, ensure optimal patient care with our
              state-of-the-art solutions. Quality you can trust.
            </p> */}
            {/* <p className="text-white text-sm sm:text-base leading-normal">
              Find the Right Medical Equipment for Your Needs.
            </p> */}
          </div>
        </aside>

        {/* 2×2 grid (same at every breakpoint) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {categories.map(({ name, image }) => {
            // Fixed hrefs for each category name
            let href = "#";
            if (name === "Pap Devices") href = "/category/Pap%20Devices";
            else if (name === "CPAP Masks") href = "/category/CPAP%20Masks";
            else if (name === "Oxygen Concentrators") href = "/category/Oxygen%20Concentrators";
            else if (name === "Respiratory Therapy Devices") href = "/category/Respiratory%20Therapy%20Devices";

            return (
              <div
                key={name}
                className="flex flex-col items-center text-center
                 bg-[#EEF7FD] rounded-lg sm:rounded-xl shadow
                 px-3 sm:px-6 py-5 sm:py-6
                 hover:shadow-lg hover:bg-[#e0eefe] transition-all duration-200"
              >
                <img
                  src={image}
                  alt={name}
                  className="h-24 sm:h-36 w-auto object-contain mb-3 sm:mb-4"
                />
                <h3 className="text-[11px] sm:text-sm font-semibold uppercase
                     tracking-wide text-gray-900 mb-2 sm:mb-4">
                  {name}
                </h3>
                <Link
                  href={href}
                  className="inline-block rounded-full bg-customButton hover:bg-customButtonHover
                   text-[11px] sm:text-sm px-5 sm:px-8 py-2 sm:py-3
                   font-semibold text-gray-900 transition-colors shadow-sm"
                >
                  Shop&nbsp;All
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- SHOP BY BRAND ---------- */}
      <div className="mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8
                      flex flex-col gap-4 lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">

        {/* purple banner (always visible) */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-b from-[#702D6E] via-[#702D6E]/80 to-[#702D6E]/50
                          p-4 sm:p-6 text-center lg:text-left">
            <h3 className="text-white text-lg sm:text-3xl font-light leading-tight">
              SHOP&nbsp;BY<br />BRAND
            </h3>
          </div>
        </div>

        {/* carousel */}
        <div className="relative bg-white rounded-xl shadow-md
                        px-6 sm:px-12 py-6 sm:py-8">

          {/* chevrons */}
          <button aria-label="Previous brand"
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-gray-800">
            <FiChevronLeft size={20} />
          </button>
          <button aria-label="Next brand"
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-gray-800">
            <FiChevronRight size={20} />
          </button>

          <div className="flex gap-6 sm:gap-10 justify-center flex-wrap">
            {visibleBrands.map(({ name, logo }) => (
              <Link key={name}
                href={{ pathname: '/brands', query: { brand: btoa(name) } }}
                className="flex flex-col items-center justify-center shrink-0
                               cursor-pointer max-w-[180px]">
                <img src={logo}
                  alt={name}
                  className="h-10 sm:h-8 w-auto object-contain
                                hover:scale-105 transition-transform" />
                <span className="text-[12px] sm:text-xs text-gray-700
                                 mt-1 sm:mt-2 text-center leading-tight">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
