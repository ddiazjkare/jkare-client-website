"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import { FaShippingFast, FaShoppingCart, FaRegAddressBook, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function Package({ env }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  // =========================================================
  // 1) State
  // =========================================================
  const [receiver, setReceiver] = useState({
    name: "",
    email: "",
    phone: "",
    address: "456 Maple St",
    address2: "# 200",
    postalCode: "33160",
    city: "Florida",
    region: "CA",
    location: "US",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [parcels, setParcels] = useState([]);
  const [shipment, setShipment] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Tracks whether we're busy fetching rates or finalizing checkout
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  // For address suggestions
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const suggestionsRef = useRef(null);

  // For free shipping
  const [isFreeShipping, setIsFreeShipping] = useState(false);

  // =========================================================
  // 2) Validation Functions
  // =========================================================
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const validatePhone = (phone) => {
  //   const phoneRegex = /^\d{10,15}$/; // Only numbers, 10-15 digits
  //   return phoneRegex.test(phone.replace(/\s/g, ''));
  // };
  const validatePhone = (phone) => {
    if (!phone || typeof phone !== "string" || phone.trim() === "") return false;
    return isValidPhoneNumber(phone);
  };

  const validateForm = () => {
    const errors = {};

    if (!receiver.name.trim()) {
      errors.name = "Name is required";
    }

    if (!receiver.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(receiver.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!receiver.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(receiver.phone)) {
      errors.phone = "Please enter a valid phone number (numbers only)";
    }

    if (!receiver.address.trim()) {
      errors.address = "Address is required";
    }

    if (!receiver.city.trim()) {
      errors.city = "City is required";
    }

    if (!receiver.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }

    if (!receiver.region.trim()) {
      errors.region = "State/Province is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return receiver.name.trim() &&
      validateEmail(receiver.email) &&
      validatePhone(receiver.phone) &&
      receiver.address.trim() &&
      receiver.city.trim() &&
      receiver.postalCode.trim() &&
      receiver.region.trim() &&
      selectedRate;
  };

  // =========================================================
  // 3) Load cart & fetch env data on mount
  // =========================================================
  useEffect(() => {
    // Load cart
    const medCart = JSON.parse(localStorage.getItem("medCart")) || [];
    setCartItems(medCart);

    // Convert cart items -> Shippo parcels
    const formattedParcels = medCart.map((item) => {
      const length = item.parcel_info?.length ?? 10;
      const width = item.parcel_info?.width ?? 5;
      const height = item.parcel_info?.height ?? 2;
      const weight = item.parcel_info?.weight ?? 1;
      const massUnit = item.parcel_info?.mass_unit ?? "lb";
      const distUnit = item.parcel_info?.distance_unit ?? "in";
      return {
        length: String(length),
        width: String(width),
        height: String(height),
        weight: String(weight),
        mass_unit: String(massUnit),
        distance_unit: String(distUnit),
      };
    });
    setParcels(formattedParcels);

    // Fetch environment data
    // fetchEnvData();
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('closeCart'));
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // 4) Automatic shipping-rate fetch
  // =========================================================
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchRates();
    }
  }, [cartItems]);
  const fetchRates = async () => {
    if (!env) return;

    try {
      setIsFetchingRates(true);
      setSelectedRate(null);

      const shipmentData = {
        address_from: {
          name: env.name,
          street1: env.street1,
          city: env.city,
          state: env.state,
          zip: env.zip,
          country: env.country,
          email: env.email,
          phone: env.phone,
        },
        address_to: {
          name: receiver.name,
          street1: receiver.address,
          city: receiver.city,
          state: receiver.region,
          zip: receiver.postalCode,
          country: receiver.location,
          email: receiver.email,
          phone: receiver.phone,
        },
        parcels,
        carrier_accounts: null,
        shipment_date: new Date().toISOString().replace("Z", "+00:00"),
      };
      console.log("parcels payload", env);
      const response = await fetch("/api/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipmentData),
      });
      const data = await response.json();

      if (data.error) {
        toast.error(`Failed to fetch rates: ${data.error}`);
        setShipment(null);
        return;
      }
      setShipment(data);
    } catch (error) {
      toast.error("Error fetching rates: " + error.message);
      console.error("Error fetching rates:", error);
      setShipment(null);
    } finally {
      setIsFetchingRates(false);
    }
  };

  // =========================================================
  // 5) Stripe Checkout
  // =========================================================
  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      toast.warn("Please fill in all required fields correctly.");
      return;
    }

    if (!selectedRate) {
      toast.warn("Please select a delivery option before proceeding.");
      return;
    }

    try {
      setIsCreatingShipment(true);

      let checkoutObj = JSON.parse(localStorage.getItem("checkoutStorage")) || {};

      if (!checkoutObj.email) checkoutObj.email = receiver.email;
      checkoutObj.selectedRate = selectedRate;

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...checkoutObj,
          threshold: parseFloat(env?.offer_price ?? 0),
          metadata: {
            ...checkoutObj.metadata,
            shipping_rate: selectedRate.object_id,
            carrier: selectedRate.provider,
            card_limit: env.card_limit
          },
          name: receiver.name.trim(),
          address: {
            line1: receiver.address,
            line2: receiver.address2,
            city: receiver.city,
            state: receiver.region,
            postal_code: receiver.postalCode,
            country: receiver.location,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate Stripe checkout.");
      }

      const { session } = await response.json();
      router.push(session.url);
    } catch (error) {
      toast.error("Error redirecting to payment: " + error.message);
      console.error(error);
    } finally {
      setIsCreatingShipment(false);
    }
  };

  // =========================================================
  // 6) Input Handlers
  // =========================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For phone, only allow numbers
    if (name === 'phone') {
      const numbersOnly = value.replace(/\D/g, '');
      setReceiver(prev => ({ ...prev, [name]: numbersOnly }));
    } else {
      setReceiver(prev => ({ ...prev, [name]: value }));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressInput = async (e) => {
    const { name, value } = e.target;
    const updatedReceiver = { ...receiver, [name]: value };
    setReceiver(updatedReceiver);

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Show suggestions
    setShowSuggestions(true);

    const totalChars =
      updatedReceiver.address.length +
      updatedReceiver.address2.length +
      updatedReceiver.city.length +
      updatedReceiver.region.length +
      updatedReceiver.postalCode.length;

    if (totalChars < 3) {
      setAddressSuggestions([]);
      setIsFetchingAddress(false);
      return;
    }

    setIsFetchingAddress(true);
    try {
      const apiUrl = `/api/shippo-validate?address_line_1=${encodeURIComponent(
        updatedReceiver.address
      )}&address_line_2=${encodeURIComponent(
        updatedReceiver.address2
      )}&city_locality=${encodeURIComponent(
        updatedReceiver.city
      )}&state_province=${encodeURIComponent(
        updatedReceiver.region
      )}&postal_code=${encodeURIComponent(
        updatedReceiver.postalCode
      )}&country_code=${encodeURIComponent(updatedReceiver.location ?? "US")}`;

      const response = await fetch(apiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to validate address via /api/shippo-validate.");
      }
      const data = await response.json();

      if (data.validation?.shippo_response?.recommended_address) {
        setAddressSuggestions([data.validation.shippo_response.recommended_address]);
      } else {
        setAddressSuggestions([]);
      }
    } catch (error) {
      console.error("Error validating address:", error);
      setAddressSuggestions([]);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSelectSuggestedAddress = (suggestion) => {
    setReceiver((prev) => ({
      ...prev,
      address: suggestion.address_line_1 || prev.address,
      address2: suggestion.address_line_2 || prev.address2,
      city: suggestion.city_locality || prev.city,
      region: suggestion.state_province || prev.region,
      postalCode: suggestion.postal_code || prev.postalCode,
      location: suggestion.country_code || prev.location,
    }));
    setShowSuggestions(false);
    fetchRates();
  };

  // =========================================================
  // 7) Free shipping logic
  // =========================================================
  const itemSubtotal = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  useEffect(() => {
    if (!env) return;
    const threshold = parseFloat(env.offer_price || 0);
    const qualifies = itemSubtotal >= threshold;

    if (qualifies && !isFreeShipping) {
      setIsFreeShipping(true);
      toast.success("Hurray! You got free shipping!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else if (!qualifies && isFreeShipping) {
      setIsFreeShipping(false);
    }
  }, [env, itemSubtotal, isFreeShipping]);

  // Prepare displayed rates with free shipping option
  let displayedRates = shipment?.rates ? [...shipment.rates] : [];
  let freeShippingRate = null;

  if (isFreeShipping && shipment?.rates?.length > 0) {
    const randomIndex = Math.floor(Math.random() * shipment.rates.length);
    const randomRateId = shipment.rates[randomIndex].object_id;
    freeShippingRate = {
      object_id: randomRateId,
      servicelevel: { display_name: "JKARE Free Shipping" },
      estimated_days: 7,
      amount: "0.00",
      isFree: true,
    };
    displayedRates = [freeShippingRate, ...displayedRates];
  }

  // Auto-select free shipping when available
  useEffect(() => {
    if (isFreeShipping && freeShippingRate && (!selectedRate || !selectedRate.isFree)) {
      setSelectedRate(freeShippingRate);
    }
  }, [isFreeShipping, shipment]);

  const shippingCost = selectedRate ? parseFloat(selectedRate.amount) : 0;
  const grandTotal = itemSubtotal + shippingCost;

  // =========================================================
  // 8) Render
  // =========================================================
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          gravity={0.1}
          recycle={false}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {env
                ? `Shipping from ${env.city}, ${env.country}`
                : "Loading shipping information..."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Contact Information
                </h2>
                {/* Note about email for tracking */}
                <div className="mb-4">
                  <span className="text-xs text-yellow-700 bg-yellow-100 px-3 py-2 rounded block">
                    <strong>Note:</strong> Please ensure the email address you provide is correct. You will only be able to track and view your order by logging in with this same email on our website.
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={receiver.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your full name"
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaEnvelope className="inline mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={receiver.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="your@email.com"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaPhone className="inline mr-1" />
                        Phone Number *
                      </label>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={receiver.phone}
                        onChange={value => setReceiver(prev => ({ ...prev, phone: value || "" }))}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        disabled={isCreatingShipment}
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  Shipping Address
                </h2>

                <div className="space-y-4" ref={suggestionsRef}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={receiver.address}
                        onChange={handleAddressInput}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.address ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="123 Main Street"
                      />
                      {validationErrors.address && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                      )}

                      {/* Address Suggestions */}
                      {showSuggestions && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                          {isFetchingAddress ? (
                            <div className="p-3 text-sm text-gray-500">Validating address...</div>
                          ) : addressSuggestions.length > 0 ? (
                            addressSuggestions.map((suggest, idx) => (
                              <div
                                key={idx}
                                className="p-3 text-sm cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSelectSuggestedAddress(suggest)}
                              >
                                {suggest.complete_address || "Suggested address"}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-sm text-gray-500">No suggestions found</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment/Suite
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={receiver.address2}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Apt 123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={receiver.city}
                        onChange={handleAddressInput}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="San Francisco"
                      />
                      {validationErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={receiver.region}
                        onChange={handleAddressInput}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.region ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="CA"
                      />
                      {validationErrors.region && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.region}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={receiver.postalCode}
                        onChange={handleAddressInput}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="94103"
                      />
                      {validationErrors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={receiver.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="US"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MdOutlineLocalShipping className="text-blue-600" />
                    Shipping Options
                  </h2>
                  <button
                    onClick={fetchRates}
                    disabled={isFetchingRates}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    {isFetchingRates ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaShippingFast />
                        Refresh Rates
                      </>
                    )}
                  </button>
                </div>

                {displayedRates.length > 0 ? (
                  <div className="space-y-3">
                    {displayedRates.map((rate, idx) => {
                      const isSelected = selectedRate?.object_id === rate.object_id &&
                        selectedRate?.amount === rate.amount;
                      const cost = parseFloat(rate.amount);

                      return (
                        <div
                          key={rate.isFree ? "free-shipping" : rate.object_id}
                          onClick={() => setSelectedRate(rate)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="shippingRate"
                                checked={isSelected}
                                onChange={() => setSelectedRate(rate)}
                                className="text-blue-600"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {rate.servicelevel?.display_name || 'Standard Shipping'}
                                  {rate.isFree && (
                                    <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                      FREE
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {rate.estimated_days
                                    ? `${rate.estimated_days} business days`
                                    : 'Standard delivery'}
                                </div>
                              </div>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              ${cost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    {isFetchingRates ? 'Loading shipping options...' : 'No shipping options available'}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaShoppingCart className="text-blue-600" />
                  Order Summary
                </h2>

                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items in cart</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                          <div className="w-16 h-16 flex-shrink-0 border border-gray-200 mr-2">
                            {item.images && item.images[0] ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Free shipping promotion */}
                    {env && !isFreeShipping && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>🚚 Free Shipping Available!</strong>
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Spend ${(parseFloat(env.offer_price) - itemSubtotal).toFixed(2)} more
                          to get free shipping!
                        </p>
                        <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((itemSubtotal / parseFloat(env.offer_price)) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Order totals */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${itemSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          {selectedRate ? (
                            selectedRate.isFree ? (
                              <span className="text-green-600">FREE</span>
                            ) : (
                              `$${shippingCost.toFixed(2)}`
                            )
                          ) : (
                            'TBD'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                        <span>Total:</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout button */}
                    <button
                      onClick={handleProceedToPayment}
                      disabled={isCreatingShipment}
                      className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${!isCreatingShipment
                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                        : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {isCreatingShipment ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing...
                        </div>
                      ) : (
                        `Proceed to Payment - $${grandTotal.toFixed(2)}`
                      )}
                    </button>

                    {/* Security badges */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Secure SSL
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <FaShippingFast className="mr-2 text-blue-600" />
                Fast & Secure Delivery
              </div>

              <div className="flex items-center">
                <FaRegAddressBook className="mr-2 text-purple-600" />
                Address Validation
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}