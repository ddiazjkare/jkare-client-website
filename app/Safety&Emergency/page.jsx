import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Emergency Planning for the Home Care Patient',
    blurb:
      'Emergency planning is essential for home care patients to ensure safety during unexpected events. Proper plans include emergency contacts, medical information, supplies, and caregiver instructions to guarantee continuous care and minimize health risks.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/man+with+cpap+machine.jpg',
    link: 'https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/EMERGENCY+PLANNING+FOR+THE+HOME+CARE+PATIENT.pdf',
  },
  {
    id: 2,
    title: 'How to Make Your Home Safe for Medical Care',
    blurb:
      'We want to make sure that your home medical treatment is done conveniently and safely. Many of our patients are limited in strength or unsteady on their feet. Some are wheelchair or bed‑bound.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/women+using+nebulizer.jpg',
    link: 'https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/HOW+TO+MAKE+YOUR+HOME+SAFE+FOR+MEDICAL+CARE.pdf',
  },
];

export default function SafetyPage() {
  return (
    <GuidesSection
      heroTitle="Safety and Emergency Planning"
      heroImage="https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/patienttakingadvice.jpg"
      guides={guides}
    />
  );
}
