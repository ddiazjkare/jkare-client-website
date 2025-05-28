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
  let localUser =
    typeof window !== "undefined" && window.localStorage.getItem("nextUser");
  localUser = JSON.parse(localUser);

  const [name, setName] = useState(localUser ? localUser.fullName : "");
  const [activeOption, setActiveOption] = useState("/profile-detail");
  const [phone, setPhone] = useState(localUser ? localUser.phone : "");
  const [address, setAddress] = useState(localUser ? localUser.address : {});
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(
    localUser?.image ??
    "https://s3.ap-south-1.amazonaws.com/jkare.data/default_user_profile.jpg"
  );
  const [file, setFile] = useState(null);

  const { data: session, update, status } = useSession();
  const router = useRouter();
  const pageTitle = "Profile Detail";

  useEffect(() => {
    document.title = pageTitle;
    if (status == "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [pageTitle]);

  const handleNavigation = (path) => {
    setActiveOption(path); // Update the active option
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
        setLoading(false); // Reset loading state when validation fails
        return;
      }

      const formData = new FormData();
      if (file)
        formData.append("profile", file);
        formData.append("fullName", name);
        formData.append("address", JSON.stringify(address));
        formData.append("phone", phone);
        
      const res = await fetch(`/api/user/update/${localUser.username}`, {
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
      
      await update(updatedSession);
      window.localStorage.setItem(
        "nextUser",
        JSON.stringify({
          ...session.user,
          ...updatedUser.user
        })
      );
      
      toast.success("Data updated successfully!");
    } catch (err) {
      console.error("err", err);
      toast.error("An error occurred while updating profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-36 mb-14 font-montserrat flex items-center justify-center">
      <ToastContainer />
      {/* Edit Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 border-2 border-black">
        {/* Profile Photo Section */}
        <div className="bg-gradient-to-r from-customPink/80 to-gray-100 p-8 flex flex-col items-center text-white">
          <img
            src={profilePhoto}
            alt="Profile Photo"
            className="rounded-full w-40 h-40 mb-4 object-cover shadow-lg border-4 border-white"
          />
          <button
            onClick={triggerPhotoUpload}
            className="bg-white text-customPink font-medium py-2 px-6 rounded-full shadow-md hover:bg-gray-100"
          >
            Change Photo
          </button>
          <input
            type="file"
            id="profilePhotoInput"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        {/* Form Section */}
        <div className="col-span-2 p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
          <form encType="multipart/form-data" onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Phone Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-2 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2 font-medium">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            {/* Address Section */}
            <div>
              <label className="block text-gray-600 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={address?.line1}
                name="line1"
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                placeholder="Address line 1"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">
                {" "}
                Address Line 2
              </label>
              <input
                type="text"
                value={address?.line2}
                name="line2"
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                placeholder="Address line 2"
              />
            </div>
            {/* City, State, Zip, Country Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-2 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={address?.city}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2 font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  value={address?.state}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                  placeholder="Enter state"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-2 font-medium">Zip Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={address?.postal_code}
                  maxLength={6}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                  placeholder="Enter postal code"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2 font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  value={address?.country}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-customPink focus:outline-none"
                  placeholder="Enter country"
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-customPink hover:bg-customPink-dark'
                } text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-200 flex items-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

