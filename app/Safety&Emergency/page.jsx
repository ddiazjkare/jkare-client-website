import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Emergency Planning for the Home Care Patient',
    blurb:
      'Every patient receiving care or services in the home should think about what they would do in the event of an emergency. Our goal is to help you plan so that we can try to provide you with the best, most consistent service we can during the emergency.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/EMERGENCY+PLANNING+FOR+THE+HOME+CARE+PATIENT.pdf',
  },
  {
    id: 2,
    title: 'How to Make Your Home Safe for Medical Care',
    blurb:
      'We want to make sure that your home medical treatment is done conveniently and safely. Many of our patients are limited in strength or unsteady on their feet. Some are wheelchair or bed‑bound.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
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
