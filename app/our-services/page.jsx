import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Clinical Respiratory Services',
    blurb:
      'Our Respiratory Therapy team delivers specialized, high-quality in-home care to patients of all ages with complex pulmonary conditions. We provide clinical expertise in managing and optimizing respiratory function through advanced therapeutic techniques, state-of-the-art equipment, and a compassionate, patient-centered approach. Our licensed therapists work collaboratively with physicians and families to ensure safety, comfort, and improved quality of life for every patient we serve.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Respiratory-Therapy.jpg',
    link: '',
  },
  {
    id: 2,
    title: "Health Care Services Pool",
    blurb:
      'Certified by the Agency for Healthcare Administration (AHCA) as a Healthcare Service Pool, we provide licensed respiratory therapists for in-home care and as temporary staff for residential facilities.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/respiratory+therapist.jpg',
    link: "",
  },
  {
    id: 3,
    title: 'Medical Equipments and Supplies',
    blurb:
      "JKARE provides a comprehensive range of high-quality medical equipment, respiratory devices, and healthcare consumables designed to support patient care at home. We specialize in advanced respiratory solutions and durable medical equipment (DME) tailored to meet the unique needs of each patient. Our team ensures timely delivery, personalized setup, and ongoing support to promote safety, independence, and better health outcomes.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/medicalinstrument.jpeg',
    link: "",
  },

];

export default function OurServices() {
  return (
    <GuidesSection
      heroTitle="Our Services"
      heroImage="https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/patienttakingadvice.jpg"
      guides={guides}
    />
  );
}
