// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";
// import { FaArrowLeft } from "react-icons/fa";

// const Navigation = () => {
//   const router = useRouter();

//   const handleNavigation = (path) => {
//     router.push(`/account-settings/${path}`);
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-32">
//       {/* Sidebar Navigation */}
//       <div className="col-span-1 space-y-6">
//         {/* Back to Home Button */}
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => router.push("/")}
//             className="flex items-center gap-2 bg-customPink text-white px-4 py-2 rounded-full shadow-md hover:bg-customBlue hover:shadow-lg transition duration-200"
//           >
//             <FaArrowLeft className="text-lg" />
//             <span className="text-sm font-medium">Back to Home</span>
//           </button>
//         </div>
//         {/* Navigation Section */}
//         <div className="bg-white shadow-lg rounded-lg p-6 border-2">
//           <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
//             Navigation
//           </h3>
//           <ul className="space-y-4">
//             <li
//               onClick={() => handleNavigation("edit-profile")}
//               className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition duration-200`}
//             >
//               <span className="text-base">Edit Profile</span>
//             </li>
//             <li
//               onClick={() => handleNavigation("address-book")}
//               className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition duration-200`}
//             >
//               <span className="text-base">Address Book</span>
//             </li>
//             <li
//               onClick={() => handleNavigation("gift-card")}
//               className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition duration-200`}
//             >
//               <span className="text-base">Gift Card</span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="col-span-1 lg:col-span-3 bg-white shadow-lg rounded-lg p-6 border-2 ">
//         <iframe
//           src={router.pathname}
//           title="Dynamic Content"
//           className="w-full h-full border-0"
//         ></iframe>
//       </div>
//     </div>
//   );
// };

