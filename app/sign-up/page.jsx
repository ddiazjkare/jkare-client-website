"use client"
import React, { useEffect, useState } from "react"
import Alert from '../../components/ui/Alert'
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";



const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null)
  const router = useRouter()
  const pageTitle = 'SignUp';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  // Validation functions
  const validateUsername = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.includes(' ')) return "Username cannot contain spaces";
    if (username.length < 3) return "Username must be at least 3 characters long";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone || typeof phone !== "string" || phone.trim() === "") return "Phone number is required";
    if (!isValidPhoneNumber(phone)) return "Please enter a valid phone number";
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  // const validatePhone = (phone) => {
  //   if (!phone.trim()) return "Phone number is required";
  //   const phoneRegex = /^[0-9]{10}$/;
  //   if (!phoneRegex.test(phone)) return "Phone number must be exactly 10 digits";
  //   return null;
  // };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    return null;
  };

  const formHandler = ({ target }) => {
    let value = target.value;

    // Special handling for username - remove spaces and convert to lowercase
    if (target.name === 'username') {
      value = value.replace(/\s/g, '').toLowerCase();
    }

    // Special handling for phone - only allow numbers
    if (target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [target.name]: value });
  }

  const validateForm = () => {
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);

    if (usernameError) {
      toast.error(usernameError);
      return false;
    }
    if (emailError) {
      toast.error(emailError);
      return false;
    }
    if (phoneError) {
      toast.error(phoneError);
      return false;
    }
    if (passwordError) {
      toast.error(passwordError);
      return false;
    }
    return true;
  };

  const submitHandler = async e => {
    try {
      e.preventDefault();

      // Validate form before submission
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      const res = await fetch(`/api/user/signup`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          "Content-type": "application/json"
        }
      });
      const data = await res.json();

      // Duplicate email error
      if (
        data?.error?.code === 11000 ||
        (data?.error && typeof data.error.errmsg === "string" && data.error.errmsg.includes("duplicate key error"))
      ) {
        toast.error("Email already registered. Try with a new email address.");
        return;
      }

      // Other errors
      if (data.error) {
        toast.error(typeof data.error === "string" ? data.error : "An error occurred. Please try again.");
        return;
      }

      setFormData({
        username: '',
        phone: '',
        email: '',
        password: ''
      });
      router.push("/verify/user_created");
    } catch (err) {
      toast.error("Username must be unique!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center lg:justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/admin+login+background.jpg')" }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        z-index={1000}
      />
      {/* Logo */}
      <img
        src="https://s3.ap-south-1.amazonaws.com/jkare.data/jkarelogo.png"
        alt="JKare Logo"
        className="absolute top-6 left-6 h-12 w-auto z-20 lg:top-8 lg:left-8
        lg:block
        hidden
        "
      />
      {/* Mobile logo */}
      <img
        src="https://s3.ap-south-1.amazonaws.com/jkare.data/jkarelogo.png"
        alt="JKare Logo"
        className="absolute top-6 left-1/2 -translate-x-1/2 h-10 w-auto z-20 block lg:hidden"
      />
      {/* Background image for mobiles */}
      <div
        className="lg:hidden absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/admin+login+background.jpg')" }}
      ></div>
      <div className="relative p-8 mx-4 rounded-lg max-w-md w-full z-10 lg:mr-32 border-2 border-white shadow-2xl bg-black/10 backdrop-blur-sm  object-center">
        <h2 className="text-4xl font-bold mb-6 text-white text-center">
          Sign Up
        </h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-white">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter your Username (no spaces)"
              name="username"
              value={formData.username}
              onChange={(e) => formHandler(e)}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Phone Number</label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={formData.phone}
              onChange={value => setFormData({ ...formData, phone: value || "" })}
              className="w-full px-4 py-2 mt-2 border border-none rounded-md focus:border-none focus:outline-none focus:ring-1 bg-white focus:ring-blue-600"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter your Email"
              name="email"
              value={formData.email}
              onChange={(e) => formHandler(e)}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-white"> Create Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 pr-10"
              placeholder="Create your Password (min 6 characters)"
              name="password"
              value={formData.password}
              onChange={(e) => formHandler(e)}
              disabled={isLoading}
            />
            <div
              className="absolute inset-y-0 right-3 top-9 flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ top: '2.35rem' }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
          </div>
          <button
            className="bg-transparent hover:bg-customBlue text-white hover:text-white font-bold py-2 px-4 rounded border border-white hover:border-transparent focus:outline-none focus:shadow-outline w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUpForm