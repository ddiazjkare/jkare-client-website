"use client";
import { useState, useContext, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ImageModal from "./ImageModal";
import { FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaHeart, FaShare, FaPhone, FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { CartContext } from "../SessionProVider";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedProductDetail = ({ data, env }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [, setCartItems] = useContext(CartContext);
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);

  const warrantyYears = (() => {
    const key = Object.keys(data.product.key_features)
      .find(k => /^\d+_year(s)?_warranty$/.test(k) && data.product.key_features[k]);
    return key ? key.split('_')[0] : null ; 
  })();

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  async function addToCart(product) {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  async function upToDateCart(product) {
    await fetch(`/api/cart/${product.email}?product_id=${product.product_id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  }

  const cartHandler = () => {
    if (data.product.stockQuantity === 0) {
      return;
    }
    let cart = [];
    const medCart = typeof window !== "undefined" && window.localStorage.getItem("medCart");
    const newProduct = {
      quantity,
      product_id: data.product._id,
      description: data.product.prod_desc,
      prescription: data.product.key_features.rx_required,
      images: data.product.prod_images,
      title: data.product.prod_name,
      price: data.product.prod_value,
      stockQuantity: data.product.stockQuantity,
      parcel_info: data.product.parcel,
    };

    if (medCart) {
      const localCart = JSON.parse(medCart);

      if (localCart.length < 10) {
        toast("Item added successfully", {
          position: "top-center",
          autoClose: 1500,
          type: "success",
        });
      } else {
        toast("Cart is full, no more items will be added", {
          position: "top-center",
          autoClose: 3000,
          type: "error",
        });
        return;
      }

      const exist = localCart.find((c) => c.product_id == data.product._id);
      if (exist) {
        cart = localCart.map((c) => {
          if (c.product_id == data.product._id) {
            if (session && session.user) {
              upToDateCart({
                quantity,
                product_id: data.product._id,
                email: session.user.email,
              });
            }
            return newProduct;
          }
          return {
            quantity: c.quantity,
            product_id: c.product_id,
            images: c.images,
            title: c.title,
            price: c.price,
            stockQuantity: c.stockQuantity,
            prescription: c.prescription,
            description: c.description,
            parcel_info: c.parcel_info,
          };
        });
      } else {
        cart = [...localCart, newProduct];
        if (session && session.user) {
          addToCart({
            quantity,
            product_id: data.product._id,
            email: session.user.email,
            ...data.product,
          });
        }
      }
    } else {
      if (session && session.user) {
        addToCart({
          quantity,
          product_id: data.product._id,
          email: session.user.email,
          ...data.product,
        });
      }
      cart.push(newProduct);
    }

    setCartItems(cart.length);
    window.localStorage.setItem("medCart", JSON.stringify(cart));
  };

  const handleLeftArrowClick = () => {
    if (thumbnailIndex > 0) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const handleRightArrowClick = () => {
    if (thumbnailIndex < data?.product.prod_images.length - 4) {
      setThumbnailIndex(thumbnailIndex + 1);
    }
  };

  const isOutOfStock = data.product.stockQuantity === 0;

  return (
    <div className="min-h-screen bg-white mt-24">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{data.product.prod_name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden group">
              <div className="aspect-square">
                <img
                  src={data?.product.prod_images[selectedImage]}
                  alt="Product"
                  className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={handleImageClick}
                />
              </div>
              
              {/* Action buttons overlay */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                    isFavorited 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'bg-white/80 text-gray-600 border-white/20 hover:bg-white'
                  }`}
                >
                  <FaHeart size={16} />
                </button>
                <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 text-gray-600 hover:bg-white transition-all duration-200">
                  <FaShare size={16} />
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleLeftArrowClick}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                disabled={thumbnailIndex === 0}
              >
                <FaChevronLeft size={16} />
              </button>
              
              <div className="flex space-x-2 overflow-hidden">
                {data?.product.prod_images
                  .slice(thumbnailIndex, thumbnailIndex + 4)
                  .map((image, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                        selectedImage === thumbnailIndex + index
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                      }`}
                      onClick={() => handleThumbnailClick(thumbnailIndex + index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-gray-50"
                      />
                    </div>
                  ))}
              </div>
              
              <button
                onClick={handleRightArrowClick}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                disabled={thumbnailIndex >= data?.product.prod_images.length - 4}
              >
                <FaChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {data.product.brand_name}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={14} />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                </div>
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {data.product.prod_name}
              </h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isOutOfStock 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </span>
                  {!isOutOfStock && (
                    <span className="text-sm text-gray-500">
                      {data.product.stockQuantity} available
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">PUI: {data.product.prod_id}</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {data.product.prod_highlight.map((highlight, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex items-baseline space-x-3">
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500">$</span>
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {isOutOfStock ? "---" : data.product.prod_value.toLocaleString()}
                  </span>
                </div>
                {!isOutOfStock && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-500 line-through">
                      ${data.product.actual_price.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-md">
                      -{data.product.discount}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <FaPhone className="text-blue-600" size={14} />
                <span className="text-gray-600">Questions about this product?</span>
                <span className="font-semibold text-blue-600">Call 305-248-1003</span>
              </div>
            </div>

            {/* Product Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.product.key_features.rx_required && (
                <div className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <img
                    className="w-10 h-10 mb-2"
                    loading="lazy"
                    src="https://s3.ap-south-1.amazonaws.com/jkare.data/poduct+details+icons/Prescription.svg"
                    alt="Prescription Required"
                  />
                  <span className="text-xs text-center text-gray-700 font-medium">
                    Prescription Required
                  </span>
                </div>
              )}
              
              {warrantyYears && (
                <div className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <img
                    loading="lazy"
                    src={`https://s3.ap-south-1.amazonaws.com/jkare.data/poduct+details+icons/${warrantyYears}.svg`}
                    alt={`${warrantyYears} Year Warranty`}
                    className="w-10 h-10 mb-2"
                  />
                  <span className="text-xs text-center text-gray-700 font-medium">
                    {warrantyYears} Year{warrantyYears === '1' ? '' : 's'} Warranty
                  </span>
                </div>
              )}

              {data.product.key_features["free_shipping"] && (
                <div className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <img
                    className="w-10 h-10 mb-2"
                    loading="lazy"
                    src="https://s3.ap-south-1.amazonaws.com/jkare.data/poduct+details+icons/Free+Shipping.svg"
                    alt="Free Shipping"
                  />
                  <span className="text-xs text-center text-gray-700 font-medium">
                    Free Shipping Over ${env !== null ? env.offer_price : "99"}
                  </span>
                </div>
              )}
              
              {data.product.key_features["pay_over_time"] && (
                <div className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <img
                    className="w-10 h-10 mb-2"
                    loading="lazy"
                    src="https://s3.ap-south-1.amazonaws.com/jkare.data/poduct+details+icons/Pay+Overtime.svg"
                    alt="Pay Over Time"
                  />
                  <span className="text-xs text-center text-gray-700 font-medium">
                    Pay Over Time
                  </span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="p-3 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    disabled={isOutOfStock || quantity <= 1}
                  >
                    <FaMinus size={14} />
                  </button>
                  <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-3 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    disabled={isOutOfStock}
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
                
                <button
                  onClick={cartHandler}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-customPink hover:bg-customBlue text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                  disabled={isOutOfStock}
                >
                  <FaShoppingCart className="mr-2" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 space-y-8">
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {data.product.prod_desc}
              </p>
              
              <div className="space-y-6">
                {data.product.prod_detailed_desc.map((detail, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {Object.values(detail)[1]}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {Object.values(detail)[2]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-right text-gray-600">
              Sold by: <span className="font-semibold text-gray-900">{data.product.vendor_name}</span>
            </p>
          </div>
        </div>

        {/* Related Products */}
        {data?.relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-300 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.relatedProducts.map((product) => (
                <Link
                  href={`/product/${product._id}`}
                  key={product._id}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={product.prod_images[0]}
                      alt={product.prod_name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.prod_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      by {product.brand_name}
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        images={data?.product.prod_images}
        selectedImageIndex={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      
      <ToastContainer />
    </div>
  );
};

export default AdvancedProductDetail;