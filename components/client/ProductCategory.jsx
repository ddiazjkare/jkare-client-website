'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/* ---------- DATA ---------- */
const categories = [
  {
    title: 'Respiratory Therapy Devices',
    img: 'https://www.sentec.com/fileadmin/2023/07/Untitled-1.png',
    href: '/category/Respiratory%20Therapy%20Devices',
  },
  {
    title: 'Oxygen Concentrators',
    img: 'https://cdn.shopify.com/s/files/1/1840/5479/files/Oxlife_LIBERTY-portable-oxygen-concentrator_1200x.png?v=1684362278',
    href: '/category/Oxygen%20Concentrators',
  },
  {
    title: 'PAP Devices',
    img: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/luna-travelpap-auto-cpap-machine-removebg-preview.png',
    href: '/category/Pap%20Devices',
  },
  {
    title: 'CPAP Masks',
    img: 'https://resources.fphcare.com/content/evora-full-mask-front.png',
    href: '/category/CPAP%20Masks',
  },
];

const brands = [
  { name: 'ReactHealth', logo: 'https://www.reacthealth.com/images/logo.jpg' },
  { name: 'Fisher & Paykel Healthcare', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa-cLefRJBviWevw-tHOvGUyrUyrLQs4b-pelpY0BzwmSOJV4ntg&s=10&ec=72940545' },
  { name: 'ABM Respiratory Care', logo: 'https://abmrc.com/wp-content/uploads/2021/02/ABM-Logo-08.png' },
  { name: 'Percussionaire', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5kRz6HKcS3W6GHg0_9h2FpUVtGNNPJjZOTw&s' },
  { name: 'AffloVest', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeWQ-I6yTCCMLMlub13OcVid3xIMUzrMoksVWfYDcQ1A&s&ec=72940545' },
];

/* ---------- COMPONENT ---------- */
export default function ShopByCategoryAndBrand() {
  /* --- determine how many logos fit on the screen --- */
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    function updateCount() {
      if (window.innerWidth < 640)      setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else                               setVisibleCount(4);
    }
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  /* --- current start index of the strip --- */
  const [index, setIndex] = useState(0);
  const total = brands.length;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  /* --- slice out exactly N items, wrapping around --- */
  const visibleBrands = useMemo(() => {
    return Array.from({ length: Math.min(visibleCount, total) }, (_, k) => {
      return brands[(index + k) % total];
    });
  }, [index, visibleCount]);

  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#F3F9FF] to-white py-16">
      {/** ========== SHOP BY CATEGORY ========== */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[300px_1fr] gap-6">

        <aside className="flex flex-col rounded-xl overflow-hidden shadow-lg">
          <div className="flex-1 bg-gradient-to-b from-[#702D6E] via-[#702D6E] to-purple-100 p-8 text-center lg:text-left">
            <h2 className="text-white text-3xl font-light leading-snug mb-6">
              SHOP BY<br />CATEGORY
            </h2>
            <p className="text-white text-base">
              Explore our advanced medical equipment collection, designed for precision and reliability.
              From diagnostic tools to therapeutic devices, ensure optimal patient care with our
              state-of-the-art solutions. Quality you can trust.
            </p>
          </div>
        </aside>

        <div className="grid sm:grid-cols-2 gap-6">
          {categories.map(({ title, img, href }) => (
            <div key={title} className="flex flex-col items-center text-center bg-[#EEF7FD] rounded-xl shadow-md px-6">
              <img src={img} alt={title} className="h-36 w-auto object-contain mb-4" />
              <h3 className="text-md font-semibold uppercase tracking-wide text-gray-900 mb-4">
                {title}
              </h3>
              <Link
                href={href}
                className="inline-block rounded-full bg-customButton hover:bg-customButtonHover px-8 py-3 my-3 font-semibold text-gray-900  transition-colors"
              >
                Shop&nbsp;All
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/** ========== SHOP BY BRAND  (carousel) ========== */}
      <div className="mt-6 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[300px_1fr] gap-6 items-start">

        {/** purple sidebar label (desktop only) */}
        <div className="hidden lg:block">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-b from-[#702D6E] via-[#702D6E]/80 to-[#702D6E]/50 p-6">
              <h3 className="text-white text-3xl font-light leading-tight">
                SHOP BY<br />BRAND
              </h3>
            </div>
          </div>
        </div>

        {/** logo carousel */}
        <div className="relative bg-white rounded-xl shadow-md px-12 py-8 h-full">

          {/* chevrons */}
          <button
            aria-label="Previous brand"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            aria-label="Next brand"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            <FiChevronRight size={22} />
          </button>

          {/* visible logo strip */}
          <div className="flex gap-10 justify-center flex-wrap">
            {visibleBrands.map(({ name, logo }) => (
              <Link
                key={name}
                href={{ pathname: '/brands', query: { brand: window.btoa(name) } }}
                className="flex flex-col items-center justify-center shrink-0 cursor-pointer"
              >
                <img
                  src={logo}
                  alt={name}
                  className="h-6 w-auto object-contain hover:scale-105 transition-transform"
                />
                <span className="text-xs text-gray-700 mt-2">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
