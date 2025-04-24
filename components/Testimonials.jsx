'use client';

import React, { useState, useEffect } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  DATA (new sample reviews, no photos)                              */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    rating: 5,
    name: 'ANDREA HOLZMANN',
    text:
      'Jkare is helping me on my journey with the CPAP machine for almost 6 months now. I am very happy with their service. Joel is very efficient and kind. He solves all my problems and doubts related to the machine and its accessories.',
  },
  {
    rating: 4,
    name: 'Estefani',
    text:
      'Joel provided exceptional service by being attentive to my daughter’s needs, responding promptly to our inquiries and going the extra mile to ensure our satisfaction. Thank you!',
  },
  {
    rating: 5,
    name: 'Queen Isa', 
    
    text:
      'My mother has been with JKare for a year and they have assisted in so many ways. Joel offers excellent customer service and always helps me get supplies or answers for my mom. A big help!',
  },
  {
    rating: 5,
    name: 'Kim Decius',
    text:
      'Outstanding experience from start to finish. The staff made sure I understood my new CPAP equipment and followed up after delivery. Highly recommend JKare.',
  },
];
export default function Testimonials() {
  const total = testimonials.length;
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------- handle screen size ---------- */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ---------- navigation helpers ---------- */
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  /* map absolute idx → relative offset (−N … 0 … +N) */
  const offset = (idx) => {
    let d = idx - current;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  /* constants for transform math */
  const CARD_W = isMobile ? 320 : 350; // width incl. gap
  const GAP = isMobile ? 0 : 30; // visual gap (px)

  return (
    <section className="py-20 font-montserrat bg-gradient-to-t from-white via-customLightBlue/50 to-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* -------------- heading -------------- */}
        <header className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            TESTIMONIALS
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600 text-sm sm:text-base lg:text-lg">
            Hear firsthand experiences from our customers who trust JKare for
            their respiratory care and CPAP needs.
          </p>
        </header>

        {/* -------------- carousel -------------- */}
        <div className="flex items-center justify-center gap-4">
          {/* left arrow */}
          <ArrowBtn onClick={prev} icon={<FaChevronLeft size={26} />} />

          {/* rail */}
          <div className="relative h-[420px] sm:h-[460px] w-[1100px] max-w-full overflow-hidden z-10">
            {testimonials.map((t, idx) => {
              const d = offset(idx);
              const xShift = d * (CARD_W + GAP);
              const scale = d === 0 ? 1.1 : 0.85;
              const z = 50 - Math.abs(d);
              const hide = Math.abs(d) > 2 && !isMobile;

              /* initials if no photo */
              const initials = t.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase();

              return (
                <article
                  key={idx}
                  style={{
                    transform: `translateX(calc(-50% + ${xShift}px)) scale(${scale})`,
                    zIndex: z,
                    opacity: hide ? 0 : 1,
                    transition: 'transform 600ms ease, opacity 600ms ease',
                  }}
                  className="absolute inset-y-0 left-1/2 top-1/4  w-[320px] sm:w-[350px] h-[300px]
                             bg-[#F7F9FB] rounded-xl shadow-md flex flex-col "
                >
                  {/* avatar (initials) */}
                  <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2
                               h-24 w-24 rounded-full ring-4 ring-white
                               grid place-items-center bg-customPink
                               text-white text-3xl font-bold shadow-lg"
                  >
                    {initials}
                  </div>

                  {/* body */}
                  <div className="pt-16 pb-10 px-8 text-center overflow-hidden">
                    {/* stars */}
                    <div className="flex justify-center gap-0.5 text-amber-500 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          className={i + 1 <= Math.round(t.rating) ? '' : 'opacity-30'}
                        />
                      ))}
                    </div>

                    <h4 className="text-lg font-bold mb-4">{t.name}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{t.text}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* right arrow */}
          <ArrowBtn onClick={next} icon={<FaChevronRight size={26} />} />
        </div>
      </div>
    </section>
  );
}

/* ---------- arrow helper (keeps buttons centred & visible) ---------- */
function ArrowBtn({ onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="grid place-items-center h-12 w-12 rounded-full
                 bg-white shadow-md hover:bg-gray-50 transition-colors"
    >
      {icon}
    </button>
  );
}