// export default Navigation;
"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const { data: session, update, status } = useSession();
  let localUser = typeof window !== "undefined" && window.localStorage.getItem("nextUser");
  localUser = localUser ? JSON.parse(localUser) : null;
  const username =
    (localUser && localUser.username) || (session && session.user && session.user.username) || "";
  const userEmail =
    (localUser && localUser.email) || (session && session.user && session.user.email) || "";

  const [name, setName] = useState("");
  const [activeOption, setActiveOption] = useState("/profile-detail");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(
    "https://s3.ap-south-1.amazonaws.com/jkare.data/default_user_profile.jpg"
  );
  const [file, setFile] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  
  const router = useRouter();
  const pageTitle = "Profile Detail";

  // Skeletal Loader Component
  // const SkeletalLoader = () => (
  //   <div className="w-full mt-36 mb-14 font-montserrat flex items-center justify-center">
  //     <div className="grid grid-cols-1 lg:grid-cols-3 border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl max-w-6xl w-full mx-4">
  //       {/* Profile Photo Skeleton */}
  //       <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-8 flex flex-col items-center">
  //         <div className="rounded-full w-40 h-40 mb-6 bg-white/30 animate-pulse"></div>
  //         <div className="bg-white/30 rounded-full w-32 h-10 mb-6 animate-pulse"></div>
  //         <div className="space-y-3 w-full">
  //           <div className="bg-white/20 rounded-lg p-4 animate-pulse">
  //             <div className="h-4 bg-white/30 rounded mb-2"></div>
  //             <div className="h-5 bg-white/40 rounded"></div>
  //           </div>
  //           <div className="bg-white/20 rounded-lg p-4 animate-pulse">
  //             <div className="h-4 bg-white/30 rounded mb-2"></div>
  //             <div className="h-5 bg-white/40 rounded"></div>
  //           </div>
  //         </div>
  //       </div>
        
  //       {/* Form Skeleton */}
  //       <div className="col-span-2 p-8 bg-white">
  //         <div className="h-8 bg-gray-200 rounded-lg mb-8 w-48 animate-pulse"></div>
  //         <div className="space-y-6">
  //           {/* Name and Phone skeleton */}
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             <div>
  //               <div className="h-5 bg-gray-200 rounded mb-3 w-16 animate-pulse"></div>
  //               <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //             </div>
  //             <div>
  //               <div className="h-5 bg-gray-200 rounded mb-3 w-16 animate-pulse"></div>
  //               <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //             </div>
  //           </div>
            
  //           {/* Address skeletons */}
  //           <div>
  //             <div className="h-5 bg-gray-200 rounded mb-3 w-32 animate-pulse"></div>
  //             <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //           </div>
  //           <div>
  //             <div className="h-5 bg-gray-200 rounded mb-3 w-32 animate-pulse"></div>
  //             <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //           </div>
            
  //           {/* City, State skeleton */}
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             <div>
  //               <div className="h-5 bg-gray-200 rounded mb-3 w-12 animate-pulse"></div>
  //               <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //             </div>
  //             <div>
  //               <div className="h-5 bg-gray-200 rounded mb-3 w-14 animate-pulse"></div>
  //               <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //             </div>
  //           </div>
            
  //           {/* Zip, Country skeleton */}
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             <div>
  //               <div className="h-5 bg-gray-200 rounded mb-3 w-20 animate-pulse"></div>
  //               <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //             </div>
  //             <div>
  //               <div className="h-5 bg-gray-200 rounded mb-3 w-18 animate-pulse"></div>
  //               <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
  //             </div>
  //           </div>
            
  //           {/* Button skeleton */}
  //           <div className="flex justify-end">
  //             <div className="h-12 bg-gray-200 rounded-xl w-36 animate-pulse"></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // Fetch user data on component mount
  const fetchUserData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch(`/api/user/info/${userEmail}`);
      const userData = await response.json();
      
      if (response.ok) {
        setUserInfo(userData);
        setName(userData.fullName || "");
        setPhone(userData.phone || "");
        setAddress(userData.address || {});
        setProfilePhoto(userData.image || "https://s3.ap-south-1.amazonaws.com/jkare.data/default_user_profile.jpg");
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("An error occurred while fetching user data");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    document.title = pageTitle;
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    // Fetch user data when component mounts and user is authenticated
    if (status === "authenticated" && userEmail) {
      fetchUserData();
    }
  }, [pageTitle, status, userEmail]);

  const handleNavigation = (path) => {
    setActiveOption(path);
    router.push(path);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.trim();
    if (!isNaN(val)) setPhone(val);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]:
        name === "postal_code"
          ? !isNaN(value.trim())
            ? value.trim()
            : ""
          : value,
    });
  };

  const handlePhotoChange = async (e) => {
    const fileInput = e.target.files?.[0];
    setFile(fileInput);
    setProfilePhoto(URL.createObjectURL(fileInput));
  };

  const triggerPhotoUpload = () => {
    document.getElementById("profilePhotoInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation check
      if (
        name === "" ||
        phone === "" ||
        !address ||
        address?.country === "" ||
        address?.state === "" ||
        address?.city === "" ||
        address?.postal_code === "" ||
        address?.line1 === ""
      ) {
        toast.error("Some fields are missing!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (file)
        formData.append("profile", file);
      formData.append("fullName", name);
      formData.append("address", JSON.stringify(address));
      formData.append("phone", phone);

      const res = await fetch(`/api/user/update/${username}`, {
        method: "PUT",
        body: formData,
      });
            

      const updatedUser = await res.json();
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          name,
          ...updatedUser.user
        },
      };
        

      await update(updatedSession, { redirect: false });
      window.localStorage.setItem(
        "nextUser",
        JSON.stringify({
          ...session.user,
          ...updatedUser.user
        })
      );

    toast.success("Data updated successfully! Changes reflect when you login again.");
    
    } catch (err) {
      console.error("err", err);
      toast.error("An error occurred while updating profile!");
    } finally {
      setLoading(false);
    }
  };

  // if (dataLoading) {
  //   return <SkeletalLoader />;
  // }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
   
    <div className="w-full mb-14 font-montserrat flex items-center justify-center min-h-screen ">  
    {/* Edit Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-28 border border-gray-200 rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-full mx-4 bg-white backdrop-blur-sm">
        {/* Profile Photo Section */}
        <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 p-8 flex flex-col items-center text-white relative">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
          
          <div className="relative">
            <img
              src={profilePhoto}
              alt="Profile Photo"
              className="rounded-full w-44 h-44 mb-6 object-cover shadow-2xl border-4 border-white/50 backdrop-blur-sm"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <button
            onClick={triggerPhotoUpload}
            className="bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 mb-6 border border-white/20"
          >
            📸 Change Photo
          </button>
          
          {/* Display Username and Email (Read-only) */}
          <div className="w-full space-y-4">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
              <div className="text-white/80 font-medium text-sm mb-1">👤 Username</div>
              <div className="text-white font-bold text-lg">{userInfo.username || username}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
              <div className="text-white/80 font-medium text-sm mb-1">✉️ Email</div>
              <div className="text-white font-bold text-lg break-all">{userInfo.email || userEmail}</div>
            </div>
          </div>
          
          <input
            type="file"
            id="profilePhotoInput"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        
        {/* Form Section */}
        <div className="col-span-2 p-8 bg-white">
          <div className="flex items-center mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4"></div>
            <h2 className="text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Edit Profile
            </h2>
          </div>
          
          <form encType="multipart/form-data" onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Phone Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  👤 Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="group">
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  📱 Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-0.5 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-700">📍 Address Information</h3>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={address?.line1 || ""}
                  name="line1"
                  onChange={handleAddressChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Street address, P.O. Box, company name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={address?.line2 || ""}
                  name="line2"
                  onChange={handleAddressChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>
            </div>
            
            {/* City, State, Zip, Country Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  🏙️ City
                </label>
                <input
                  type="text"
                  name="city"
                  value={address?.city || ""}
                  onChange={handleAddressChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  🏛️ State
                </label>
                <input
                  type="text"
                  name="state"
                  value={address?.state || ""}
                  onChange={handleAddressChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter state"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  📮 Zip Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={address?.postal_code || ""}
                  maxLength={6}
                  onChange={handleAddressChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter postal code"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                  🌍 Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={address?.country || ""}
                  onChange={handleAddressChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter country"
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                  } text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 flex items-center space-x-2 min-w-[160px] justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
     </>
    
  );
  
};

export default EditProfile;