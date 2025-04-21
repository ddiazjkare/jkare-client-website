import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'HIPAA Privacy Notice',
    blurb:
      'THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOWYOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/HIPAA+PRIVACY+NOTICE.pdf',
  },
  {
    id: 2,
    title: "Patient's Bill of Rights and Responsibilities",
    blurb:
      'We believe that all patients receiving services from JKARE should be informed of their rights',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/PATIENT'S+BILL+OF+RIGHTS+AND+RESPONSIBILITIES.pdf",
  },
  {
    id: 3,
    title: 'Patient Grievance and Complaint Procedure',
    blurb:
      "You may lodge a complaint without concern for reprisal, discrimination, or unreasonable interruption of service. To place a grievance, please call 305-248-1003 and speak to the Customer Services Supervisor.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/PATIENT+GRIEVANCE+AND+COMPLAINT+PROCEDURE.pdf",
  },
  {
    id: 4,
    title: 'Making Decisions About Your Health Care',
    blurb:
      "Advance Directives are forms that say, in advance, what kind of treatment you want or don't want under serious medical conditions. Some conditions, if severe, may make you unable to tell the doctor how you want to be treated at that time. Your Advance Directives will help the doctor to provide the care you would wish to have.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/MAKING+DECISIONS+ABOUT+YOUR+HEALTH+CARE.pdf",
  },
];

export default function PatientRights() {
  return (
    <GuidesSection
      heroTitle="Patient Rights & Advocacy"
      heroImage="https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg"
      guides={guides}
    />
  );
}
