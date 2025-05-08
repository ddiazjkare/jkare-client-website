import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Afflovest (English)',
    blurb:
      'The AflloVest User Manual contains important SAFETY and TECHICAL DATA. Please keep this manual in a safe... ',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/AffloVest%2BTween%2B(4)edit.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/AfflovestEnglish_FINAL.pdf",
  },
  {
    id: 2,
    title: "Biwaze Airway Clearance System User Manual",
    blurb:
      'Your Physician Has Prescribed a Nebulizer/Compressor for Your Home Use. The Following Instructions Will Be Explained in Detail at Time of Set-Up. Please Save These General Instructions for Your Reference.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/BiWaze-Clear-group-screen-on-4.png',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/BiWaze+-+Clear_User-Manual_US_Printable.pdf",
  },
  {
    id: 3,
    title: "Biwaze Clear Quick Hits",
    blurb:
      'The BiWaze® Clear System delivers oscillating lung expansion (OLE) therapy to help treat and prevent atelectasis, clear retained secretions from deep within the lungs...',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/ABM-041524-085.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/BiWaze+-+Clear-Quick+Hits.pdf",
  },
  {
    id: 4,
    title: "Biwaze Cough User Manual (English)",
    blurb:
      'The BiWaze® Cough device helps to clear bronchopulmonary secretions from the respiratory system by providing a therapy which mimics a cough. The therapy consists of three phases which mimic a cough; inhale, exhale, and pause phase.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/porta-medical-produkte-cough-header.png',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/BiWaze+-+Cough+-User+Manual_US_English.pdf",
  },
  {
    id: 5,
    title: "Biwaze Cough User Manual (Spanish)",
    blurb:
      "El dispositivo BiWaze® Cough ayuda a eliminar las secreciones broncopulmonares del sistema respiratorio mediante una terapia que imita la tos. La terapia consta de tres fases que imitan una tos: fase de inhalación, fase de exhalación y fase de pausa.  ",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/BiWaze+-+Cough+-User+Manual_US_Spanish.pdf",
  },
  {
    id: 6,
    title: "Oxlife Liberty User Manual",
    blurb:
      "The Oxlife Liberty® is a portable oxygen concentrator used on a prescriptive basis that enables patients requiring supplemental oxygen to be treated in a home, institutional, or vehicle/mobile environment. The Oxlife Liberty® delivers 87% -95 % pure oxygen to a patient through a standard single lumen nasal cannula. ",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/LibertyPOC-Adjustments-scaled-1.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/Oxlife%2BLiberty%2BUser%2BManual.pdf",
  },
  {
    id: 7,
    title: "MyAirvo Use and Care Guide",
    blurb:
      "The MyAirvo 2 is a humidifier with integrated flow generator that delivers warmed and humidified respiratory gases to spontaneously breating patients through a variety of patient interfaces.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/myairvo2-humidified-high-flow-system-fisher-paykel_600x600.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/myairvo2-user-manual-ui-185045490.pdf",
  }
];

export default function ProductBrochers() {
  return (
    <GuidesSection
      heroTitle="Product Brochures"
      heroImage="https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg"
      guides={guides}
    />
  );
}
