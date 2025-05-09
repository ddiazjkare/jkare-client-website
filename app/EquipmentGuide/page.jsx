import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Customer Instruction Guide for CPAP & BiPAP',
    blurb:
      'JKARE provides detailed customer instruction guides for CPAP and BiPAP machines, covering setup, usage, maintenance, and troubleshooting. Our goal is to ensure optimal comfort and effectiveness for patients managing sleep apnea. ',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/images+(2).jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/Customer+Instruction+Guide+for+CPAP+%26+BiPAP.pdf",
  },
  {
    id: 2,
    title: "Nebulizer/Compressor Therapy & Cleaning Instructions",
    blurb:
      'JKARE offers comprehensive instructions for using and cleaning nebulizers and compressors. Regular cleaning and proper usage ensure effective therapy and prolong the life of your equipment. Follow our step-by-step guide for optimal performance and hygiene.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/images+(1).jpg',
    link: "https://s3.ap-south-1.amazonaws.com/medical.jkare.files/Resources+-+Nebulizer+Instructions.pdf",
  }
];

export default function EquipmentGuide() {
  return (
    <GuidesSection
      heroTitle="Equipment Guides & Instructions"
      heroImage="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/support+policies/5e4710d1-db80-4eb9-b077-232897e1d0e1.jpg"
      guides={guides}
    />
  );
}
