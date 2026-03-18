import AdvancedProductDetail from "../../../components/client/AdvancedProductDetail";
export const dynamic = "force-dynamic";
export const generateMetadata = () => {
  return {
    title: "Product Detail",
  };
};

const fetchApi = async (id) => {
  let data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
    cache: "no-store",
  });

  return await data.json();
};

async function fetchShippingOffer() {
  try {
    const response = await fetch(`https://admin.jkare.com/api/ship-env`, {
      cache: "no-store",
    });
    if (!response.ok) {
      console.warn(`Shipping offer fetch failed: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn("Error fetching shipping offer:", error.message);
    return null;
  }
}

async function ProductDetailPage({ params }) {
  const data = await fetchApi(params.id);
  const env = await fetchShippingOffer();

  return <AdvancedProductDetail data={data} env={env} />;
}
export default ProductDetailPage;
