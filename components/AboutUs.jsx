'use client';
import Link from 'next/link';

export default function AboutUs({ aboutData }) {
  // Fallback for SSR or if prop is missing
  const about = aboutData || {
    title: "none",
    content:
      "none",
    visitURL: "/none",
  };

  // Split title after three words for line break
  const titleWords = about.title.split(' ');
  const firstLine = titleWords.slice(0, 3).join(' ');
  const secondLine = titleWords.slice(3).join(' ');

  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#f9fafe] to-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center gap-16">

        {/* ──────────── TEXT BLOCK (left) ──────────── */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900">
            ABOUT&nbsp;US
          </h2>

          <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-snug">
            {firstLine}
            <br />
            {secondLine}
          </h3>
          <p className="mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 max-w-xl">
            {about.content}
          </p>
          <Link
            href={about.visitURL || "/about-us"}
            className="mt-10 inline-block rounded-full bg-customButton px-10 py-3
               font-semibold text-black transition-colors duration-200
               hover:bg-customButtonHover focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-offset-2
               focus-visible:ring-customPink"
          >
            Learn&nbsp;More
          </Link>
        </div>

        {/* ──────────── IMAGE CARD (right) ──────────── */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative rounded-3xl overflow-hidden ">
            <img
              src="https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Compassionate+Care+for+Every+Breath%2C+Every+Life.webp"
              alt="JKARE facility exterior"
              className="relative z-10 h-[290px] w-[440px] object-contain "
            />
          </div>
        </div>
      </div>
    </section>
  );
}