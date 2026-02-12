'use client';

import Image from 'next/image';
import Link  from 'next/link';
import { motion } from 'framer-motion';
export default function BlogPage({
  heroTitle,
  heroImage,
  topPosts,
  latestPosts,
}) {
  return (
    <div className="bg-white text-gray-800 font-montserrat">

      {/* HERO -------------------------------------------------------- */}
      <header className="relative h-[380px] sm:h-[420px] md:h-[480px] w-full">
        <Image
          src={heroImage}
          alt={heroTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 grid place-items-center">
          <h1 className="mx-4 max-w-5xl text-center text-4xl md:text-5xl
                         font-bold tracking-wide text-white">
            {heroTitle}
          </h1>
        </div>
      </header>

      {/* TOP ARTICLES ------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-20 space-y-12">
        <header className="space-y-2">
          <h2 className="text-customPink text-3xl sm:text-4xl font-extrabold">
            Our Top Articles
          </h2>
          <p className="max-w-2xl text-gray-600">
            Carefully curated picks our readers loved the most this month.
          </p>
        </header>

        {/* 1 → 3-col responsive grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {topPosts.map((post, idx) => (
            <ArticleCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      </section>

      {/* LATEST ARTICLES ------------------------------------------- */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 py-20 space-y-12">
          <h2 className="text-customPurple text-3xl sm:text-4xl font-extrabold">
            Latest Articles
          </h2>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
const cardVariants = {
  offscreen: { opacity: 0, y: 60 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0.25, duration: 0.8 },
  },
};

function ArticleCard({ post, className = '', highlight = true }) {
  const imgContainer =
    highlight
      ? 'relative w-full h-64 shrink-0'
      : 'relative w-full h-64 shrink-0';

  return (
    <motion.article
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.25 }}
      variants={cardVariants}
      className={`relative overflow-hidden rounded-3xl h-full flex flex-col
                  bg-white shadow-lg ring-1 ring-black/5
                  transition transform-gpu
                  hover:-translate-y-2 hover:shadow-2xl
                  hover:ring-customPurple/40
                  group ${className}`}
    >
      {/* IMAGE ---------------------------------------------------- */}
      <div className={imgContainer}>
        <Image
          src={post.imgSrc}
          alt={post.imgAlt}
          fill
          sizes={highlight ? '(max-width:1024px) 100vw, 50vw' : '100vw'}
          className="object-cover
                     transition-transform duration-500
                     group-hover:scale-110"
        />

        {/* overlay now scales WITH the image */}
        <div
          className="absolute inset-0
                     bg-gradient-to-t from-black/70 via-black/20 to-transparent
                     transition-transform duration-500
                     group-hover:scale-110"
        />

        {/* category pill – stays fixed top-left */}
        {post.category && (
          <span
            className="absolute top-4 left-4 z-10
                       inline-block rounded-full bg-white/90 px-3 py-1
                       text-xs font-semibold tracking-wide text-gray-800
                       backdrop-blur-sm"
          >
            {post.category}
          </span>
        )}
      </div>

      {/* TEXT ----------------------------------------------------- */}
      <div className="flex flex-col flex-1 gap-4 p-6 md:p-8">
        {(post.date || post.readingTime) && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs
                          text-gray-500 uppercase tracking-wide">
            {post.date && (
              <time dateTime={post.date}>
                {new Intl.DateTimeFormat('en', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                }).format(new Date(post.date))}
              </time>
            )}
            {post.readingTime && <span>• {post.readingTime}</span>}
          </div>
        )}

        <h3 className="text-xl font-extrabold leading-snug">{post.title}</h3>

        <p className="text-sm text-gray-700 line-clamp-4">{post.excerpt}</p>

        <Link
          href={post.href}
          className="mt-auto inline-flex items-center gap-2 self-start
                     rounded-full bg-customBlue px-6 py-2
                     text-sm font-semibold text-white
                     transition-colors
                     hover:bg-customPink/90 focus-visible:ring
                     focus-visible:ring-offset-2 focus-visible:ring-customPPink"
        >
          Read&nbsp;More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 stroke-[3]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-6-6 6 6-6 6"
            />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}
