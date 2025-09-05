import HeroSection from "./HeroSection";
import Testimonials from "./Testimonials";
import TagLine from "./TagLine";
import NewArrivals from "./NewArrivals";
import ProductCategory from './client/ProductCategory';
import AboutUs from "./AboutUs";
import CenteredBox from "./CenteredBox";

async function fetchHomepageData() {
  try {
    const response = await fetch('https://h5m2m7a2if.execute-api.ap-south-1.amazonaws.com/homepage/6863b9eb524d3a4b3f3dc4bf', {
      cache: 'no-store', 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null;
  }
}

async function MainPage() {
  const pageData = await fetchHomepageData();

  if (!pageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p>Unable to load homepage content. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection heroData={pageData.hero} />
      <div className="font-montserrat">
        <NewArrivals bestSellers={pageData.bestSellers} /> {/* done */}
        <ProductCategory categories={pageData.categories}/>{/* done */}
      </div>
      <TagLine services={pageData.services} /> {/* done */}
      <AboutUs aboutData={pageData.about} /> {/* done */}
      <Testimonials />{/* not required*/}
      <CenteredBox faqs={pageData.faqs} /> {/* done */}
    </>
  );
}

export default MainPage;