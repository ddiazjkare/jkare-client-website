import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'In-home & Clinical Respiratory Services',
    blurb:
      'Our respiratory team provides a range of equipment, from basic nasal cannulas to advanced mechanical ventilation and urological supplies, specializing in sales.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: '',
  },
  {
    id: 2,
    title: "The Agency for Healthcare Administration (AHCA)",
    blurb:
      'Certified by the AHCA as a Healthcare Service Pool, we provide licensed respiratory therapists for in‑home care and as temporary staff for residential facilities.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "",
  },
  {
    id: 3,
    title: 'Medical Equipments and Supplies',
    blurb:
      "Our skilled respiratory therapists oversee patients' medical equipment, ensuring high‑quality respiratory health through regular check‑ins and dependable on‑call service.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "",
  },

];

export default function OurServices() {
  return (
    <GuidesSection
      heroTitle="Our Services"
      heroImage="https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg"
      guides={guides}
    />
  );
}
