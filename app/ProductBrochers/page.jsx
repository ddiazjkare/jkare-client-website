import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Afflovest (English)',
    blurb:
      'Afflovest is a state-of-the-art wearable therapy device designed to relieve symptoms of chronic respiratory conditions. Using advanced high-frequency chest wall oscillation, it helps clear mucus and improve lung function. Comfortable, easy to use, and effective for home therapy.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/AffloVest%2BTween%2B(4)edit.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/AfflovestEnglish_FINAL.pdf",
  },
  {
    id: 2,
    title: "Biwaze Airway Clearance System User Manual",
    blurb:
      'The Biwaze Airway Clearance System is designed to improve lung health through high-frequency chest wall oscillation. This user manual provides step-by-step instructions for safe and effective use, including setup, maintenance, and troubleshooting tips for optimal performance.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/BiWaze-Cough-with-bag-and-circuit-scaled.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/ABMRC+BiWaze+Airway+Clearance+System+brochure.pdf",
  },
  {
    id: 3,
    title: "Biwaze Clear Quick Hits",
    blurb:
      'Biwaze Clear Quick Hits are designed to deliver fast, effective airway clearance for patients with chronic respiratory conditions. These quick bursts of high-frequency oscillation help loosen mucus and improve lung function, providing rapid relief and enhancing daily breathing.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/porta-medical-clear-section-1.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/BiWaze+-+Clear-Quick+Hits.pdf",
  },
  {
    id: 4,
    title: "Biwaze Cough User Manual (English)",
    blurb:
      'The Biwaze Cough device is designed to assist with effective airway clearance by simulating a natural cough. This user manual provides detailed instructions for proper use, maintenance, and troubleshooting to ensure optimal device performance and patient comfort.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/porta-medical-produkte-cough-header.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/BiWaze+-+Cough+-User+Manual_US_English.pdf",
  },
  {
    id: 5,
    title: "Biwaze Cough User Manual (Spanish)",
    blurb:
      "El dispositivo BiWaze® Cough ayuda a eliminar las secreciones broncopulmonares del sistema respiratorio mediante una terapia que imita la tos. La terapia consta de tres fases que imitan una tos: fase de inhalación, fase de exhalación y fase de pausa.  ",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/porta-medical-produkte-cough-header.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/BiWaze+-+Cough+-User+Manual_US_Spanish.pdf",
  },
  {
    id: 6,
    title: "Oxlife Liberty User Manual",
    blurb:
      "The Oxlife Liberty® is a portable oxygen concentrator used on a prescriptive basis that enables patients requiring supplemental oxygen to be treated in a home, institutional, or vehicle/mobile environment. The Oxlife Liberty® delivers 87% -95 % pure oxygen to a patient through a standard single lumen nasal cannula. ",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Oxlife_LIBERTY-portable-oxygen-concentrator_1024x1024.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/Oxlife%2BLiberty%2BUser%2BManual.pdf",
  },
  {
    id: 7,
    title: "MyAirvo Use and Care Guide",
    blurb:
      "The MyAirvo 2 is a humidifier with integrated flow generator that delivers warmed and humidified respiratory gases to spontaneously breating patients through a variety of patient interfaces.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/myairvo2-humidified-high-flow-system-fisher-paykel_600x600.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/myairvo2-user-manual-ui-185045490.pdf",
  }
];
export default function ProductBrochers() {
  return (
    <GuidesSection
      heroTitle="Product Brochures"
      heroImage="https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/patienttakingadvice.jpg"
      guides={guides}
    />
  );
}
