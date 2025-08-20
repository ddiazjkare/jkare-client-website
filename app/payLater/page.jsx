"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CartContext } from "../../components/SessionProVider";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdPendingActions } from "react-icons/md";
import { FiClock, FiPhone, FiMail } from "react-icons/fi";

function OfflineSuccessPage() {
  const [, setCartItems] = useContext(CartContext);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]);
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

  const handleMyOrders = () => {
    if (isLoggedIn) {
      router.push("/order-history");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 mt-11 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-64 h-64 bg-gradient-to-r from-sky-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-sky-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 left-32 w-72 h-72 bg-gradient-to-r from-sky-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-lg border border-sky-200/50 rounded-2xl shadow-2xl p-6 transform transition-all duration-500 hover:shadow-3xl mt-12">
          {/* Pending Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <MdPendingActions className="w-11 h-11 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <FiClock className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Order Booked Successfully!
            </h1>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-3 border border-orange-200">
                <p className="text-base font-semibold text-orange-800 mb-1">
                  📋 Order Confirmed - Payment Pending
                </p>
                <p className="text-orange-700 text-xs leading-relaxed">
                  Your order is booked! We'll contact you shortly for payment and delivery details.
                </p>
              </div>
              
            

              {/* Show message when user is not logged in */}
              {/* {!isLoggedIn && (
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600 text-sm">⚠️</span>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-1">
                        Login Required
                      </p>
                      <p className="text-yellow-700 text-xs">
                        Please log in with your email to view order details and track your order.
                      </p>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* Contact Information - Only show when logged in */}
          {isLoggedIn && (
            <div className="mb-5">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                  <span className="mr-1">📞</span>
                  We'll Contact You Soon
                </h3>
                <div className="grid grid-cols-1 gap-1 text-xs text-blue-700">
                  <div className="flex items-center space-x-2">
                    <FiPhone className="w-3 h-3" />
                    <span>Call within 2-4 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-3 h-3" />
                    <span>Email with payment details</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 mb-4">
            <Link href="/product" className="block">
              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95">
                <span className="flex items-center justify-center space-x-2">
                  <span>Continue Shopping</span>
                  <span className="text-lg">🛍️</span>
                </span>
              </button>
            </Link>

            <button
              onClick={handleMyOrders}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Your Orders</span>
                <span className="text-lg">📋</span>
              </span>
            </button>
          </div>

          {/* Combined Notice & Login Info */}
          <div className="space-y-3">
            {/* Important Notice - Show different content based on login status */}
            {/* <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                <div>
                  <p className="text-xs text-red-800 font-semibold mb-1">Important Notice</p>
                  {isLoggedIn ? (
                    <p className="text-xs text-red-700">Keep phone available • Payment required • 24hr hold</p>
                  ) : (
                    <p className="text-xs text-red-700">Login required to view order details and track progress</p>
                  )}
                </div>
              </div>
            </div> */}

       
          </div>
        </div>

        {/* Additional Elements */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Questions?{" "}
            <span
              className="text-orange-600 hover:text-orange-700 cursor-pointer font-medium underline"
              onClick={() => router.push("/contact-us")}
            >
              Contact Support
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}

export default OfflineSuccessPage;