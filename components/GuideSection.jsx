'use client';
import Image from 'next/image';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  GuidesSection – reusable, purely‑JSX version                       */
/* ------------------------------------------------------------------ */
export default function GuidesSection({ heroTitle, heroImage, guides }) {
  return (
    <div className="bg-white text-gray-800 font-montserrat">

      {/* HERO ---------------------------------------------------------- */}
      <div className="relative h-[420px] w-full">
        <Image src={heroImage} alt={heroTitle} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/40 font-montserrat" />
        <div className="absolute inset-0 grid place-items-center text-center">
          <h1 className="mx-4 max-w-6xl text-3xl sm:text-4xl md:text-5xl
                         font-bold tracking-wide text-white">
            {heroTitle}
          </h1>
        </div>
      </div>

      {/* GUIDE CARDS --------------------------------------------------- */}
      <section className="mx-auto max-w-6xl space-y-20 py-24 px-6 md:px-10">
        {guides.map((g, idx) => {
          const reverse = idx % 2 !== 0;                 // flip every other row
          return (
            <div
              key={g.id}
              className={`flex flex-col md:flex-row
                          ${reverse ? 'md:flex-row-reverse' : ''}
                          items-center gap-10`}
            >
              {/* IMAGE – fixed frame */}
              <div
                className="relative shrink-0
                           w-full md:w-[420px] lg:w-[480px]
                           h-[280px] md:h-[320px] lg:h-[360px]
                           rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={g.imgSrc || '/placeholder.jpg'}
                  alt={g.imgAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 480px"
                />
              </div>

              {/* TEXT + BUTTON */}
              <div className="w-full md:w-1/2 space-y-4 font-montserrat">
                <h2 className="text-customPink text-2xl sm:text-3xl font-medium ">
                  {g.title}
                </h2>
                <p className="text-base sm:text-lg">{g.blurb}</p>
                <Link
                  href={g.link}
                  className="inline-block rounded-full bg-customBlue/90 px-6 py-2
                             text-sm sm:text-base font-semibold text-white
                             hover:bg-customPink focus-visible:ring
                             focus-visible:ring-offset-2 focus-visible:ring-customPink"
                >
                  Learn&nbsp;More
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

