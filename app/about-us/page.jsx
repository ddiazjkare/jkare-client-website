import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const whyPoints = [
    'Clinical excellence & personalized care',
    'Collaboration with physicians & hospitals',
    'Cutting‑edge respiratory equipment',
    'ACHC accredited & patient‑focused',
  ];

  return (
    <div className="bg-white font-montserrat">
      {/* -------------------------------------------------- */}
      {/* Hero Section */}
      {/* -------------------------------------------------- */}
      <div className="relative h-[450px] w-full">
        <Image
          src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/Shutterstock%2B350925269.jpg"
          alt="About JKARE Hero"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
          priority
        />
        {/* Overlay title */}
        <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md px-10 py-5 shadow-lg rounded-r-2xl">
          <h1 className="text-customBlue text-4xl font-semibold tracking-wide ">About JKARE</h1>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* WHY JKARE  +  OUR STORY */}
      {/* -------------------------------------------------- */}
      <section className="py-20 px-6 md:px-10 lg:px-16 xl:px-20 bg-[url('https://images.unsplash.com/photo-1587500152349-954f5eca2e7d?auto=format&fit=crop&w=1950&q=80')] bg-no-repeat bg-cover bg-fixed bg-center/cover/50 after:content-[''] after:absolute after:inset-0 after:bg-white/90 relative">
        <div className="relative z-10 max-w-6xl mx-auto space-y-20">
          {/* WHY JKARE */}
          <div className="bg-gradient-to-r from-[#E0F7FF] to-[#F3FBFF] border-l-8 border-customBlue rounded-2xl shadow-xl p-10 md:p-14">
            <h2 className="text-customBlue text-4xl md:text-5xl font-bold mb-6 drop-shadow-sm">Why&nbsp;JKARE</h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              At JKARE, we understand that choosing the right home respiratory therapy and medical equipment company is crucial for your health and quality of life. Our unwavering commitment to clinical excellence, personalized patient care, and innovative respiratory solutions sets us apart.
            </p>

            {/* Bullet points */}
            <ul className="grid md:grid-cols-2 gap-4 md:gap-6">
              {whyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-base md:text-lg">
                  <CheckCircle className="min-w-[20px] h-5 w-5 text-customBlue" />
                  <span className="text-gray-800 leading-snug">{point}</span>
                </li>
              ))}
            </ul>

            <p className="text-gray-700 text-lg leading-relaxed mt-6">
              JKARE is ACHC‑accredited and strictly adheres to evidence‑based clinical guidelines. When you choose JKARE, you gain a trusted partner committed to innovation, integrity, and your well‑being.
            </p>
          </div>

          {/* OUR STORY */}
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Decorative vertical line for large screens */}
            <span className="hidden md:block md:col-span-1 h-full w-1 bg-customPink rounded-full"></span>

            <div className="md:col-span-11 bg-white border border-customPink rounded-2xl shadow-xl p-10 md:p-14">
              <h2 className="text-customPink text-4xl md:text-5xl font-bold mb-6 drop-shadow-sm">Our&nbsp;Story</h2>

              <blockquote className="italic text-customPink/90 text-xl leading-relaxed mb-6">
                “Our family’s journey with chronic respiratory illness revealed a need—and sparked a mission.”
              </blockquote>

              <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
                <p>
                “Our family’s journey with chronic respiratory illness revealed a need and sparked a mission.”
                Our son was born in 2002 and, from his earliest days, faced significant respiratory challenges. Chronic asthma and recurrent pneumonia kept him frequently hospitalized, bringing uncertainty and distress. In May 2007, we finally received a definitive diagnosis: Cystic Fibrosis, an inherited condition affecting the lungs and digestive system. A rigorous regimen of respiratory therapy and medication transformed his health, thanks to an interdisciplinary team of compassionate professionals.
                </p>
                <p>
                This experience revealed a critical gap: our families needed expert respiratory care providers who empathized with their struggles. Driven to make a difference, we founded JKARE in 2010. While we began with a pediatric focus, demand quickly extended to adults, prompting us to broaden our services for patients of all ages.
                </p>
                <p>
                Today, JKARE remains a family-inspired, clinician-led organization dedicated to reducing hospitalization, lightening the burden on caregivers, and empowering patients to live joyful, independent lives. Every service we deliver is guided by the unwavering belief that quality respiratory care should be compassionate, comprehensive, and accessible to all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* MISSION STATEMENT */}
      {/* -------------------------------------------------- */}
      <div className="bg-customBlue py-16 flex justify-center items-center">
        <div
          className="bg-white max-w-[1400px] w-full mx-auto p-6 sm:p-10 md:p-14 shadow-xl rounded-2xl"
          style={{ border: '6px solid #00AEEF', minHeight: '400px' }}
        >
          {/* Centered Title */}
          <div className="py-8 px-4 text-center">
            <h2 className="text-customBlue text-3xl md:text-4xl font-extrabold mb-4">
              Our Mission Statement
            </h2>

            {/* Content with Flexbox for text and logo */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="md:w-2/3 text-left space-y-4">
                <h3 className="text-customBlue text-xl md:text-2xl font-semibold">
                  To Offer High‑Quality Services
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We strive to improve the health of our patients in a manner that distinguishes us in our industry. Patient rights, responsibilities, dignity, and confidentiality guide every interaction and follow‑up.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our team stays at the forefront of home‑health technology through seminars, factory training, and continuous in‑house education, ensuring that every patient receives state‑of‑the‑art care.
                </p>
              </div>

              <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center">
                <Image
                  src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/certificado12.jpg"
                  alt="ACHC Logo"
                  width={220}
                  height={220}
                  className="block rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* VISION & GOAL */}
      {/* -------------------------------------------------- */}
      <section className="py-20 px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col lg:flex-row gap-10 max-w-[1400px] mx-auto">
          {/* Vision */}
          <div className="flex-1 bg-white border border-customBlue rounded-2xl shadow-xl p-10 sm:p-12">
            <h2 className="text-customBlue text-4xl font-extrabold">Our Vision</h2>
            <h3 className="text-customBlue text-2xl mt-3 font-semibold">To Accommodate All Patients</h3>
            <p className="text-gray-700 mt-6 text-lg leading-relaxed">
            To serve all patients with integrity and excellence by building a trusted team dedicated to delivering advanced respiratory care and medical equipment across Florida. Our commitment to innovation, ethical standards, and full regulatory compliance drives our growth and impact.
            </p>
          </div>

          {/* Goal */}
          <div className="flex-1 bg-customPink text-white rounded-2xl shadow-xl p-10 sm:p-12">
            <h2 className="text-4xl font-extrabold">Our Goal</h2>
            <h3 className="text-2xl mt-3 font-semibold">To Meet Our Customers’ Needs</h3>
            <p className="mt-6 text-lg leading-relaxed">
              We provide the highest quality clinical respiratory care, supplies, and durable medical equipment—driven by cutting‑edge science, technology, and adherence to the strictest standards of legal compliance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
