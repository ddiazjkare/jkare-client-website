import HeroSection from "./HeroSection";
// import DealsandOffers from "./DealsandOffers";
import Testimonials from "./Testimonials";
import TagLine from "./TagLine";
// import NewArrivals from "./NewArrivals";
import HomeProduct from "./server/HomeProduct";
import AboutUs from  "./AboutUs";
import CenteredBox from "./CenteredBox"

function MainPage() {
  return (
    <>
      <HeroSection />
      <div className=" font-montserrat">
      {/* <NewArrivals /> */}
      {/* <HomeProduct /> */}
      </div>
      {/* <TagLine/> */}
      <AboutUs/>
      <Testimonials />
      <CenteredBox/>
    </>
  );
}
export default MainPage;
