/**  app/brands/page.jsx  (server component – App Router) */

import Products from '../../components/client/Products';   // adjust path if needed

async function fetchJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });

    /* non-200 or non-JSON? → treat as empty */
    if (!res.ok) return [];
    const type = res.headers.get('content-type') || '';
    if (!type.includes('application/json')) return [];

    return await res.json();
  } catch (err) {
    console.error('fetch error', url, err);
    return [];
  }
}
export default async function BrandProductsPage({ searchParams }) {
  const selectedBrand = searchParams?.brand || '';
  const productURL = selectedBrand
    ? `/api/product?brand=${encodeURIComponent(selectedBrand)}`
    : '/api/product';

  /* grab products & brands in parallel */
  const [productList, brandList] = await Promise.all([
    fetchJSON(productURL),
    fetchJSON('/api/brand'),
  ]);

  return (
    <Products
      productList={productList}
      brands={brandList}
      selectedBrand={selectedBrand}
    />
  );
}
