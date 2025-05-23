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

  /* ------------------ UI ------------------ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto mt-32 mb-10 w-full max-w-[95%] md:w-[85%] lg:w-[70%] px-3 md:px-6 lg:px-8 border-2 border-gray-200/80 rounded-lg font-montserrat"
    >
      {errMsg && (
        <Alert message={errMsg} closeHandler={() => setErrMsg(null)} />
      )}

      {/* --- header --- */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
        Your Orders
      </h1>

      {/* --- search & filters --- */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        {/* search by id */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border p-2 pr-8 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => searchByID(e.target.value)}
          />
          <span className="absolute right-2 top-3 text-gray-500">🔍</span>
        </div>

        {/* date filter */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1">From</label>
            <input
              type="date"
              className="border p-2 rounded-md"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">To</label>
            <input
              type="date"
              className="border p-2 rounded-md"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-600"
              onClick={searchByDate}
            >
              Search
            </button>
            <button
              className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-600"
              onClick={resetDate}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <p className="mb-6 font-semibold border-b-2 border-gray-300 pb-2">
        Showing {currentOrders.length} order{currentOrders.length !== 1 && "s"}
      </p>

      {/* --- order cards --- */}
      {orderList.length > 0 ? (
        orderList.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-lg shadow-md p-4 sm:p-6 mb-6"
          >
            {/* date & ID row */}
            <div className="bg-gray-100 px-3 sm:px-4 py-2 rounded-lg mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-4">
              <p className="text-sm text-gray-600">
                <strong>ORDER PLACED</strong> <br /> {order.order_date}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-sm text-gray-600">
                  <strong>ORDER ID #</strong> <br /> {order.order_id}
                </p>
                <span className="self-start sm:self-auto inline-block bg-yellow-400 text-xs sm:text-sm font-semibold text-black px-3 py-1 rounded-md">
                  {order.order_status}
                </span>
              </div>
            </div>

            {/* items table */}
            <div className="overflow-x-auto">
              <table className="w-max min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs sm:text-sm">
                    <th className="pb-2 pr-3">S.No</th>
                    <th className="pb-2 pr-3">Image</th>
                    <th className="pb-2 pr-3">Product Name</th>
                    <th className="pb-2 pr-3 text-center">Qty</th>
                    <th className="pb-2 pr-3">Price</th>
                    <th className="pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((product, idx) => (
                    <tr
                      key={idx}
                      className="border-b text-xs sm:text-sm last:border-none"
                    >
                      <td className="py-3 pr-3">{idx + 1}</td>
                      <td className="py-3 pr-3">
                        <Link href={`/product/${product.product_id}`}>
                          <img
                            src={product.image}
                            alt={product.product_name}
                            width={60}
                            height={60}
                            className="rounded-lg cursor-pointer"
                          />
                        </Link>
                      </td>
                      <td className="py-3 pr-3 max-w-[160px]">
                        <Link href={`/product/${product.product_id}`}>
                          <h2 className="font-medium hover:underline cursor-pointer line-clamp-2">
                            {product.product_name}
                          </h2>
                        </Link>
                      </td>
                      <td className="py-3 pr-3 text-center">
                        {product.quantity}
                      </td>
                      <td className="py-3 pr-3">${product.price}</td>
                      <td className="py-3">
                        ${(product.quantity * product.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* addresses + price + tracking */}
            <div className="mt-6 bg-gray-100 p-3 sm:p-4 rounded-lg flex flex-col gap-6">
              {/* addresses */}
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div className="text-xs sm:text-sm md:w-1/2">
                  <h3 className="font-bold mb-1">Billing Address</h3>
                  <p className="text-gray-700 leading-snug">
                    {order.billing_address.line1}, {order.billing_address.city},{" "}
                    {order.billing_address.state},{" "}
                    {order.billing_address.country} -{" "}
                    {order.billing_address.postal_code}
                  </p>
                </div>

                <div className="text-xs sm:text-sm md:w-1/2">
                  <h3 className="font-bold mb-1">Shipping Address</h3>
                  <p className="text-gray-700 leading-snug">
                    {order.shipping_address.line1},{" "}
                    {order.shipping_address.city}, {order.shipping_address.state}{" "}
                    {order.shipping_address.country} -{" "}
                    {order.shipping_address.postal_code}
                  </p>
                </div>
              </div>

              {/* price breakdown & tracking */}
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6">
                <div className="text-xs sm:text-sm md:w-1/2">
                  <h3 className="font-bold mb-1">Price Breakdown</h3>
                  <p>Original: ${order.sub_amount}</p>
                  <p>Discount: -${order.discount_amount}</p>
                  <p className="font-bold">Total: ${order.total_amount}</p>
                </div>

                <button
                  onClick={() => handleTrackShipment(order._id)}
                  className="self-stretch md:self-auto bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Track Shipment
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        /* -------- no orders -------- */
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-laptop-user-cartoon-character_335657-1172.avif"
            alt="No orders"
            width={250}
            height={250}
            className="mb-4"
          />
          <p className="text-base md:text-lg font-semibold text-gray-700">
            No orders were placed
          </p>
        </div>
      )}

      {/* ------- pagination ------- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === n
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
  );
}

export default OrderHistory;
