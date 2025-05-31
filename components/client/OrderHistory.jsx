"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "../../components/ui/Alert";

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

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

  const filterOrdersById = (val) => {
    setSearchTerm(val);
    if (val.trim() === "") {
      setCurrentOrders(sortedOrders);
      return;
    }
    const filtered = sortedOrders.filter((order) =>
      order.order_id.toLowerCase().includes(val.toLowerCase())
    );
    setCurrentOrders(filtered);
    setCurrentPage(1);
  };

  // Enhanced tracking function with dynamic API call
  const handleTrackShipment = async (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
    setTrackingLoading(true);
    setTrackingData(null);

    try {
      if (!order.carrier || !order.tracking_number) {
        throw new Error("Tracking information not available for this order");
      }

      const response = await fetch(
        `http://localhost:3000/api/track?carrier=${order.carrier}&tracking=${order.tracking_number}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracking information");
      }

      const data = await response.json();
      setTrackingData(data);
    } catch (error) {
      setErrMsg(error.message || "Failed to fetch tracking information");
      setTimeout(() => setErrMsg(null), 5000);
    } finally {
      setTrackingLoading(false);
    }
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
      case "transit":
        return "bg-gradient-to-r from-blue-400 to-blue-500";
      case "delivered":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const getTrackingStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "unknown":
        return "🔍";
      case "transit":
        return "🚚";
      case "delivered":
        return "📦";
      case "exception":
        return "⚠️";
      default:
        return "📍";
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
            Track and manage all your orders in one place
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
                  onChange={(e) => filterOrdersById(e.target.value)}
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
                        <p className="text-gray-700 mt-1">{order.order_id}</p>
                      </div>
                      {/* {order.tracking_number && (
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">TRACKING #</span>
                          <p className="text-gray-700 mt-1">{order.tracking_number}</p>
                        </div>
                      )} */}
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
                              <a
                                href={product.prescription_file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-block"
                              >
                                👁️ View File
                              </a>
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
                                <a
                                  href={product.prescription_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-block"
                                >
                                  👁️ Download File
                                </a>
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
                          <span className="font-semibold">${order.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price Discount:</span>
                          <span className="font-semibold text-red-600">-${order.discount_amount}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t border-gray-200">
                          <span>Total:</span>
                          <span>
                            ${order.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {(order.order_status === "Completed" && order.tracking_number && order.carrier) && (
                        <button
                          onClick={() => handleTrackShipment(order)}
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
                  You haven't placed any orders yet. Start shopping to discover amazing products!
                </p>
                <Link href="/product">
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Start Shopping
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${currentPage === index + 1
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Tracking Modal --- */}
        <AnimatePresence>
          {showTrackingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowTrackingModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Package Tracking</h3>
                      <p className="text-gray-600 mt-1">Order : {selectedOrder?.order_id}</p>
                    </div>
                    <button
                      onClick={() => setShowTrackingModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {trackingLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-600">Loading tracking information...</p>
                    </div>
                  ) : trackingData ? (
                    <div className="space-y-6">
                      {/* Tracking Summary */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl py-2 px-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {getTrackingStatusIcon(trackingData.status)} Current Status
                            </h4>
                            <p className="text-2xl font-bold text-blue-600 mt-1">
                              {trackingData.status || 'In Transit'}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-800"><span>Carrier : </span> {selectedOrder?.carrier}</p>
                            <p className="font-semibold text-gray-800"> <span>Tracking ID : </span>{selectedOrder?.tracking_number}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Timeline */}
                      {trackingData.tracking_history && trackingData.tracking_history.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Tracking History</h4>
                          <div className="space-y-4">
                            {trackingData.tracking_history.map((event, index) => (
                              <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                                <div className="flex-shrink-0">
                                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800"><span>Status:- </span> {event.status} <span className="text-xs">{event.status_date}</span></p>
                                  <p className="text-sm text-gray-600">{event.status_details}</p>
                                  <p className="text-sm text-gray-600">
                                    {event.location
                                      ? `${event.location.city}, ${event.location.state} ${event.location.zip}, ${event.location.country}`
                                      : "Location not available"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{event.datetime}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Unable to load tracking information</p>
                    </div>
                  )}
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