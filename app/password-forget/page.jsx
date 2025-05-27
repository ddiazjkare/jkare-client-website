"use client"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Forgot = () => {
  const [email, setEmail] = useState('')

  const pageTitle = 'Password Forget';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const submitHandler = async e => {
    try {
      e.preventDefault()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })
      const data = await res.text()
      if (data == "User not found!") {
        toast.error(data)
        return
      }

      toast.success(data);
      setEmail("");
    } catch (err) {
      alert("alert", err)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/admin+login+background.jpg')" }}
    >
      {/* Logo */}
    <img
      src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
      alt="JKare Logo"
      className="absolute top-6 left-6 h-12 w-auto z-20 lg:top-8 lg:left-8
        lg:block
        hidden
        "
    />
    {/* Mobile logo */}
    <img
      src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
      alt="JKare Logo"
      className="absolute top-6 left-1/2 -translate-x-1/2 h-10 w-auto z-20 block lg:hidden"
    />
      <ToastContainer />
      {/* Background image for mobiles */}
      <div
        className="lg:hidden absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/admin+login+background.jpg')" }}
      ></div>

      <div className="relative p-8 mx-4 rounded-lg max-w-md w-full z-10 lg:mr-32 border-2 border-white shadow-xl shadow-teal-800/80 onject-center">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Forgot Password
        </h2>
        <form className="w-full space-y-4" onSubmit={submitHandler}>
          <div className="flex flex-col mb-4">
            <label className="text-white text-sm font-bold" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Enter your Registered Email"
            />
          </div>
          <div>
            <input
              className="bg-customBlue shadow-inner  text-white hover:bg-white  hover:text-customBlue font-bold py-2 px-4 rounded borderhover:border-transparent focus:outline-none focus:shadow-outline w-full"
              type="submit"
              value="Send Reset Link"
            />
          </div>
        </form>
        <div className="flex items-center justify-center mt-6">
          <a
            className="inline-block align-baseline font-bold text-sm text-white hover:text-customPink"
            href="/login"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default Forgot
