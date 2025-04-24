import BlogPage from '../../components/client/BlogPage';

/* ---------------------------- TOP POSTS ----------------------- */
const topPosts = [
  {
    id: 1,
    title: 'How to Choose the Right Home Respiratory Equipment',
    excerpt:
      'Finding the right medical device starts with understanding your prescription’s specifications—voltage, calibration, size—and evaluating how each option aligns with those requirements. By comparing leading brands, assessing performance metrics, warranty terms and cost factors, you can make truly informed decisions. Partnering with accredited providers like JKARE guarantees genuine products, expert consultation, seamless order fulfillment and reliable after-sales support, so you can focus on achieving the best possible health outcomes.',
    imgAlt: 'Respiratory therapist helping an elderly patient',
    imgSrc:
      'https://images.pexels.com/photos/30425666/pexels-photo-30425666/free-photo-of-man-using-inhaler-for-breathing-assistance.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    href: '/blog',
    category: 'Equipment',
    date: '2024-03-02',
    readingTime: '7 min read',
  },
  {
    id: 2,
    title: 'Nebulizer vs. Inhaler: Which Is Better for You?',
    excerpt:
      'A side-by-side comparison of portability, medication delivery, maintenance and cost.',
    imgAlt: 'Child using a nebulizer mask',
    imgSrc:
      'https://images.pexels.com/photos/3845125/pexels-photo-3845125.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Respiratory Care',
    date: '2024-02-18',
    readingTime: '6 min read',
  },
  {
    id: 3,
    title: 'Creating a Safe Home Oxygen Setup in 5 Steps',
    excerpt:
      'Fire-safety tips, tubing management and humidity control for anyone on long-term oxygen therapy.',
    imgAlt: 'Woman checking her home oxygen concentrator',
    imgSrc:
      'https://images.pexels.com/photos/8114224/pexels-photo-8114224.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Safety',
    date: '2024-01-27',
    readingTime: '5 min read',
  },
  {
    id: 4,
    title: 'Sleep Apnea Myths Debunked by RTs',
    excerpt:
      'Certified respiratory therapists clear up the biggest misconceptions about CPAP therapy.',
    imgAlt: 'CPAP machine on a bedside table',
    imgSrc:
      'https://images.pexels.com/photos/6845832/pexels-photo-6845832.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Sleep',
    date: '2023-12-08',
    readingTime: '8 min read',
  },
];

/* --------------------------- LATEST POSTS --------------------- */
const latestPosts = [
  {
    id: 5,
    title: 'Insights for Better Breathing & Better Living',
    excerpt:
      'Practical tips for caregivers on choosing the right equipment and improving patient comfort.',
    imgAlt: 'Close-up of a pulse-oximeter on a patient’s finger',
    imgSrc:
      'https://images.pexels.com/photos/8460217/pexels-photo-8460217.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Wellness',
    date: '2024-04-10',
    readingTime: '5 min read',
  },
  {
    id: 6,
    title: '5 Warning Signs Your CPAP Mask Doesn’t Fit',
    excerpt:
      'Leaks, dry eyes and noisy vents—what they mean and how to correct them.',
    imgAlt: 'Man adjusting CPAP headgear',
    imgSrc:
      'https://images.pexels.com/photos/6502305/pexels-photo-6502305.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Sleep',
    date: '2024-04-05',
    readingTime: '4 min read',
  },
  {
    id: 7,
    title: 'Traveling with Oxygen: Airline Rules Explained',
    excerpt:
      'A checklist of approved devices, battery requirements and paperwork before you fly.',
    imgAlt: 'Traveler wheeling portable oxygen concentrator at airport',
    imgSrc:
      'https://images.pexels.com/photos/2267869/pexels-photo-2267869.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Lifestyle',
    date: '2024-03-22',
    readingTime: '6 min read',
  },
  {
    id: 8,
    title: 'Humidification Hacks for Winter CPAP Comfort',
    excerpt:
      'Reduce dryness and congestion with these easy humidifier adjustments.',
    imgAlt: 'CPAP humidifier tank filled with distilled water',
    imgSrc:
      'https://images.pexels.com/photos/8114313/pexels-photo-8114313.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Sleep',
    date: '2024-03-15',
    readingTime: '5 min read',
  },
  {
    id: 9,
    title: 'Understanding Prescription Codes on DME Orders',
    excerpt:
      'RTs decode common abbreviations so you know exactly what the doctor ordered.',
    imgAlt: 'Respiratory therapist reviewing physician order',
    imgSrc:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Education',
    date: '2024-02-28',
    readingTime: '7 min read',
  },
  {
    id: 10,
    title: 'Cleaning Your Nebulizer: A 3-Minute Daily Routine',
    excerpt:
      'Step-by-step guide to keep your device germ-free and performing at its best.',
    imgAlt: 'Person rinsing nebulizer cup under faucet',
    imgSrc:
      'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=1200',
    href: '/blog',
    category: 'Maintenance',
    date: '2024-02-14',
    readingTime: '3 min read',
  },
];
export default function Blog() {
  return (
    <BlogPage
      heroTitle="Blog"
      heroImage="https://images.pexels.com/photos/4065146/pexels-photo-4065146.jpeg?auto=compress&cs=tinysrgb&w=1600"
      topPosts={topPosts}
      latestPosts={latestPosts}
    />
  );
}
