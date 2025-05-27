"use client"
import React, { useEffect, useState } from "react"
import Alert from '../../components/ui/Alert'
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpForm = () => {
 const [showPassword, setShowPassword] = useState(false);
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
  const formHandler = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value })
  }

  const submitHandler = async e => {
    try {
      e.preventDefault();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
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
      toast.error("username must be unique!");
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
              placeholder="Enter your Username"
              name="username"
              value={formData.username}
              onChange={(e) => formHandler(e)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Phone Number</label>
            <input
              type="number"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter your Phone Number"
              name="phone"
              value={formData.phone}
              onChange={(e) => formHandler(e)}
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
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-white">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 pr-10"
              placeholder="Enter your Password"
              name="password"
              value={formData.password}
              onChange={(e) => formHandler(e)}
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
            className="bg-transparent hover:bg-customBlue text-white hover:text-white font-bold py-2 px-4 rounded border border-white hover:border-transparent focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUpForm