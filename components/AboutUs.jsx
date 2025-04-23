'use client';
import Link from 'next/link';
export default function AboutUs() {
  return (
    <section className="font-montserrat bg-gradient-to-t from-white via-[#f9fafe] to-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center gap-16">

        {/* ──────────── TEXT BLOCK (left) ──────────── */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900">
            ABOUT&nbsp;US
          </h2>

          <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-snug">
            Compassionate Care for <br className="hidden sm:block" />
            Every&nbsp;Breath, Every&nbsp;Life
          </h3>

          <p className="mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 max-w-xl">
            We started our company in&nbsp;2010, intending to provide respiratory
            services to pediatric patients. We quickly saw a significant need for
            respiratory therapists to treat patients of all ages. Consequently,
            we expanded our practice and began operating under our DBA name,
            JKARE&nbsp;Miami. We aim to stand out for excellence in respiratory
            care services and products.
          </p>

          <Link
            href="/about-us"
            className="mt-10 inline-block rounded-full bg-customPink px-10 py-3
                       font-semibold text-white transition-colors duration-200
                       hover:bg-customBlue focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-offset-2
                       focus-visible:ring-customPink"
          >
            Learn&nbsp;More
          </Link>
        </div>

        {/* ──────────── IMAGE CARD (right) ──────────── */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            {/* optional decorative dots / plus background */}
            <img
              src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/plus+image.png"
              alt=""
              className="absolute -left-8 -top-8 w-32 opacity-20 select-none pointer-events-none hidden lg:block"
            />
            {/* foreground photo */}
            <img
              src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVpbGRpbmd8ZW58MHx8MHx8fDA%3D"
              alt="JKARE facility exterior"
              className="relative z-10 h-[340px] w-[440px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
