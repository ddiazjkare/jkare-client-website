"use client"
import { useEffect } from "react"
import { FaNewspaper } from "react-icons/fa6"

const NewsMedia = () => {
  const pageTitle = 'News & Media';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center font-montserrat">
      <div className="text-center p-8">
        {/* Icon */}
        <div className="mb-6">
          <FaNewspaper className="mx-auto text-gray-400 text-6xl" />
        </div>
        
        {/* Main Message */}
        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          News & Media
        </h1>
        
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          There is no latest news available at the moment. Please check back later for updates.
        </p>
        
        {/* Optional decorative line */}
        <div className="mt-8 w-24 h-1 bg-customBlue mx-auto rounded"></div>
      </div>
    </div>
  )
}

export default NewsMedia;