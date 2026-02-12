// app/not-found.tsx (or not-found.js)
'use client';

import Link from 'next/link';
import { 
  FaStethoscope, 
  FaHeartbeat, 
  FaUserMd, 
  FaAmbulance,
  FaSyringe,
  FaThermometerHalf,
  FaHome,
  FaSearch
} from 'react-icons/fa';
import { MdLocalHospital, MdMonitorHeart } from 'react-icons/md';
import { BiPulse } from 'react-icons/bi';

export default function NotFound() {
  return (
    <>
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes heartbeat-draw {
          0% { stroke-dashoffset: 300; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -300; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          25% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
          50% { transform: translateY(-10px) rotate(-5deg); opacity: 0.8; }
          75% { transform: translateY(-15px) rotate(3deg); opacity: 1; }
        }

        @keyframes drift {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(15px) rotate(240deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }

        @keyframes medical-pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }

        .heartbeat-path {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: heartbeat-draw 4s ease-in-out infinite;
        }

        .floating-icon {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon-2 {
          top: 30%;
          right: 15%;
          animation-delay: 1.5s;
        }

        .floating-icon-3 {
          top: 60%;
          left: 20%;
          animation-delay: 3s;
        }

        .floating-icon-4 {
          top: 70%;
          right: 10%;
          animation-delay: 4.5s;
        }

        .medical-bg-icon {
          position: absolute;
          animation: drift 20s linear infinite;
        }

        .medical-bg-icon-1 {
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .medical-bg-icon-2 {
          top: 20%;
          right: 10%;
          animation-delay: 4s;
        }

        .medical-bg-icon-3 {
          bottom: 30%;
          left: 8%;
          animation-delay: 8s;
        }

        .medical-bg-icon-4 {
          bottom: 20%;
          right: 5%;
          animation-delay: 12s;
        }

        .medical-bg-icon-5 {
          top: 50%;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 16s;
        }

        @media (max-width: 640px) {
          .floating-icon {
            display: none;
          }
          
          .medical-bg-icon {
            transform: scale(0.7);
          }
        }

        .medical-pulse {
          animation: medical-pulse 2s infinite;
        }

        .group:hover .medical-pulse {
          animation: medical-pulse 1s infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-12 font-montserrat">
        
        {/* Background Medical Icons Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="medical-bg-icon medical-bg-icon-1">
            <FaStethoscope className="text-blue-100 text-6xl opacity-30" />
          </div>
          <div className="medical-bg-icon medical-bg-icon-2">
            <MdLocalHospital className="text-red-100 text-5xl opacity-20" />
          </div>
          <div className="medical-bg-icon medical-bg-icon-3">
            <FaThermometerHalf className="text-green-100 text-4xl opacity-25" />
          </div>
          <div className="medical-bg-icon medical-bg-icon-4">
            <FaSyringe className="text-purple-100 text-5xl opacity-20" />
          </div>
          <div className="medical-bg-icon medical-bg-icon-5">
            <MdMonitorHeart className="text-cyan-100 text-6xl opacity-15" />
          </div>
        </div>

        <div className="max-w-lg w-full text-center space-y-8 relative z-10">
          
          {/* Main Animation Container */}
          <div className="relative">
            {/* Central Medical Equipment Animation */}
            <div className="relative">
              <div className="mb-4">
                <FaStethoscope className="text-8xl sm:text-9xl text-blue-600 animate-bounce-slow mx-auto" />
              </div>
              
              {/* Heartbeat Line Animation */}
              <div className="mt-4 h-12 overflow-hidden">
                <svg viewBox="0 0 200 50" className="w-full h-12">
                  <path
                    d="M0,25 L40,25 L45,10 L50,40 L55,10 L60,25 L200,25"
                    stroke="#ef4444"
                    strokeWidth="2"
                    fill="none"
                    className="heartbeat-path"
                  />
                </svg>
              </div>

              {/* Floating Medical Icons */}
              <div className="absolute inset-0 pointer-events-none" style={{height: '200px', top: '-20px'}}>
                <div className="floating-icon floating-icon-1">
                  <FaHeartbeat className="text-red-500 text-2xl" />
                </div>
                <div className="floating-icon floating-icon-2">
                  <BiPulse className="text-green-500 text-xl" />
                </div>
                <div className="floating-icon floating-icon-3">
                  <FaUserMd className="text-blue-500 text-xl" />
                </div>
                <div className="floating-icon floating-icon-4">
                  <FaAmbulance className="text-orange-500 text-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-6xl sm:text-8xl font-bold text-gray-800 mb-2 animate-pulse-slow">
                4<span className="text-red-500">0</span>4
              </h1>
            
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
                Page Not Found
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                The medical equipment or page you're looking for seems to have been moved to a different ward. 
                Our diagnostic tools couldn't locate the requested resource.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link 
                href="/"
                className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaHome className="group-hover:animate-bounce" />
                <span>Return to Home Page</span>
              </Link>
            </div>

           
          </div>
        </div>
      </div>
    </>
  );
}