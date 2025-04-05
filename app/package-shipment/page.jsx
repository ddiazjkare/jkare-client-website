"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Some React Icons (install via `npm i react-icons` if needed)
import { FaShippingFast, FaShoppingCart, FaRegAddressBook } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";

const SHIPPO_API_KEY = process.env.NEXT_PUBLIC_SHIPPO_API_KEY;

export default function BorderfreeStyleCheckout() {
  const router = useRouter();

  // =========================================================
  // 1) State
  // =========================================================
  const [receiver, setReceiver] = useState({
    email: "",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
    address2: "Apt 4B",
    postalCode: "94103",
    city: "San Francisco",
    region: "CA",
    phone: "5551234567",
    location: "US",
  });
  const [parcels, setParcels] = useState([]);
  const [shipment, setShipment] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Tracks whether we’re busy fetching rates or finalizing checkout
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  // For address suggestions (Shippo’s recommended addresses)
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // The “from” address & carrier, fetched from /api/ship-env
  const [envData, setEnvData] = useState(null);

  // =========================================================
  // 2) Load cart & parcels from localStorage on mount
  // =========================================================
  useEffect(() => {
    // 2a) Load Cart
    const medCart = JSON.parse(localStorage.getItem("medCart")) || [];
    setCartItems(medCart);

    // 2b) Convert each cart item to a Shippo parcel
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

    // 2c) Fetch environment data (FROM address, carrier, etc.)
    fetchEnvData();
  }, []);

  // Close the suggestions dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // 2c) Fetch environment data (/api/ship-env) for “from” address
  // =========================================================
  const fetchEnvData = async () => {
    try {
      const response = await fetch("/api/ship-env");
      if (!response.ok) {
        throw new Error("Failed to fetch environment data (/api/ship-env).");
      }
      const data = await response.json();
      // e.g. { name, street1, city, state, zip, country, email, phone, carrier, offer_price }
      setEnvData(data);
    } catch (error) {
      console.error("Error fetching /api/ship-env:", error);
      toast.error("Error fetching environment data.");
    }
  };

  // =========================================================
  // 3) Fetch shipping rates when user clicks “Get Shipping Rates”
  // =========================================================
  const fetchRates = async () => {
    if (!envData) {
      toast.error("No environment data available to fetch shipping rates.");
      return;
    }

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
          name: receiver.firstName + " " + receiver.lastName,
          street1: receiver.address,
          street2: receiver.address2,
          city: receiver.city,
          state: receiver.region,
          zip: receiver.postalCode,
          country: receiver.location,
          email: receiver.email,
          phone: receiver.phone,
        },
        parcels: parcels,
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
      toast.success("Shipping rates fetched!");
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

      // If checkoutObj has no email, fill it from receiver
      if (!checkoutObj.email) checkoutObj.email = receiver.email;

      // Attach shipping rate
      checkoutObj.selectedRate = selectedRate;

      // Build final payload for Stripe
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...checkoutObj,
          threshold : envData.offer_price,
          metadata: {

            ...checkoutObj.metadata,
            shipping_rate: selectedRate.object_id,
          },
          name: receiver.firstName.trim() + " " + receiver.lastName.trim(),
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
  // 5) Address Handlers (with recommended_address for “To” address)
  // =========================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChangeAndSuggest = async (e) => {
    handleInputChange(e);

    // Use “Shippo recommended address” if we want suggestions
    const updatedValue = e.target.value;
    if (updatedValue.length < 5) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const url = new URL("https://api.goshippo.com/v2/addresses/validate");
      url.searchParams.set("name", `${receiver.firstName} ${receiver.lastName}`);
      url.searchParams.set("organization", "Shippo");
      url.searchParams.set("address_line_1", receiver.address ?? "");
      url.searchParams.set("address_line_2", receiver.address2 ?? "");
      url.searchParams.set("city_locality", receiver.city ?? "");
      url.searchParams.set("state_province", receiver.region ?? "");
      url.searchParams.set("postal_code", receiver.postalCode ?? "");
      url.searchParams.set("country_code", receiver.location ?? "US");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommended address from Shippo.");
      }

      const data = await response.json();
      if (data.recommended_address) {
        setAddressSuggestions([data.recommended_address]);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching recommended address:", error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
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
  };

  // =========================================================
  // 6) Compute item subtotal, shipping, tax placeholder, etc.
  // =========================================================
  const itemSubtotal = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  const shippingCost = selectedRate ? parseFloat(selectedRate.amount) : 0;
  const grandTotal = itemSubtotal + shippingCost;

  // For “cheapest” or “fastest” tags
  let minCost = Infinity;
  let minDays = Infinity;
  if (shipment?.rates?.length) {
    shipment.rates.forEach((rate) => {
      const cost = parseFloat(rate.amount) || Infinity;
      const days = rate.estimated_days ?? Infinity;
      if (cost < minCost) minCost = cost;
      if (days < minDays) minDays = days;
    });
  }

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

      <div className="max-w-7xl mx-auto mt-36 px-4 md:px-0 mb-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
          <FaShoppingCart />
          Secure Checkout
        </h1>
        <p className="text-gray-500 mb-6">
          {envData
            ? `You're shipping from ${envData.street1}, ${envData.city}, ${envData.country}`
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={receiver.email}
                    onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                ref={suggestionsRef}
              >
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={receiver.address}
                    onChange={handleAddressChangeAndSuggest}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                  />
                  {/* If fetching suggestions, show them */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 shadow-lg">
                      {addressSuggestions.map((suggest, idx) => (
                        <li
                          key={idx}
                          className="p-2 cursor-pointer hover:bg-gray-50 text-sm"
                          onClick={() => handleSelectSuggestedAddress(suggest)}
                        >
                          {suggest.complete_address
                            ? suggest.complete_address
                            : `${suggest.address_line_1}, ${suggest.city_locality}, ${suggest.state_province} ${suggest.postal_code}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={receiver.address2}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={receiver.postalCode}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={receiver.city}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region (State/Province)
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={receiver.region}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={receiver.phone}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                Click “Get Shipping Rates” to see available delivery options.
              </p>

              {/* Button: "Get Shipping Rates" */}
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
                {isFetchingRates ? "Fetching Rates..." : "Get Shipping Rates"}
              </button>

              {/* If shipping rates have been fetched, show them */}
              {shipment && shipment.rates && shipment.rates.length > 0 && (
                <div
                  className="overflow-x-auto mt-4 animate-fadeIn"
                  // example Tailwind-based fade-in
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
                      {shipment.rates.map((rate) => {
                        const isSelected =
                          selectedRate?.object_id === rate.object_id;
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
                              {cost ? `$${cost.toFixed(2)}` : "—"}
                              {/* Show tags */}
                              <span className="ml-2 inline-block text-xs font-semibold text-gray-600">
                                {cost === minCost && "Cheapest "}
                                {days === minDays && "Fastest"}
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

            {/* Button to proceed to payment */}
            <div className="pt-4 flex flex-col md:flex-row gap-3 justify-end">
              <button
                onClick={handleProceedToPayment}
                disabled={!selectedRate || isCreatingShipment}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 ${
                  (!selectedRate || isCreatingShipment)
                    ? "opacity-80 cursor-not-allowed"
                    : ""
                }`}
              >
                {isCreatingShipment && (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                )}
                {isCreatingShipment ? "Please wait..." : "Proceed to Pay"}
              </button>
            </div>
          </div>

          {/* =========================================== */}
          {/* RIGHT: Order Summary */}
          {/* =========================================== */}
          <div className="w-full md:w-1/3 space-y-6 transition-all duration-300">
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
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 border border-gray-200">
                        {item.images && item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Product Info */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      {/* Price */}
                      <div>
                        <p className="font-semibold text-gray-700">
                          $
                          {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals (Items, Shipping, etc.) */}
            <div className="bg-white border rounded-lg shadow-md p-6">
              {/* Items */}
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Items</p>
                <p className="font-medium text-gray-700">
                  ${itemSubtotal.toFixed(2)}
                </p>
              </div>

              {/* Shipping */}
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Shipping</p>
                <p className="font-medium text-gray-700">
                  {selectedRate
                    ? `$${shippingCost.toFixed(2)}`
                    : "—"}
                </p>
              </div>

              {/* Taxes */}
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Taxes</p>
                <p className="font-medium text-gray-700 text-sm italic">
                  Yet to be calculated
                </p>
              </div>

              <hr className="my-2" />

              {/* Grand Total */}
              <div className="flex justify-between mb-2">
                <p className="text-lg font-semibold text-gray-800">Total</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add any extra animations or transitions you like! */}
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
