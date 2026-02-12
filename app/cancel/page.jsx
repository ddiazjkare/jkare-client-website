"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function CancelPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Update countdown every second
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 mt-4 sm:mt-20">
            <div className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        {/* Pulsing ring */}
                        <div className="absolute inset-0 w-20 h-20 bg-red-200 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-4 text-gray-900 text-center">
                    Payment Cancelled
                </h1>

                {/* Detailed explanation */}
                <div className="text-gray-600 mb-8 space-y-3">
                    <p className="text-center text-lg">
                        Your payment was not processed and your order has been cancelled.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
                        <h3 className="font-semibold text-gray-800 mb-2">What happened?</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Payment was cancelled or interrupted</li>
                            <li>• No charges were made to your account</li>
                            <li>• Your cart items are still saved</li>
                        </ul>
                    </div>
                </div>
                {/* Redirect section */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        {/* Spinner */}
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
                        <span className="text-gray-700 font-medium">
                            Redirecting to home page in...
                        </span>
                    </div>
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {/* Countdown */}
                        <div className="mb-6">
                            <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
                                <svg
                                    className="w-4 h-4 text-gray-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-2xl font-bold text-gray-800 tabular-nums">
                                    {countdown}
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                    {countdown === 1 ? 'second' : 'seconds'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Support link */}
                    <p className="text-sm text-gray-500 mt-6">
                        Need help? {' '}
                        <a
                            href="/contact-us"
                            className="text-blue-600 hover:text-blue-700 font-medium underline"
                        >
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>
        </main>
    );
}