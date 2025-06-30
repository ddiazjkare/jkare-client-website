'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ───────────────────────── data ────────────────────────── */
const TAGLINES = [
  'Our delivering of home respiratory therapy and modern medical equipment is focused on one goal: better breathing.',
  "We deliver's high-quality respiratory therapy, advanced equipment, and essential medical supplies, bringing care and comfort to your home.",
  "We provide's specialized respiratory therapy, advanced equipment, and reliable medical supplies, enhancing lives one breath at a time.",
  'Empowering patients through exceptional home respiratory care, equipment, and medical supplies; ',
  'We are your partner in health.',
];

const WORDS = ['BREATH', 'MOMENT', 'HEARTBEAT', 'PATIENT'];

/* ───────────────────────── component ───────────────────── */
export default function HeroSection() {
  /* ---------- rotating tag-line state ---------- */
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setPrevIdx(idx);
      setIdx((i) => (i + 1) % TAGLINES.length);
      setTimeout(() => setPrevIdx(null), 800);
    }, 5000);
    return () => clearInterval(id);
  }, [idx]);

  /* ---------- typing word logic ---------- */
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = WORDS[wIdx];
    const TYPE = 180,
      ERASE = 110,
      HOLD = 1200;
    let delay = del ? ERASE : TYPE;
    if (!del && cIdx === word.length) delay = HOLD;

    const t = setTimeout(() => {
      if (!del) {
        if (cIdx < word.length) setCIdx((c) => c + 1);
        else setDel(true);
      } else {
        if (cIdx > 0) setCIdx((c) => c - 1);
        else {
          setDel(false);
          setWIdx((w) => (w + 1) % WORDS.length);
        }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [cIdx, del, wIdx]);

  const typed = WORDS[wIdx].slice(0, cIdx);

  /* ============ RENDER ============ */
  return (
    <>
      {/* ──────────────  MOBILE (<640 px) ────────────── */}
      <div className="sm:hidden font-montserrat">
        {/* hero image with bottom fade */}
        <div
          className="relative h-[32vh] mt-12 w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/hero+background+mobile.png')",
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>

        {/* text block */}
        <div className="px-6 py-8 text-center">
          {/* welcome */}
          <h1 className="text-2xl font-semibold">
            Welcome&nbsp;to&nbsp;
            <span className="text-customBlue">J</span>
            <span className="text-customPink">KARE!</span>
          </h1>

          {/* headline */}
          <h2 className="mt-4 md:text-[36px] text-[40px] font-extrabold leading-tight  tracking-tight uppercase text-gray-900">
            IN-HOME&nbsp;CARE
            <br />
            <p className='md:text-[48px] text-[52px] font-bold'>FOR&nbsp;EVERY</p>
          </h2>

          {/* dynamically-typed word */}
          <p className="md:text-[64px] text-[68px] font-bold leading-none text-customPink uppercase  ">
            {/* {typed} */}
            BREATH
          </p>

          {/* rotating tag-lines */}
          <div className="relative h-[78px] mt-4 overflow-hidden text-center">
            {prevIdx !== null && (
              <p className="tagline animate-slideUp text-center">{TAGLINES[prevIdx]}</p>
            )}
            <p key={idx} className="tagline animate-slideIn italic">
              {TAGLINES[idx]}
            </p>
          </div>

          {/* CTAs side-by-side */}
          <div className="mt-8 flex flex-row justify-center gap-4">
            <HeroBtn href="/contact-us">Contact&nbsp;Us</HeroBtn>
            <HeroBtn href="/product">Shop&nbsp;Now</HeroBtn>
          </div>
        </div>
      </div>

      {/* ──────────────  DESKTOP / TABLET (≥640 px) ────────────── */}
      <div className="hidden sm:block">
        <div
          className="relative flex h-[90vh]  w-full items-center justify-center sm:justify-start bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Hero+Banner.webp')",
              backgroundPositionY: 'top',
          }}
        >
          {/* bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/40 to-transparent" />

          {/* main content (unchanged) */}
          <div className="relative z-10 mx-auto lg:mt-60 sm:mt-0 max-w-3xl px-6 sm:mx-0 sm:px-10 lg:px-32 font-montserrat">
            {/* welcome */}
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">
              Welcome&nbsp;to&nbsp;
              <span className="text-customBlue">J</span>
              <span className="text-customPink">KARE!</span>
            </h1>

            {/* headline with typing */}
            <h2 className="mt-4 leading-[1.05] text-[36px] sm:text-[48px] md:text-[58px] lg:text-[62px] font-normal text-gray-900 tracking-tight">
              IN-HOME&nbsp;CARE <br />
              FOR&nbsp;EVERY
              <span className="block mt-4">
                <span className="text-customPink font-bold lg:text-[105px] border-r-2 border-customPink animate-cursor">
                  {typed}
                </span>
              </span>
            </h2>

            {/* rotating tag-lines */}
            <div className="relative h-[80px] mt-4 overflow-hidden">
              {prevIdx !== null && (
                <p className="tagline animate-slideUp">{TAGLINES[prevIdx]}</p>
              )}
              <p key={idx} className="tagline animate-slideIn italic">
                {TAGLINES[idx]}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <HeroBtn href="/contact-us">Contact&nbsp;Us</HeroBtn>
              <HeroBtn href="/product">Shop&nbsp;Now</HeroBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────  shared animation styles ────────────── */}
      <style jsx>{`
       .tagline {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;       
  justify-content: center; 
  font-size: 1rem;
  line-height: 1.4;
  font-weight: 500;
  color: #1f2937;
  text-align: center;        
}
@media (min-width: 640px) {
  .tagline {
    justify-content: start;  
    text-align: left;
  }
}

        .animate-slideIn {
          animation: slideIn 0.8s ease forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease forwards;
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px);
          }
        }
        .animate-cursor {
          animation: blink 0.9s steps(1) infinite;
        }
        @keyframes blink {
          0%,
          100% {
            border-color: transparent;
          }
          50% {
            border-color: var(--customPink);
          }
        }
      `}</style>
    </>
  );
}

/* ───────────────────────── helper CTA ───────────────────── */
function HeroBtn({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-full bg-customLightBlue px-10 py-3 sm:px-12 sm:py-4 text-lg md:text-xl font-semibold text-gray-900 bg-customBlue/20 hover:bg-customBlue/40 transition-colors"
    >
      {children}
    </Link>
  );
}
