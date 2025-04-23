'use client';

import React, { useState, useEffect } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    rating: 4.5,
    text: 'Navigating the website was a breeze, and the checkout process was seamless. I appreciated the swift delivery and the top-notch quality of the equipment.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/testimonials/shivamchokha.jpg',
    name: 'SHIVAM AWASTHI',
    role: 'Front‑end Developer',
  },
  {
    rating: 4.9,
    text: 'The platform is user-friendly, making it easy to find what I needed. My order arrived promptly, and the quality exceeded my expectations.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/testimonials/akash.jpg',
    name: 'AKASH SHARMA',
    role: 'Lead Developer',
  },
  {
    rating: 4.8,
    text: 'I was impressed by the intuitive design of the site. The entire shopping experience was smooth, and the delivery was faster than anticipated.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/WhatsApp+Image+2024-10-25+at+10.38.41_488a5962.jpg',
    name: 'KASHISH SAINI',
    role: 'WordPress Developer',
  },
  {
    rating: 4.1,
    text: 'The products were delivered on schedule, and the quality is outstanding. It\'s reassuring to have a reliable source for medical supplies.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/testimonials/akshay.jpg',
    name: 'AKSHAY BAIRWA',
    role: 'UI/UX Designer',
  },
  {
    rating: 4.1,
    text: 'Timely delivery and exceptional product quality. This platform has become my go-to for dependable medical equipment.',
    imgSrc: 'https://hexerve.com/wp-content/uploads/2024/09/Untitled-design-25.png',
    name: 'Ajay Verma',
    role: 'Hexerve CEO',
  },
  {
    rating: 4.1,
    text: 'Received my order promptly, and the items were of high quality. Highly recommend this site for anyone in need of medical supplies.',
    imgSrc: 'https://hexerve.com/wp-content/uploads/2024/09/7.png',
    name: 'Atul Verma',
    role: 'Branch Manager',
  },
  
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
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
  const CARD_W = isMobile ? 320 : 350;           // width incl. gap
  const GAP    = isMobile ? 0   : 30;            // visual gap (px)

  return (
    <section className="py-20 font-montserrat bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* -------------- heading -------------- */}
        <header className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            TESTIMONIALS
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600 text-sm sm:text-base lg:text-lg">
            Discover how our top‑quality medical equipment has transformed lives. Hear
            firsthand experiences from our satisfied customers who trust us for their
            healthcare needs and unparalleled support.
          </p>
        </header>

        {/* -------------- carousel -------------- */}
        <div className="flex items-center justify-center gap-4">
          {/* left arrow */}
          <ArrowBtn onClick={prev} icon={<FaChevronLeft size={26} />} />

          {/* rail */}
          <div className="relative h-[420px] sm:h-[460px] w-[1100px] max-w-full overflow-hidden z-10">
            {testimonials.map((t, idx) => {
              const d      = offset(idx);           
              const xShift = d * (CARD_W + GAP);     
              const scale  = d === 0 ? 1.1 : 0.85;     
              const z      = 50 - Math.abs(d);        
              const hide   = Math.abs(d) > 2 && !isMobile;

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
                  {/* avatar */}
                  <img
                    src={t.imgSrc}
                    alt={t.name}
                    className="absolute -top-12 left-1/2 -translate-x-1/2
                               h-24 w-24 rounded-full ring-4 ring-white object-cover
                               shadow-lg"
                  />

                  {/* body */}
                  <div className="pt-16 pb-10 px-8 text-center overflow-hidden">
                    {/* stars */}
                    <div className="flex justify-center gap-0.5 text-amber-500 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>

                    <h4 className="text-lg font-bold mb-4">{t.name}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t.text}
                    </p>
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
