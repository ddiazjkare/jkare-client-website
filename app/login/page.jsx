"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { FaGoogle, FaFacebook, FaXTwitter, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { signIn } from 'next-auth/react'
import Alert from "../../components/ui/Alert"
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
// import { CartContext } from "../../components/SessionProVider"

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaValue, setCaptchaValue] = useState('');
  // const [, setCartItems] = useContext(CartContext)
  const router = useRouter()

  const pageTitle = 'Login';

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  useEffect(() => {
    loadCaptchaEnginge(6); // 6 character captcha
  }, []);

  const submitHandler = async e => {
    e.preventDefault()

    // Validate CAPTCHA first
    if (!validateCaptcha(captchaValue)) {
      setErrMsg("Please enter the correct CAPTCHA");
      setTimeout(() => {
        setErrMsg(null)
      }, 3000);
      return;
    }

    setLoading(true)
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!result?.error) {
      router.push("/");
      return
    }
    if (result?.error) {
      setErrMsg(result.error)
      setTimeout(() => {
        setErrMsg(null)
      }, 3000)
      // Reload captcha on error
      loadCaptchaEnginge(6);
      setCaptchaValue('');
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden relative font-montserrat">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-md"
        style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/banner+image.jpg')" }}
      ></div>
      {/* Logo */}
      <img
        src="https://s3.ap-south-1.amazonaws.com/jkare.data/jkarelogo.png"
        alt="JKare Logo"
        className="absolute top-6 left-6 h-16 w-auto z-20 lg:top-8 lg:left-8
        lg:block
        hidden
        "
      />

      {errMsg && <Alert message={errMsg} closeHandler={() => setErrMsg(null)} />}
      {/* Background image for mobiles */}
      <div
        className="lg:hidden absolute inset-0 z-0 bg-cover bg-center blur-md"
        style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/banner+image.jpg')" }}
      ></div>
      <div className="relative p-8 mx-8 rounded-lg max-w-md w-full z-10 lg:mr-32 border-2 border-white shadow-2xl bg-black/30 backdrop-blur-xl transition-transform duration-500 ease-out transform hover:scale-105">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Log in
        </h2>
        <form className="w-full space-y-4" onSubmit={submitHandler}>
          <div className="flex flex-col mb-4">
            <label className="text-white text-sm font-bold" htmlFor="email">
              Email or Username
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              onChange={({ target }) => setUsername(target.value)}
              placeholder="Enter your Email or Username"
            />
          </div>
          <div className="flex flex-col mb-4 relative">
            <label className="text-white text-sm font-bold" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Enter your Password"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 mt-6 flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-white text-sm font-bold mb-2">
              Please solve the CAPTCHA
            </label>
            <div className="bg-white p-2 rounded mb-2 flex justify-center">
              <LoadCanvasTemplate />
            </div>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
              placeholder="Enter CAPTCHA"
              disabled={loading}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-transparent hover:bg-customBlue text-white font-bold py-2 px-4 rounded border border-white hover:border-transparent focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" size={20} />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-white hover:text-customBlue mt-2 block"
              href="/password-forget"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center mt-2 text-white">
          <div className="w-full flex items-center justify-center text-white my-4">
            <div className="flex-grow border-t border-white"></div>
            <span className="px-4">or</span>
            <div className="flex-grow border-t border-white"></div>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="flex items-center justify-center mt-5 space-x-3">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded border border-gray-400 shadow flex items-center"
            type="button"
            onClick={() => signIn("google")}
          >
            <FaGoogle size={20} color="#DB4437" className="mr-2" />
            <span>Login with Google</span>
          </button>

        </div>

        {/* Sign up link */}
        <div className="flex items-center justify-center mt-6">
          <Link className="inline-block align-baseline font-bold text-sm text-white hover:text-customBlue" href="/sign-up">
            Need an account? SIGN UP
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login;
