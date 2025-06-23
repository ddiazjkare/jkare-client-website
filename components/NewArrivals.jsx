"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

const SkeletonCard = () => (
  <article
    className="w-full sm:w-[320px] lg:w-[340px] bg-white rounded-xl shadow-xl animate-pulse"
  >
    <div className="relative border-b border-gray-100 p-6 flex items-center justify-center">
      <div className="h-48 w-full bg-gray-200 rounded-md" />
    </div>
    <div className="px-6 py-6 text-center">
      <div className="flex justify-center gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-6 w-2/3 mx-auto bg-gray-200 rounded mb-4" />
      <div className="h-5 w-1/3 mx-auto bg-gray-200 rounded" />
    </div>
  </article>
);

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const urls = [
        `/api/product/67e1389c121b72710a9d7576`,
        `/api/product/6842972db7792cde9b5e02f4`,
        `/api/product/67e1389c121b72710a9d7575`,
      ];
      const results = await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())));
      setProducts(results.map((r) => r.product));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="font-montserrat bg-gradient-to-b from-white via-customLightBlue/60 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          OUR&nbsp;BEST&nbsp;SELLERS
        </h2>
        {/* <p className="mt-6 max-w-5xl mx-auto text-md sm:text-lg lg:text-lg text-gray-700">
          Explore our advanced medical equipment collection, designed for
          precision and reliability. We have Diagnostic tools and
          instruments to ensure optimal patient care with our state‑of‑the‑art
          solutions. Quality you can trust.
        </p> */}
        <div className="relative mt-8">
          <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2">
            <FiChevronLeft size={42} className="text-gray-600" />
          </div>
          <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2">
            <FiChevronRight size={42} className="text-gray-600" />
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {loading
              ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              : products.map((p) => (
                <article
                  key={p._id}
                  className="w-full sm:w-[320px] lg:w-[340px] bg-white rounded-xl
                               shadow-xl hover:shadow-customPink/30
                               transition-transform duration-200 hover:-translate-y-1.5"
                >
                  <div className="relative border-b border-gray-100 p-6">
                    <img
                      src={p.prod_images[0]}
                      alt={p.prod_name}
                      className="h-48 w-full object-contain mx-auto"
                    />
                  </div>
                  <div className="px-6 py-6 text-center">
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