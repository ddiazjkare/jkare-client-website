"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lightweight confetti effect using canvas-confetti
// Install via: npm install canvas-confetti
import Confetti from "react-confetti";

import { FaShippingFast, FaShoppingCart, FaRegAddressBook } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";

export default function BorderfreeStyleCheckout() {
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  // =========================================================
  // 1) State
  // =========================================================
  const [receiver, setReceiver] = useState({
    address: "731 Market Street",
    address2: "#200",
    postalCode: "94103",
    city: "San Francisco",
    region: "CA",
    location: "US",
  });
  const [parcels, setParcels] = useState([]);
  const [shipment, setShipment] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Tracks whether we’re busy fetching rates or finalizing checkout
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  // For address suggestions
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const suggestionsRef = useRef(null);

  // Env data (from /api/ship-env)
  const [envData, setEnvData] = useState(null);

  // For free shipping
  const [isFreeShipping, setIsFreeShipping] = useState(false);

  // =========================================================
  // 2) Load cart & fetch env data on mount
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
        length,
        width,
        height,
        weight,
        mass_unit: massUnit,
        distance_unit: distUnit,
      };
    });
    setParcels(formattedParcels);

    // Fetch environment data
    fetchEnvData();
  }, []);

  // Close suggestions dropdown if user clicks outside
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

  // 2a) Fetch environment data
  const fetchEnvData = async () => {
    try {
      const response = await fetch("/api/ship-env");
      if (!response.ok) {
        throw new Error("Failed to fetch environment data (/api/ship-env).");
      }
      const data = await response.json();
      setEnvData(data);
    } catch (error) {
      console.error("Error fetching /api/ship-env:", error);
      toast.error("Error fetching environment data.");
    }
  };

  // =========================================================
  // 3) Automatic shipping-rate fetch (once envData & cart are ready)
  // =========================================================
  useEffect(() => {
    // If we have both envData and the cart loaded, fetch shipping rates automatically
    if (envData && cartItems.length > 0) {
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envData, cartItems]);

  const fetchRates = async () => {
    if (!envData) return;

    try {
      setIsFetchingRates(true);
      setSelectedRate(null);

      const shipmentData = {
        address_from: {
          name: envData.name,
          street1: envData.street1,
          city: envData.city,
          state: envData.state,
          zip: envData.zip,
          country: envData.country,
          email: envData.email,
          phone: envData.phone,
        },
        address_to: {
          name: (receiver.firstName ?? "") + " " + (receiver.lastName ?? ""),
          street1: receiver.address,
          street2: receiver.address2,
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
  // 4) Stripe Checkout
  // =========================================================
  const handleProceedToPayment = async () => {
    if (!selectedRate) {
      toast.warn("Please select a delivery option before proceeding.");
      return;
    }
    try {
      setIsCreatingShipment(true);

      let checkoutObj = JSON.parse(localStorage.getItem("checkoutStorage")) || {};

      // If no email in checkoutObj, fill from receiver
      if (!checkoutObj.email) checkoutObj.email = receiver.email;

      // Attach shipping rate
      checkoutObj.selectedRate = selectedRate;

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...checkoutObj,
          threshold: parseFloat(envData?.offer_price ?? 0),
          metadata: {
            ...checkoutObj.metadata,
            shipping_rate: selectedRate.object_id,
          },
          name: (receiver.firstName ?? "").trim() + " " + (receiver.lastName ?? "").trim(),
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
  // 5) Address Handlers
  // =========================================================
  const handleAddressInput = async (e) => {
    const { name, value } = e.target;
    const updatedReceiver = { ...receiver, [name]: value };
    setReceiver(updatedReceiver);

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
      // Our own server route
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

      if (data.recommended_address) {
        setAddressSuggestions([data.recommended_address]);
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

    // Refetch shipping rates with updated address
    fetchRates();
  };

  // =========================================================
  // 6) Compute itemSubtotal, free shipping logic, confetti, etc.
  // =========================================================
  const itemSubtotal = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Check if user qualifies for free shipping:
  useEffect(() => {
    if (!envData) return;
    const threshold = parseFloat(envData.offer_price || 0);
    const qualifies = itemSubtotal >= threshold;
  
    if (qualifies && !isFreeShipping) {
      setIsFreeShipping(true);
      toast.success("Hurray! You got free shipping!");
      setShowConfetti(true);
      // Optionally, hide confetti after a short delay
      setTimeout(() => setShowConfetti(false), 6000);
    } else if (!qualifies && isFreeShipping) {
      setIsFreeShipping(false);
    }
  }, [envData, itemSubtotal, isFreeShipping]);

  // Automatic free shipping row
  let displayedRates = shipment?.rates || [];
  if (isFreeShipping) {
    const freeRow = {
      object_id: "jkare_free_shipping",
      servicelevel: { display_name: "JKARE Shipment" },
      estimated_days: 7, // "1 week approx~"
      amount: "0.00",
    };
    displayedRates = [freeRow, ...displayedRates];
  }

  // If we have free shipping, default-select it if not already chosen
  useEffect(() => {
    if (isFreeShipping && (!selectedRate || selectedRate.object_id !== "jkare_free_shipping")) {
      setSelectedRate({
        object_id: "jkare_free_shipping",
        servicelevel: { display_name: "JKARE Shipment" },
        estimated_days: 7,
        amount: "0.00",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFreeShipping]);

  // Calculate shipping cost
  const shippingCost = selectedRate ? parseFloat(selectedRate.amount) : 0;
  const grandTotal = itemSubtotal + shippingCost;

  // For cheapest/fastest tags
  let minCost = Infinity;
  let minDays = Infinity;
  if (shipment?.rates?.length) {
    shipment.rates.forEach((r) => {
      const cost = parseFloat(r.amount) || Infinity;
      const days = r.estimated_days ?? Infinity;
      if (cost < minCost) minCost = cost;
      if (days < minDays) minDays = days;
    });
  }

  // =========================================================
  // 7) Render
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
        numberOfPieces={500}
        gravity={0.1}
        recycle={false}
      />
    )}

      <div className="max-w-7xl mx-auto mt-36 px-4 md:px-0 mb-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
          <FaShoppingCart />
          Secure Checkout
        </h1>
        <p className="text-gray-500 mb-6">
          {envData
            ? `You're order will be shipped from ${envData.street1}, ${envData.city}, ${envData.country}`
            : "Loading default warehouse address..."}
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* =========================================== */}
          {/* LEFT: Delivery & Shipping Method */}
          {/* =========================================== */}
          <div className="w-full md:w-2/3 bg-white border rounded-lg shadow-md p-6 space-y-6 transition-all duration-300">
            {/* 1) Delivery / Address Info */}
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <FaRegAddressBook />
                Delivery Address
              </h2>

              {/* Email / First / Last */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={receiver.email}
                    onChange={(e) =>
                      setReceiver((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={receiver.firstName}
                      onChange={(e) =>
                        setReceiver((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={receiver.lastName}
                      onChange={(e) =>
                        setReceiver((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address Lines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" ref={suggestionsRef}>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={receiver.address}
                    onChange={handleAddressInput}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                  />
                  {/* Suggestions */}
                  {showSuggestions && (
                    <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 shadow-lg text-sm">
                      {isFetchingAddress ? (
                        <li className="p-2 text-gray-500 italic">
                          Fetching address...
                        </li>
                      ) : addressSuggestions.length > 0 ? (
                        addressSuggestions.map((suggest, idx) => (
                          <li
                            key={idx}
                            className="p-2 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSelectSuggestedAddress(suggest)}
                          >
                            {suggest.complete_address || "Unknown address"}
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500 italic">
                          No recommended address found.
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={receiver.address2}
                    onChange={handleAddressInput}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* City / Postal / Region */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={receiver.postalCode}
                    onChange={handleAddressInput}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={receiver.city}
                    onChange={handleAddressInput}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region (State/Province)
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={receiver.region}
                    onChange={handleAddressInput}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Phone / Country */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={receiver.phone}
                    onChange={(e) =>
                      setReceiver((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Country)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={receiver.location}
                    onChange={(e) =>
                      setReceiver((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 2) Delivery Method (rates) */}
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <MdOutlineLocalShipping />
                Delivery Method
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                Shipping rates are automatically fetched. 
              </p>

              {/* If you still want a "Refresh" button: */}
              <button
                onClick={fetchRates}
                disabled={isFetchingRates}
                className={`bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 ${
                  isFetchingRates ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isFetchingRates && (
                  <svg
                    className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    viewBox="0 0 24 24"
                  />
                )}
                <FaShippingFast />
                {isFetchingRates ? "Fetching Rates..." : "Refresh Rates"}
              </button>

              {shipment && displayedRates.length > 0 && (
                <div
                  className="overflow-x-auto mt-4 animate-fadeIn"
                  style={{ animationDuration: "0.7s" }}
                >
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100">
                        <th className="py-2 px-3 text-left">Delivery Method</th>
                        <th className="py-2 px-3 text-left">Est. Arrival</th>
                        <th className="py-2 px-3 text-left">Shipping Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedRates.map((rate) => {
                        const isSelected = selectedRate?.object_id === rate.object_id;
                        const cost = parseFloat(rate.amount);
                        const days = rate.estimated_days;

                        return (
                          <tr
                            key={rate.object_id}
                            onClick={() => setSelectedRate(rate)}
                            className={`border-b cursor-pointer transition-colors duration-150 ${
                              isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name="shippingRate"
                                  checked={isSelected}
                                  onChange={() => setSelectedRate(rate)}
                                  className="mr-2"
                                />
                                <div>
                                  <div className="font-semibold">
                                    {rate.servicelevel?.display_name ||
                                      rate.servicelevel?.name ||
                                      rate.servicelevel?.token}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {rate.servicelevel?.token?.includes("EXPRESS")
                                      ? "No additional import charges at delivery"
                                      : "Import charges collected upon delivery"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              {days ? `${days} business days` : "—"}
                            </td>
                            <td className="py-3 px-3">
                              {cost ? `$${cost.toFixed(2)}` : "$0.00"}
                              <span className="ml-2 inline-block text-xs font-semibold text-gray-600">
                                {cost === 0 && "Free "}
                                {/* Mark cheapest/fastest among the real rates */}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* =========================================== */}
          {/* RIGHT: Order Summary (Sticky on Scroll) */}
          {/* =========================================== */}
          <div className="w-full md:w-1/3 space-y-6 transition-all duration-300 md:sticky md:top-20 h-fit">
            <div className="bg-white border rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
                <FaShoppingCart />
                Your Order
              </h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">No items in cart.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border-b pb-4 animate-fadeIn"
                    >
                      <div className="w-16 h-16 flex-shrink-0 border border-gray-200">
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
                        <p className="text-sm font-medium text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="bg-white border rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Items</p>
                <p className="font-medium text-gray-700">${itemSubtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Shipping</p>
                {isFreeShipping ? (
                  <p className="font-medium text-gray-700">Free Shipping</p>
                ) : selectedRate ? (
                  <p className="font-medium text-gray-700">${shippingCost.toFixed(2)}</p>
                ) : (
                  <p className="font-medium text-gray-700">—</p>
                )}
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Taxes</p>
                <p className="font-medium text-gray-700 text-sm italic">Yet to be calculated</p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <p className="text-lg font-semibold text-gray-800">Total</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${(itemSubtotal + shippingCost).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Move the Proceed to Pay button below the summary */}
            <div className="flex justify-end">
              <button
                onClick={handleProceedToPayment}
                disabled={!selectedRate || isCreatingShipment}
                className={`bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium px-5 py-4 rounded-md flex items-center justify-center w-full gap-2 transition-colors duration-200 ${
                  (!selectedRate || isCreatingShipment) ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isCreatingShipment && (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full " />
                )}
                {isCreatingShipment ? "Please wait..." : "Proceed to Pay"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* A simple fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}
