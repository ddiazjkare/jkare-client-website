import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'HIPAA Privacy Notice',
    blurb:
      'At JKARE, we are committed to protecting your health information. Our HIPAA Privacy Notice outlines how your medical data is used, stored, and shared, ensuring your rights and privacy are always respected.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/HIPAA+Privacy+Notice.webp',
    link: 'https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/HIPAA+PRIVACY+NOTICE.pdf',
  },
  {
    id: 2,
    title: "Patient's Bill of Rights and Responsibilities",
    blurb:
      'JKARE upholds every patient’s right to respectful, informed, and quality care. We also emphasize patient responsibilities, including honest communication, following care plans, and treating caregivers with respect to ensure the best possible outcomes.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: "https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Patient's+Bill+of+Rights+and+Responsibilities.webp",
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/PATIENT'S+BILL+OF+RIGHTS+AND+RESPONSIBILITIES.pdf",
  },
  {
    id: 3,
    title: 'Patient Grievance and Complaint Procedure',
    blurb:
      "JKARE values patient feedback and is committed to resolving concerns promptly. Our grievance procedure ensures every complaint is heard, documented, and addressed respectfully, promoting continuous improvement in the quality of care we provide.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Patient+Grievance+and+Complaint+Procedure.webp',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/PATIENT+GRIEVANCE+AND+COMPLAINT+PROCEDURE.pdf",
  },
  {
    id: 4,
    title: 'Making Decisions About Your Health Care',
    blurb:
      "We empower patients to make informed decisions about their health care. We provide clear information, respect personal choices, and support advance directives to ensure your preferences guide your treatment at every stage.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Making+Decisions+About+Your+Health+Care.webp',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/MAKING+DECISIONS+ABOUT+YOUR+HEALTH+CARE.pdf",
  },
];

export default function PatientRights() {
  return (
    <GuidesSection
      heroTitle="Patient Rights & Advocacy"
      heroImage="https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/patienttakingadvice.jpg"
      guides={guides}
    />
  );
}
