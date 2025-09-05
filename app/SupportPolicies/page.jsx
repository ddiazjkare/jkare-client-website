import GuidesSection from '../../components/GuideSection';
const guides = [
  {
    id: 1,
    title: 'Medicare DMEPOS Supplier Standards',
    blurb:
      'JKARE complies with all Medicare DMEPOS Supplier Standards, ensuring ethical practices, quality products, proper documentation, and patient-centered service. We are dedicated to meeting federal requirements while delivering dependable medical equipment and supplies.',
    imgAlt: 'Man pointing to CPAP screen',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Medicare+DMEPOS+Supplier+Standards.webp',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/MEDICARE+DMEPOS+SUPPLIER+STANDARDS.pdf",
  },
  {
    id: 2,
    title: "Warranty Information",
    blurb:
      'JKARE provides warranty coverage on all eligible medical equipment as per manufacturer terms. We ensure prompt support for repairs or replacements, helping patients receive reliable and worry-free care with every product delivered.',
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Warranty+Information.webp',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/JKARE+DME+-++WARRANTY+INFORMATION.pdf",
  },
  {
    id: 3,
    title: 'Insurance Information',
    blurb:
      "JKARE works with most major insurance providers to help cover the cost of your medical equipment and services. Our team assists with verification, billing, and claims to make your experience smooth and stress-free.",
    // details: (
    //   <>
    //     <p>
    //       JKARE works with most major insurance providers to help cover the cost of your medical equipment and services. Our team assists with verification, billing, and claims to make your experience smooth and stress-free.
    //       See the list below for some of the insurance companies we have direct contracts with.
    //     </p>
    //     <h3 className="mt-4 font-semibold">JKARE DIRECT CONTRACT</h3>
    //     <ul className="list-disc list-inside">
    //       <li>Aetna</li>
    //       <li>Medicare - Statewide</li>
    //       <li>Medicaid - Statewide</li>
    //       <li>APD Waiver – Miami Dade and Broward Counties.....</li>
    //     </ul>

    //   </>
    // ),
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Insurance+Information_2.jpg',
    link: "https://s3.ap-south-1.amazonaws.com/jkare.data/patient+resources+files/Jkare+HME+Accepted+Insurances+updated.pdf",
  },
  {
    id: 4,
    title: 'Prescription Requirements',
    blurb:
      "All medical equipment and supplies require a valid prescription. At JKARE, we ensure that all prescriptions meet federal and insurance guidelines, helping you receive the right products safely, efficiently, and in full compliance. A signed prescription (Rx) is required. In most cases, doctors know what information to include when sending an Rx. However, since we manually review each prescription, we may need to contact the doctor if any information is missing.",
    imgAlt: 'Woman using nebulizer',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/jkare.data/Patient_resources_images/Prescription+Requirements.jpg',
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