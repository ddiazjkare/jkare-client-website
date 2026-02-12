"use client"
import React from 'react'
import Link from 'next/link'
import { MdEmail, MdPersonAdd, MdCheck, MdHome, MdArrowForward } from 'react-icons/md'

function Notification({ subject, body }) {
    // Determine notification type based on subject
    const isEmailVerification = subject.includes('Verification Successful');
    const isUserCreated = subject.includes('User Created Successful');

    // Set colors and icons based on type
    const getNotificationConfig = () => {
        if (isEmailVerification) {
            return {
                bgGradient: 'from-blue-500 to-indigo-600',
                icon: <MdEmail className="w-16 h-16 text-white mb-4" />,
                title: 'Email Verified!',
                accentColor: 'blue'
            };
        } else if (isUserCreated) {
            return {
                bgGradient: 'from-green-500 to-emerald-600',
                icon: <MdPersonAdd className="w-16 h-16 text-white mb-4" />,
                title: 'Account Created!',
                accentColor: 'green'
            };
        }

        return {
            bgGradient: 'from-gray-500 to-gray-600',
            icon: <MdCheck className="w-16 h-16 text-white mb-4" />,
            title: 'Success!',
            accentColor: 'gray'
        };
    };

    const config = getNotificationConfig();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4 font-montserrat">
            <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fadeIn">
                {/* Header with icon */}
                <div className={`bg-gradient-to-r ${config.bgGradient} p-10 text-center relative`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative">
                        <div className="animate-bounce">
                            {config.icon}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {config.title}
                        </h1>
                        <div className="w-16 h-1 bg-white/50 rounded-full mx-auto"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {subject}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {body}
                    </p>

                    {/* Action button */}
                    <Link
                        href="/"
                        className={`group inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-${config.accentColor}-500 to-${config.accentColor}-500 hover:from-${config.accentColor}-600 hover:to-${config.accentColor}-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95`}
                    >
                        <span className="flex items-center">
                            <MdHome className="w-5 h-5 mr-2" />
                            Go to Homepage
                            <MdArrowForward className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>

                {/* Bottom accent */}
                <div className={`h-2 bg-gradient-to-r from-${config.accentColor}-500 to-${config.accentColor}-500`}></div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Notification