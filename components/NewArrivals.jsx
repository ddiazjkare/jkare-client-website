/* ------------------------------------------------------------------
   BestSellers.jsx
------------------------------------------------------------------- */

import React from 'react';
import Link from 'next/link';
import { FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

const NewArrivals = async () => {
  /* ---------- fetch three specific products ---------------------- */
  const urls = [
    `${process.env.NEXT_PUBLIC_API_URL}/product/67e1389c121b72710a9d756b`,
    `${process.env.NEXT_PUBLIC_API_URL}/product/67e1389c121b72710a9d756c`,
    `${process.env.NEXT_PUBLIC_API_URL}/product/67e1389c121b72710a9d756d`,
  ];

  const products = (
    await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())))
  ).map((r) => r.product); // adjust if your API shape differs

  /* --------------------------------------------------------------- */
  return (
    <section className="font-montserrat bg-gradient-to-b from-white via-customLightBlue/60 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 text-center">
        {/* --------------------------- heading ---------------------- */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          OUR&nbsp;BEST&nbsp;SELLERS
        </h2>
        <p className="mt-6 max-w-5xl mx-auto text-md sm:text-lg lg:text-lg text-gray-700">
          Explore our advanced medical equipment collection, designed for
          precision and reliability. From diagnostic tools to surgical
          instruments, ensure optimal patient care with our state‑of‑the‑art
          solutions. Quality you can trust.
        </p>

        {/* ------------------- chevrons + product cards ------------- */}
        <div className="relative mt-8">
          {/* decorative chevrons – wire them up to scrolling later */}
          <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2">
            <FiChevronLeft size={42} className="text-gray-600" />
          </div>
          <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2">
            <FiChevronRight size={42} className="text-gray-600" />
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {products.map((p) => (
              <article
                key={p._id}
                className="w-full sm:w-[320px] lg:w-[340px] bg-white rounded-xl
                           shadow-xl hover:shadow-customPink/30
                           transition-transform duration-200 hover:-translate-y-1.5"
              >
                {/* ---------- image box ---------------------------- */}
                <div className="relative border-b border-gray-100 p-6">
                  <img
                    src={p.prod_images[0]}
                    alt={p.prod_name}
                    className="h-48 w-full object-contain mx-auto"
                  />

                  {/* eye + count */}
                  {/* <span className="absolute bottom-4 right-4 flex items-center gap-1">
                    <span className="h-9 w-9 rounded-full bg-customPink flex
                                     items-center justify-center">
                      <FiEye className="text-white" size={18} />
                    </span>
                    <span className="text-xs font-medium text-gray-800">
                      1.2k
                    </span>
                  </span> */}
                </div>

                {/* ------------ details --------------------------- */}
                <div className="px-6 py-6 text-center">
                  {/* stars */}
                  <div className="flex justify-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <AiFillStar key={i} size={18} className="text-yellow-400" />
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {p.prod_name}
                  </h3>

                  <Link
                    href={`/product/${p._id}`}
                    className="inline-flex items-center gap-1 text-customBlue font-medium"
                  >
                    View&nbsp;Product
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
