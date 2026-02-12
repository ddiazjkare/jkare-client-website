import AdvancedProductDetail from "../../../components/client/AdvancedProductDetail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const generateMetadata = () => {
  return {
    title: "Product Detail",
  };
};

/**
 * Fetch product data with proper error handling
 * @param {string} id - Product ID
 * @returns {Promise<object>} Product data
 */
const fetchApi = async (id) => {
  try {
    // Validate ID format (basic MongoDB ObjectId validation)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error(`Invalid product ID format: ${id}`);
      return null;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is OK
    if (!response.ok) {
      console.error(`Product fetch failed: ${response.status} ${response.statusText}`);
      return null;
    }

    // Validate content type before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Expected JSON but received: ${contentType}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return null;
  }
};

/**
 * Fetch shipping offer data with error handling
 * @returns {Promise<object|null>} Shipping environment data or null
 */
async function fetchShippingOffer() {
  try {
    const response = await fetch(`https://admin.jkare.com/api/ship-env`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Shipping offer fetch failed: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Expected JSON for shipping offer but received: ${contentType}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("Error fetching shipping offer (non-critical):", error.message);
    return null;
  }
}

async function ProductDetailPage({ params }) {
  // Fetch data with error handling
  const data = await fetchApi(params.id);
  
  // If product data is invalid or not found, show 404
  if (!data || !data.product) {
    notFound();
  }

  // Fetch shipping offer (non-critical, can be null)
  const env = await fetchShippingOffer();

  return <AdvancedProductDetail data={data} env={env} />;
}

export default ProductDetailPage;
