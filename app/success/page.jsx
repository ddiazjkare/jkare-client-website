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

  useEffect(() => {
    setTimeout(() => {
      setConfettiVisible(false);
    }, 1500000);
  }, []);

  // console.log("session :", session);

  // Update login state based on session email
  useEffect(() => {
    if (session && session.user && session.user.email) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]);

  // Fetch payment details from the server using the session_id from query parameters
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (session_id) {
        const response = await fetch(`/api/stripe/checkout/${session_id}`, { mode: "cors" });
        const data = await response.json();
        // console.log("data", data);
        setPaymentDetails(data);
        setLoading(false);
      }
    };
    fetchPaymentDetails();
  }, [session_id]);

  // Clear cart after order is processed
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 mt-11 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {confettiVisible && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 0}
          height={typeof window !== "undefined" ? window.innerHeight : 0}
          numberOfPieces={150}
          recycle={false}
          gravity={0.1}
        />
      )}

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CiCircleCheck className="w-14 h-14 text-white" />
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-800">
                Payment Successful ✨
              </p>
              <p className="text-gray-600 leading-relaxed">
                Thank you for your purchase! Your order is being processed and you'll receive a confirmation email shortly.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/product" className="block">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95">
                <span className="flex items-center justify-center space-x-2">
                  <span>Continue Shopping</span>
                  <span className="text-xl">🛍️</span>
                </span>
              </button>
            </Link>

            <button
              onClick={handleMyOrders}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>My Orders</span>
                <span className="text-xl">📦</span>
              </span>
            </button>
          </div>

          {/* Login Note */}
          {!isLoggedIn && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-amber-500 text-xl">💡</span>
                <div>
                  <p className="text-sm text-amber-800 font-medium mb-1">
                    Pro Tip
                  </p>
                  <p className="text-sm text-amber-700">
                    To view and track your order, please log in using the email address you used for payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Elements */}
        <div className="mt-6 text-center">
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <span
                className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium"
                onClick={() => router.push("/contact-us")}
              >
                Contact Support
              </span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Page;