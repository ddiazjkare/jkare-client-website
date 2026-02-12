'use client';
import React from 'react';
import Link from 'next/link';
export default function TagLine({ services }) {
  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#fdf5ff] to-white lg:py-20 py-0">
      <div className="mx-auto max-w-7xl px-6 text-center">

        {/* -------------- headings ---------------- */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
          OUR&nbsp;SERVICES
        </h2>
        <h3 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
          {services?.title}
        </h3>
        <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-gray-600">
          {services?.content}
        </p>

        {/* -------------- card grid --------------- */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services?.cards?.map((card, index) => (
            <ServiceCard
              key={card._id}
              title={card.title}
              desc={card.content}
              href={index === services.cards.length - 1 ? "/product" : "/our-services"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
function ServiceCard({ title, desc, href }) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center justify-between text-center overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl">
      {/* decorative top gradient strip */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1
                       bg-gradient-to-r from-customPink to-customBlue" />
      {/* subtle radial glow on hover */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl
                       bg-[radial-gradient(circle_at_50%_120%,rgba(0,174,239,0.15)_0%,transparent_60%)]
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* card body */}
      <div className="relative z-10 px-8 py-10">
        <h4 className="text-customPurple text-lg sm:text-xl font-semibold mb-4">
          {title}
        </h4>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-10 line-clamp-6">
          {desc}
        </p>
        <span
          className="inline-block rounded-full bg-customLightBlue/80
                     px-10 py-3 font-semibold text-gray-900 transition-colors duration-200 group-hover:bg-customLightBlue">Know More
        </span>
      </div>
    </Link>
  );
}

