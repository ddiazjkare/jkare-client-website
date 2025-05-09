import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Emergency Planning for the Home Care Patient',
    blurb:
      'Emergency planning is essential for home care patients to ensure safety during unexpected events. Proper plans include emergency contacts, medical information, supplies, and caregiver instructions to guarantee continuous care and minimize health risks.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/we-have-just-what-the-doctor-prescribed-2025-04-05-21-38-17-utc.jpg',
    link: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/EMERGENCY+PLANNING+FOR+THE+HOME+CARE+PATIENT.pdf',
  },
  {
    id: 2,
    title: 'How to Make Your Home Safe for Medical Care',
    blurb:
      'We want to make sure that your home medical treatment is done conveniently and safely. Many of our patients are limited in strength or unsteady on their feet. Some are wheelchair or bed‑bound.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/delivering-optimal-pharmaceutical-care-2025-04-06-06-32-34-utc.jpg',
    link: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/HOW+TO+MAKE+YOUR+HOME+SAFE+FOR+MEDICAL+CARE.pdf',
  },
];

export default function SafetyPage() {
  return (
    <GuidesSection
      heroTitle="Safety and Emergency Planning"
      heroImage="https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg"
      guides={guides}
    />
  );
}
