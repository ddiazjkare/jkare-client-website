"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "../../components/ui/Alert";

const staticTrackingData = {
  tracking_number: "SHIPPO_TRANSIT",
  carrier: "shippo",
  tracking_status: {
    status_date: "2025-03-19T17:00:35.846Z",
    status_details: "Your shipment has departed from the origin.",
    location: {
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      country: "US",
    },
    status: "TRANSIT",
  },
  tracking_history: [
    {
      status_date: "2025-03-18T13:00:35.846Z",
      status_details:
        "The carrier has received the electronic shipment information.",
      location: null,
      status: "UNKNOWN",
    },
    {
      status_date: "2025-03-19T17:00:35.846Z",
      status_details: "Your shipment has departed from the origin.",
      location: {
        city: "San Francisco",
        state: "CA",
        zip: "94103",
        country: "US",
      },
      status: "TRANSIT",
    },
  ],
};

function OrderHistory({ orders = [], email }) {
  /* ---------------- state & helpers ---------------- */
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.order_date) - new Date(a.order_date)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrders, setCurrentOrders] = useState(sortedOrders);
  const [errMsg, setErrMsg] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  /* ---- pagination ---- */
  const ordersPerPage = 4;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const orderList = currentOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(currentOrders.length / ordersPerPage);
  const handlePageChange = (num) => setCurrentPage(num);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);

  const resetDate = async () => {
    setFromDate("");
    setToDate("");
    try {
      const res = await fetch(`/api/order/${email}`);
      const data = await res.json();
      data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setCurrentOrders(data);
      setSearchTerm("");
      setCurrentPage(1);
    } catch (error) {
      setErrMsg(error.message || "Something went wrong");
      setTimeout(() => setErrMsg(null), 3000);
    }
  };

  const handleDownloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  /* ---- searching ---- */
  const searchByID = async (val) => {
    setSearchTerm(val);
    try {
      const endpoint =
        val.length > 0
          ? `/api/order/${email}?id=${val}`
          : `/api/order/${email}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setCurrentOrders(data);
      setCurrentPage(1);
    } catch (error) {
      setErrMsg(error.message || "Something went wrong");
      setTimeout(() => setErrMsg(null), 3000);
    }
  };

  const searchByDate = async () => {
    if (fromDate === "" || toDate === "") {
      setErrMsg("Date must be selected!");
      setTimeout(() => setErrMsg(null), 3000);
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      setErrMsg("Start date cannot be after end date!");
      setTimeout(() => setErrMsg(null), 3000);
      return;
    }
    try {
      const from = formatDate(new Date(fromDate));
      const to = formatDate(new Date(toDate));
      const res = await fetch(`/api/order/${email}?from=${from}&to=${to}`);
      const data = await res.json();
      data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setCurrentOrders(data);
      setCurrentPage(1);
    } catch (error) {
      setErrMsg(error.message || "Something went wrong");
      setTimeout(() => setErrMsg(null), 3000);
    }
  };

  const handleTrackShipment = (orderId) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-gradient-to-r from-amber-400 to-yellow-500";
      case "completed":
      case "received":
        return "bg-gradient-to-r from-emerald-400 to-green-500";
      case "cancelled":
        return "bg-gradient-to-r from-red-400 to-red-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mt-10"
      >
        {errMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert message={errMsg} closeHandler={() => setErrMsg(null)} />
          </motion.div>
        )}

        {/* --- Modern Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Your Order History
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track and manage all your orders in one beautiful place
          </p>
        </motion.div>

        {/* --- Enhanced Search & Filters --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8"
        >
          <div className="flex flex-col xl:flex-row xl:items-end gap-6">
            {/* Search by ID */}
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Order
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter Order ID..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70"
                  value={searchTerm}
                  onChange={(e) => searchByID(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-nd">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={searchByDate}
                >
                  Search
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={resetDate}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Order Count --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p className="text-blue-800 font-semibold text-center">
              Showing {currentOrders.length} order{currentOrders.length !== 1 && "s"}
            </p>
          </div>
        </motion.div>

        {/* --- Order Cards --- */}
        <div className="space-y-8">
          {orderList.length > 0 ? (
            orderList.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-6 py-5 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">ORDER PLACED</span>
                        <p className="text-gray-700 mt-1">{order.order_date}</p>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">ORDER ID</span>
                        <p className="text-gray-700 mt-1 font-mono bg-gray-100/50 px-2 py-1 rounded-md inline-block">
                          #{order.order_id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <span className={`${getStatusColor(order.prescription_status)} text-white text-xs font-bold px-4 py-2 rounded-full text-center shadow-lg`}>
                        Prescription: {order.prescription_status}
                      </span>
                      <span className={`${getStatusColor(order.order_status)} text-white text-xs font-bold px-4 py-2 rounded-full text-center shadow-lg`}>
                        Order: {order.order_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Items
                  </h3>
                  
                  {/* Mobile: Card Layout */}
                  <div className="block lg:hidden space-y-4">
                    {order.items.map((product, idx) => (
                      <div key={idx} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                        <div className="flex gap-4">
                          <Link href={`/product/${product.product_id}`}>
                            <img
                              src={product.image}
                              alt={product.product_name}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </Link>
                          
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${product.product_id}`}>
                              <h4 className="font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                {product.product_name}
                              </h4>
                            </Link>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Qty:</span>
                                <span className="ml-1 font-semibold">{product.quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Price:</span>
                                <span className="ml-1 font-semibold">${product.price}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total:</span>
                                <span className="ml-1 font-semibold text-green-600">
                                  ${(product.quantity * product.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            
                            {product.prescription_file && (
                              <button
                                onClick={() => handleDownloadFile(product.prescription_file, `${product.product_name}_prescription.pdf`)}
                                className="mt-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                              >
                                📄 Download Prescription
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Table Layout */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          <th className="text-left pb-3 font-semibold text-gray-700">#</th>
                          <th className="text-left pb-3 font-semibold text-gray-700">Product</th>
                          <th className="text-left pb-3 font-semibold text-gray-700">Details</th>
                          <th className="text-center pb-3 font-semibold text-gray-700">Qty</th>
                          <th className="text-left pb-3 font-semibold text-gray-700">Price</th>
                          <th className="text-left pb-3 font-semibold text-gray-700">Total</th>
                          <th className="text-center pb-3 font-semibold text-gray-700">Prescription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((product, idx) => (
                          <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 text-gray-600 font-medium">{idx + 1}</td>
                            <td className="py-4">
                              <Link href={`/product/${product.product_id}`}>
                                <img
                                  src={product.image}
                                  alt={product.product_name}
                                  width={60}
                                  height={60}
                                  className="rounded-lg hover:scale-110 transition-transform duration-200 shadow-md"
                                />
                              </Link>
                            </td>
                            <td className="py-4 max-w-xs">
                              <Link href={`/product/${product.product_id}`}>
                                <h4 className="font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                                  {product.product_name}
                                </h4>
                              </Link>
                            </td>
                            <td className="py-4 text-center">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {product.quantity}
                              </span>
                            </td>
                            <td className="py-4 font-semibold text-gray-700">${product.price}</td>
                            <td className="py-4 font-bold text-green-600">
                              ${(product.quantity * product.price).toFixed(2)}
                            </td>
                            <td className="py-4 text-center">
                              {product.prescription_file && (
                                <button
                                  onClick={() => handleDownloadFile(product.prescription_file, `${product.product_name}_prescription.pdf`)}
                                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                                >
                                  📄 Download
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-6 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Billing Address */}
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Billing Address
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {order.billing_address.line1}<br />
                        {order.billing_address.city}, {order.billing_address.state}<br />
                        {order.billing_address.country} - {order.billing_address.postal_code}
                      </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {order.shipping_address.line1}<br />
                        {order.shipping_address.city}, {order.shipping_address.state}<br />
                        {order.shipping_address.country} - {order.shipping_address.postal_code}
                      </p>
                    </div>

                    {/* Price & Actions */}
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-100 md:col-span-2 lg:col-span-1">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Order Summary
                      </h4>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">${order.sub_amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-semibold text-red-600">-${order.discount_amount}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t border-gray-200">
                          <span>Total:</span>
                          <span>${order.total_amount}</span>
                        </div>
                      </div>
                      
                      {order.order_status === "Completed" && (
                        <button
                          onClick={() => handleTrackShipment(order.order_id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Track Shipment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            /* -------- No Orders State -------- */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center py-16 px-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your order history here!
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Shopping
                </Link>
              </div>
            </motion.div>
          )}
        </div>

      {/* ------- pagination ------- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`px-4 py-2 rounded-md transition-colors ${currentPage === n
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
              onClick={() => handlePageChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {/* -------------- tracking modal -------------- */}
      <AnimatePresence>
        {showTrackingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
          >
            {/* modal card */}
            <motion.div
              initial={{ scale: 0.85, y: 32 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 32 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white w-[95%] sm:w-[90%] md:w-[80%] lg:max-w-lg rounded-lg shadow-lg p-5 sm:p-6"
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowTrackingModal(false)}
              >
                &times;
              </button>

              <h2 className="text-lg sm:text-xl font-bold mb-4 border-b pb-2">
                Tracking Details
              </h2>

              <div className="space-y-2 text-sm sm:text-base">
                <p>
                  <strong>Order ID:</strong> {selectedOrderId}
                </p>
                <p>
                  <strong>Tracking #:</strong>{" "}
                  {staticTrackingData.tracking_number}
                </p>
                <p>
                  <strong>Carrier:</strong> {staticTrackingData.carrier}
                </p>
                <p>
                  <strong>Current Status:</strong>{" "}
                  {staticTrackingData.tracking_status.status}
                </p>
              </div>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">
                Shipment Timeline
              </h3>

              <div className="max-h-60 overflow-y-auto pr-2">
                {staticTrackingData.tracking_history.map((hist, idx) => (
                  <div key={idx} className="relative pl-10 mb-8 text-xs sm:text-sm">
                    {/* bullet */}
                    <div className="absolute left-2 top-4 w-3 h-3 rounded-full bg-blue-500" />
                    {/* vertical line */}
                    {idx <
                      staticTrackingData.tracking_history.length - 1 && (
                        <div className="absolute left-[3.5px] top-4 h-full border-l-2 border-blue-300" />
                      )}
                    <p className="text-gray-500 mb-1">
                      {new Date(hist.status_date).toLocaleString()}
                    </p>
                    <p className="font-semibold">{hist.status}</p>
                    <p>{hist.status_details}</p>
                    {hist.location && (
                      <p className="text-gray-500 mt-1">
                        {hist.location.city}, {hist.location.state}{" "}
                        {hist.location.zip}, {hist.location.country}
                      </p>
                    )}
                  </div>
                ))} 
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </div>
  );
}

export default OrderHistory;