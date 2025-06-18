import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Medicare DMEPOS Supplier Standards',
    blurb:
      'JKARE complies with all Medicare DMEPOS Supplier Standards, ensuring ethical practices, quality products, proper documentation, and patient-centered service. We are dedicated to meeting federal requirements while delivering dependable medical equipment and supplies.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/little-girl-with-her-mother-at-a-doctor-on-consult-2024-12-13-04-33-04-utc.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/MEDICARE+DMEPOS+SUPPLIER+STANDARDS.pdf",
  },
  {
    id: 2,
    title: "Warranty Information",
    blurb:
      'JKARE provides warranty coverage on all eligible medical equipment as per manufacturer terms. We ensure prompt support for repairs or replacements, helping patients receive reliable and worry-free care with every product delivered.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/medical-doctors-at-the-conference-2024-10-21-09-48-40-utc.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/JKARE+DME+-++WARRANTY+INFORMATION.pdf",
  },
  {
    id: 3,
    title: 'Insurance Information',
    blurb:
      "JKARE works with most major insurance providers to help cover the cost of your medical equipment and services. Our team assists with verification, billing, and claims to make your experience smooth and stress-free.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/pexels-photo-7163956.jpg',
    link: "",
  },
  {
    id: 4,
    title: 'Prescription Requirements',
    blurb:
      "All medical equipment and supplies require a valid prescription. At JKARE, we ensure all prescriptions meet federal and insurance guidelines, helping you receive the right products safely, efficiently, and in full compliance.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/prescription.jpg',
    link: "",
  },
  // {
  //   id: 5,
  //   title: 'Medicare Support',
  //   blurb:
  //     "JKARE provides dedicated Medicare support, assisting with coverage, claims, and eligibility. Our team guides you through the process to ensure you receive the benefits you're entitled to for medical equipment and services.",
  //   imgAlt: 'Woman using nebulizer',
  //   imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/medicare+support.jpg',
  //   link: "",
  // },
];

export default function PatientRights() {
  return (
    <GuidesSection
      heroTitle="Support Policies & Information"
      heroImage="https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/patienttakingadvice.jpg"
      guides={guides}
      
    />
  );
}
