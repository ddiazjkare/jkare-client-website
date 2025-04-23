'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
    img: 'https://www.directhomemedical.com/cart/graphics/00000001/3/luna-travelpap-auto-cpap-machine.jpg',
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
  { name: 'ResMed',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/ResMed_logo.svg/800px-ResMed_logo.svg.png' },
  { name: 'Rhythm',      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT07F7mfZp98yQZi4NpX7TJemK2oHVos7wPxg&s' },
  { name: 'F&P',         logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRm7A27QJxK1JAXhvJq7e_0Q_-vIjOvk6dxg&s' },
  { name: 'Sentec',      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5kRz6HKcS3W6GHg0_9h2FpUVtGNNPJjZOTw&s' },
];

export default function ShopByCategoryAndBrand() {
  const railRef = useRef(null);
  const looped = [...brands, ...brands];
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    requestAnimationFrame(() => {
      rail.scrollLeft = rail.scrollWidth / 2 - rail.clientWidth;
    });
  }, []);
  const scrollByOne = () => {
    const rail = railRef.current;
    if (!rail) return 0;
    const firstCard = rail.querySelector('[data-card]');
    return firstCard ? firstCard.offsetWidth + 40 /* gap-10 */ : 200;
  };

  const handleScroll = (dir) => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({ left: dir * scrollByOne(), behavior: 'smooth' });
  };

  const reCenterIfNeeded = () => {
    const rail = railRef.current;
    if (!rail) return;
    const half = rail.scrollWidth / 2;
    if (rail.scrollLeft < half * 0.25) {
      rail.scrollLeft += half;
    } else if (rail.scrollLeft > half * 1.75) {
      rail.scrollLeft -= half;
    }
  };

  /* ------------------- component markup ----------------------- */
  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#F3F9FF] to-white py-16">
      {/* ========== SHOP BY CATEGOR ========== */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[300px_1fr] gap-8">
        {/* purple sidebar */}
        <aside className="hidden lg:flex flex-col rounded-xl overflow-hidden shadow-lg">
          <div className="flex-1 bg-gradient-to-b from-customBlue via-customBaseBlue to-white p-8">
            <h2 className="text-white text-3xl font-extrabold leading-snug mb-6">
              SHOP BY<br />CATEGORY
            </h2>
            <p className="text-white text-base">
              Explore our advanced medical equipment collection, designed for
              precision and reliability. From diagnostic tools to ensure optimal
              patient care with our state‑of‑the‑art solutions. Quality you can
              trust.
            </p>
          </div>
        </aside>

        {/* 2×2 cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {categories.map(({ title, img, href }) => (
            <div key={title} className="flex flex-col items-center text-center bg-[#EEF7FD] rounded-xl shadow-md px-6 py-4">
              <img src={img} alt={title} className="h-36 w-auto object-contain mb-4" />
              <h3 className="text-md font-semibold uppercase tracking-wide text-gray-900 mb-4">
                {title}
              </h3>
              <Link href={href} className="inline-block rounded-full bg-[#DDF2FF] px-8 py-3 font-semibold text-gray-900 hover:bg-[#c9e8ff] transition-colors">
                Shop&nbsp;All
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SHOP BY BRAND ========== */}
      <div className="mt-20 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[300px_1fr] gap-8 items-start">

        {/* purple label bar */}
        <div className="hidden lg:block">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-b from-customBlue to-customBaseBlue  p-6">
              <h3 className="text-white text-3xl font-extrabold leading-tight">
                SHOP BY<br />BRAND
              </h3>
            </div>
          </div>
        </div>

        {/* carousel rail */}
        <div className="relative bg-white rounded-xl shadow-md px-16 py-10 overflow-hidden overflow-x-hidden">
          {/* chevrons */}
          <button onClick={() => handleScroll(-1)} aria-label="left" className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border hover:bg-gray-100">
            <FiChevronLeft size={22} />
          </button>
          <button onClick={() => handleScroll(1)} aria-label="right" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border hover:bg-gray-100">
            <FiChevronRight size={22} />
          </button>

          {/* logo strip */}
          <div
            ref={railRef}
            onScroll={reCenterIfNeeded}
            className="flex gap-10 overflow-x-scroll no-scrollbar scroll-smooth"
          >
            {looped.map((b, idx) => (
              <div key={`${b.name}-${idx}`} data-card className="flex flex-col items-center shrink-0">
                <img src={b.logo} alt={b.name} className="h-12 w-auto object-contain" />
                <span className="text-xs text-gray-700 mt-2">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




