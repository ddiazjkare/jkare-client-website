'use client';

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
  { name: 'ResMed',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/ResMed_logo.svg/800px-ResMed_logo.svg.png' },
  { name: 'Rhythm',      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT07F7mfZp98yQZi4NpX7TJemK2oHVos7wPxg&s' },
  { name: 'F&P',         logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRm7A27QJxK1JAXhvJq7e_0Q_-vIjOvk6dxg&s' },
  { name: 'Sentec',      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5kRz6HKcS3W6GHg0_9h2FpUVtGNNPJjZOTw&s' },
];

export default function ShopByCategoryAndBrand() {
  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#F3F9FF] to-white py-16">

      {/* ========== SHOP BY CATEGORY ========== */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[300px_1fr] gap-8">

        {/* purple sidebar – now shown on all breakpoints */}
        <aside className="flex flex-col rounded-xl overflow-hidden shadow-lg">
          <div className="flex-1 bg-gradient-to-b from-purple-600 via-purple-400 to-purple-100 p-8 text-center lg:text-left">
            <h2 className="text-white text-3xl font-extrabold leading-snug mb-6">
              SHOP BY<br />CATEGORY
            </h2>
            <p className="text-white text-base">
              Explore our advanced medical equipment collection, designed for
              precision and reliability. From diagnostic tools to ensure optimal
              patient care with our state-of-the-art solutions. Quality you can
              trust.
            </p>
          </div>
        </aside>

        {/* category cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {categories.map(({ title, img, href }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center bg-[#EEF7FD] rounded-xl shadow-md px-6"
            >
              <img src={img} alt={title} className="h-36 w-auto object-contain mb-4" />
              <h3 className="text-md font-semibold uppercase tracking-wide text-gray-900 mb-4">
                {title}
              </h3>
              <Link
                href={href}
                className="inline-block rounded-full bg-[#DDF2FF] px-8 py-3 my-3 font-semibold text-gray-900 hover:bg-[#c9e8ff] transition-colors"
              >
                Shop&nbsp;All
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SHOP BY BRAND ========== */}
      <div className="mt-6 mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-[300px_1fr] gap-8 items-start">

        {/* purple label bar (still desktop-only) */}
        <div className="hidden lg:block">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-b from-purple-600 via-purple-400 to-purple-100 p-6">
              <h3 className="text-white text-3xl font-extrabold leading-tight">
                SHOP BY<br />BRAND
              </h3>
            </div>
          </div>
        </div>

        {/* static logo strip */}
        <div className="relative bg-white rounded-xl shadow-md px-16 py-8">
          <FiChevronLeft
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden
          />
          <FiChevronRight
            size={22}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden
          />

          <div className="flex gap-10 justify-center flex-wrap">
            {brands.map(({ name, logo }) => (
              <div key={name} className="flex flex-col items-center justify-center shrink-0">
                <img src={logo} alt={name} className="h-8 w-auto object-contain" />
                <span className="text-xs text-gray-700 mt-2">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
