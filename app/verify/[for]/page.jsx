import React from 'react'
import Notification from "../../../components/Notification"
import Link from 'next/link'

export const generateMetadata = () => {
    
    return {
        title: "Verify"
    }
}

function page({ params }) {
    if (params.for == 'email')
        return <Notification subject="Verification Successful!" body="Congratulations, you have been successfully verified." />
    
    if (params.for == 'user_created')
        return <Notification subject="User Created Successful!" body="Congratulations, you have been successfully registered with us." />
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 mt-12">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Success Icon */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Password Reset Successful
                        </h1>
                        <p className="text-green-100 text-sm opacity-90">
                            Your security is our priority
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                            Your password has been successfully reset! You can now access your account with your new credentials.
                        </p>
                        
                        <Link 
                            href="/api/auth/signin" 
                            className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                        >
                            <span className="relative flex items-center">
                                Login Now
                                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <p className="text-amber-800 text-sm font-medium mb-1">
                                    Security Notice
                                </p>
                                <p className="text-amber-700 text-sm">
                                    If you did not reset your password, please contact our support team immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            </div>
        </div>
    )
}

export default page