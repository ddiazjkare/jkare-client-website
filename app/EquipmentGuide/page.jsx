import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Customer Instruction Guide for CPAP & BiPAP',
    blurb:
      'Congratulations on making the move toward better sleep and overall improved health by becoming a CPAP/BiPAP user. Thank you for choosing JKARE to be your provider. ',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/Customer+Instruction+Guide+for+CPAP+%26+BiPAP.pdf",
  },
  {
    id: 2,
    title: "Nebulizer/Compressor Therapy & Cleaning Instructions",
    blurb:
      'YOUR PHYSICIAN HAS PRESCRIBED A NEBULIZER/COMPRESSOR FOR YOUR HOME USE. THE FOLLOWING INSTRUCTIONS WILL BE EXPLAINED IN DETAIL AT TIME OF SET-UP. PLEASE SAVE THESE GENERAL INSTRUCTIONS FOR YOUR REFERENCE.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/Resources+-+Nebulizer+Instructions.pdf",
  }
];

export default function EquipmentGuide() {
  return (
    <GuidesSection
      heroTitle="Equipment Guides & Instructions"
      heroImage="https://s3.ap-south-1.amazonaws.com/medical.jkare.files/pexels-photo-2977565.jpeg"
      guides={guides}
    />
  );
}
