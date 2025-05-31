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
  const response = await fetch("http://13.201.44.76/api/ship-env", {
    cache: "no-store",
  });
  return await response.json();
}

async function ProductDetailPage({ params }) {
  const data = await fetchApi(params.id);
  const env = await fetchShippingOffer();

  return <AdvancedProductDetail data={data} env={env} />;
}
export default ProductDetailPage;
