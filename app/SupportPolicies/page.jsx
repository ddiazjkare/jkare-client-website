import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Medicare DMEPOS Supplier Standards',
    blurb:
      'JKARE complies with all Medicare DMEPOS Supplier Standards, ensuring ethical practices, quality products, proper documentation, and patient-centered service. We are dedicated to meeting federal requirements while delivering dependable medical equipment and supplies.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/asian-pharmacist-giving-assistance-to-client-in-ph-2025-02-18-01-27-03-utc.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/MEDICARE+DMEPOS+SUPPLIER+STANDARDS.pdf",
  },
  {
    id: 2,
    title: "Warranty Information",
    blurb:
      'JKARE provides warranty coverage on all eligible medical equipment as per manufacturer terms. We ensure prompt support for repairs or replacements, helping patients receive reliable and worry-free care with every product delivered.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/senior-doctor-talking-with-patient-office.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/WARRANTY+INFORMATION.pdf",
  },
  {
    id: 3,
    title: 'Insurance Information',
    blurb:
      "JKARE works with most major insurance providers to help cover the cost of your medical equipment and services. Our team assists with verification, billing, and claims to make your experience smooth and stress-free.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/unrecognizable-doctor-extending-digital-tab-anonymous-patient-fill-questionnaire.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/PATIENT+GRIEVANCE+AND+COMPLAINT+PROCEDURE.pdf",
  },
  {
    id: 4,
    title: 'Prescription Requirements',
    blurb:
      "Certain medical equipment and supplies require a valid prescription. At JKARE, we ensure all prescriptions meet federal and insurance guidelines, helping you receive the right products safely, efficiently, and in full compliance.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/heathcare-form-insurance-application-concept.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/PATIENT+GRIEVANCE+AND+COMPLAINT+PROCEDURE.pdf",
  },
  {
    id: 5,
    title: 'Medicare Support',
    blurb:
      "JKARE provides dedicated Medicare support, assisting with coverage, claims, and eligibility. Our team guides you through the process to ensure you receive the benefits you're entitled to for medical equipment and services.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/doctor-doing-their-work-pediatrics-office.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/MAKING+DECISIONS+ABOUT+YOUR+HEALTH+CARE.pdf",
  },
];

export default function PatientRights() {
  return (
    <GuidesSection
      heroTitle="Support Policies & Information"
      heroImage="https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg"
      guides={guides}
    />
  );
}
