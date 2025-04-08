"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CartContext } from "../../components/SessionProVider";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import Confetti from "react-confetti";

function Page() {
  const [confettiVisible, setConfettiVisible] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [, setCartItems] = useContext(CartContext);
  const session_id = searchParams.get("session_id");
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hide confetti after a certain time
  useEffect(() => {
    setTimeout(() => {
      setConfettiVisible(false);
    }, 150000);
  }, []);

  // Check if "nextUser" exists in localStorage
  useEffect(() => {
    const nextUser = window.localStorage.getItem("nextUser");
    if (nextUser) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch payment details from the server using the session_id from query parameters
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (session_id) {
        const response = await fetch(`/api/stripe/checkout/${session_id}`, { mode: "cors" });
        const data = await response.json();
        console.log("data" , data)
        setPaymentDetails(data);
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [session_id]);
  useEffect(() => {
    const callApi = async () => {
      if (session && session.user) {
        await fetch(`/api/cart/${session.user.email}`, {
          method: "DELETE",
        });
      }
      window.localStorage.removeItem("medCart");
      setCartItems(0);
    };

    callApi();
  }, [session, setCartItems]);
  if (!session_id) {
    router.push("/");
    return null;
  }
  const handleMyOrders = () => {
    if (isLoggedIn) {
      router.push("/order-history");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6 mt-11 relative font-montserrat w-full">
      {confettiVisible && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 0}
          height={typeof window !== "undefined" ? window.innerHeight : 0}
        />
      )}
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg z-10">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-customPink rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CiCircleCheck className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-light mb-3">Order Confirmation</h2>
          <p className="text-center mb-6 font-light">
            <strong>
              Thank you for your payment. Your order is being processed and you will receive a confirmation email shortly.
            </strong>
          </p>
        </div>
        {/* {loading ? (
          <div className="bg-gray-200 p-4 rounded-lg mb-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ) : (
          paymentDetails && (
            <div className="bg-customPink p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Payment Details</h3>
              <div className="flex justify-between mb-1">
                <span className="text-white">Order Value:</span>
                <span className="font-semibold text-white">
                  ${(paymentDetails.amount_total / 100).toFixed(2)}
                </span>
              </div>
            </div>
          )
        )} */}
        <div className="flex justify-center space-x-4">
          <Link href="/product">
            <button className="bg-customPink hover:bg-customPink/80 text-white font-bold py-2 px-4 border-b-4 border-customBlue rounded">
              Continue Shopping
            </button>
          </Link>
          <button
            onClick={handleMyOrders}
            className="bg-customPink hover:bg-customPink/80 text-white font-bold py-2 px-4 border-b-4 border-customBlue rounded"
          >
            My Orders
          </button>
        </div>
        {/* Display the login note if the user is not signed in */}
        {!isLoggedIn && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Note: To view and Track your order. Please log in using the email address you used to complete the payment .
          </p>
        )}
      </div>
    </div>
  );
}

export default Page;
