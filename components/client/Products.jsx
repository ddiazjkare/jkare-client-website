'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';

/* ↙ NEW prop: selectedBrand */
const Products = ({ productList, brands, selectedBrand = null }) => {
  /* ───── dropdown toggles ───── */
  const [arrow,  setArrow]  = useState(true);
  const [arrow1, setArrow1] = useState(true);
  const [arrow2, setArrow2] = useState(true);

  /* ───── state driven by filters ───── */
  const [products, setProducts] = useState(productList);
  const [filters,  setFilters]  = useState({
    prescription: null,
    brand: selectedBrand ? [selectedBrand] : [],   // ✔ pre-select
    price: '',
  });

  /* ───── ONE-TIME fetch if a brand was supplied ───── */
  useEffect(() => {
    if (!selectedBrand) return;                    // nothing special to do

    (async () => {
      const res  = await fetch(`/api/product?brand=${encodeURIComponent(selectedBrand)}`);
      const data = await res.json();
      setProducts(data);
    })();
  }, [selectedBrand]);

  /* ───── handlers (unchanged) ───── */
  const handleFilterChange = async (e) => {
    const { checked, name, value } = e.target;
    const params = { ...filters };

    if (!params.prescription) delete params.prescription;
    if (params.brand.length === 0) delete params.brand;
    if (params.price === '') delete params.price;

    if (name === 'prescription') {
      setFilters({ ...filters, [name]: !filters.prescription });
      params[name] = !filters.prescription;
    } else if (name === 'price') {
      setFilters({ ...filters, [name]: value });
      params[name] = value;
    } else {
      if (checked) {
        setFilters({ ...filters, [name]: filters[name].concat(value) });
        params[name] = filters[name].concat(value);
      } else {
        const temp = [...filters[name]];
        temp.splice(temp.indexOf(value), 1);
        setFilters({ ...filters, [name]: temp });
        params[name] = temp;
      }
    }

    const queryString = new URLSearchParams(params).toString();
    const res  = await fetch(`/api/product?${queryString}`);
    const data = await res.json();
    setProducts(data);
  };

  const clearAllFilters = async () => {
    const reset = { prescription: null, brand: [], price: '' };
    setFilters(reset);
    const res  = await fetch('/api/product');
    const data = await res.json();
    setProducts(data);
  };

  const isFilterActive =
    filters.prescription !== null ||
    filters.brand.length   > 0   ||
    filters.price          !== '';

  /* ───── JSX ───── */
  return (
    <div className="text-black mt-32 lg:flex lg:mx-20 font-montserrat">
      {/* ─────────── LEFT: Filters ─────────── */}
      <div className="leftcontainer lg:h-auto lg:w-1/4 p-4 mt-2 bg-gray-100 rounded-xl shadow-md">
        <div className="flex justify-between items-center h-10">
          <h3 className="text-2xl font-semibold">FILTER :</h3>
          {isFilterActive && (
            <button className="text-red-600" onClick={clearAllFilters}>
              Clear filters
            </button>
          )}
        </div>
        <hr className="border-2 border-customBlue my-2" />

        {/* ----- Prescription ----- */}
        <div className="dropdowncontainer font-bold mb-4">
          <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
            <p>Prescription Required</p>
            <button onClick={() => setArrow(!arrow)}>
              {arrow ? <FaArrowDown /> : <FaArrowUp />}
            </button>
          </div>
          {!arrow && (
            <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
              {['yes', 'no'].map((opt) => (
                <div className="inner flex items-center mb-2" key={opt}>
                  <input
                    type="radio"
                    name="prescription"
                    id={opt}
                    className="border-2 border-gray-300 accent-customBaseBlue h-4 w-4"
                    checked={
                      filters.prescription === (opt === 'yes' ? true : false)
                    }
                    onChange={handleFilterChange}
                  />
                  <label htmlFor={opt} className="ml-4 text-md font-light">
                    {opt === 'yes' ? 'Yes' : 'No'}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ----- Brand ----- */}
        <div className="dropdowncontainer font-bold mb-4">
          <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
            <p>Brand</p>
            <button onClick={() => setArrow1(!arrow1)}>
              {arrow1 ? <FaArrowDown /> : <FaArrowUp />}
            </button>
          </div>
          {!arrow1 && (
            <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
              {brands.map((brand) => (
                <div className="inner flex items-center mb-2" key={brand}>
                  <input
                    type="checkbox"
                    name="brand"
                    id={`brand-${brand}`}
                    value={brand}
                    className="border-2 border-gray-300 accent-customBaseBlue h-4 w-4"
                    checked={filters.brand.includes(brand)}
                    onChange={handleFilterChange}
                  />
                  <label htmlFor={`brand-${brand}`} className="ml-4 text-md font-light">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ----- Price ----- */}
        <div className="dropdowncontainer font-bold mb-4">
          <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
            <p>Price Range</p>
            <button onClick={() => setArrow2(!arrow2)}>
              {arrow2 ? <FaArrowDown /> : <FaArrowUp />}
            </button>
          </div>
          {!arrow2 && (
            <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
              {[
                { id: 'low',    label: 'less than $2000',          val: '{"$lt":"2000"}' },
                { id: 'medium', label: 'equal or more than $2000', val: '{"$gte":"2000","$lt":"5000"}' },
                { id: 'high',   label: 'more than $5000',          val: '{"$gte":"5000"}' },
              ].map(({ id, label, val }) => (
                <div className="inner flex items-center mb-2" key={id}>
                  <input
                    type="radio"
                    name="price"
                    id={id}
                    value={val}
                    className="border-2 border-gray-300 accent-customBaseBlue h-4 w-4"
                    checked={filters.price === val}
                    onChange={handleFilterChange}
                  />
                  <label htmlFor={id} className="ml-4 text-md font-light">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─────────── RIGHT: Products ─────────── */}
      <div className="w-full">
        <div className="rightcontainer lg:h-fit lg:w-full lg:p-9 lg:pt-0 grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {products?.length ? (
            products.map((prod) => (
              <div className="p-2 flex flex-col" key={prod._id}>
                <Link href={`/product/${prod._id}`}>
                  <div className="border shadow-xl shadow-customBlue/20 border-customBlue hover:shadow-customBlue/40 hover:border-2 rounded-lg overflow-hidden flex flex-col items-center justify-between cursor-pointer transition-transform transform hover:scale-105">
                    <img
                      className="h-48 w-full object-contain object-center p-4"
                      src={prod.prod_images[0]}
                      alt={prod.prod_name}
                    />
                    <div className="p-4 flex-grow flex flex-col items-center justify-between bg-gray-200 w-full">
                      <h1 className="title-font text-md font-medium text-gray-900 text-center mb-1 line-clamp-1">
                        {prod.prod_name}
                      </h1>
                      <p className="text-md text-center bg-customBlue text-white py-2 w-full rounded-lg shadow-sm">
                        $ {prod.prod_value}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center lg:w-[60vw] lg:h-[50vh] mt-5 flex items-center justify-center">
              <Image
                src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/data-search-not-found-concept-vector-36073021_1-removebg-preview.png"
                height={600}
                width={500}
                alt="not found"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
