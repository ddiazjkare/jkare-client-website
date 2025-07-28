"use client";
import React, { useRef, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

const EditProfile = () => {
  const { data: session, update, status } = useSession();
  let localUser = typeof window !== "undefined" && window.localStorage.getItem("nextUser");
  localUser = localUser ? JSON.parse(localUser) : null;
  const username =
    (localUser && localUser.username) || (session && session.user && session.user.username) || "";
  const userEmail =
    (localUser && localUser.email) || (session && session.user && session.user.email) || "";
  const fileInputRef = useRef(null);

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
        setProfilePhoto(
          userData.image && userData.image.trim() !== ""
            ? userData.image
            : "https://s3.ap-south-1.amazonaws.com/jkare.data/default_user_profile.jpg"
        );
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

  const validatePhone = (phone) => {
    if (!phone || typeof phone !== "string" || phone.trim() === "") return false;
    return isValidPhoneNumber(phone);
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

  const handlePhotoChange = (e) => {
    const fileInput = e.target.files?.[0];
    if (!fileInput) return;

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (fileInput.size > 2 * 1024 * 1024) {
      // Clear the file input using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.error("Please select image less than 2MB in size.");
      return;
    }

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
              ref={fileInputRef}
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
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={phone}
                    onChange={value => setPhone(value || "")}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                    disabled={loading}
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