"use client"
import React, { useEffect, useState } from "react"
import Alert from '../../components/ui/Alert'
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [error, setError] = useState(null)
  const router = useRouter()
  const pageTitle = 'SignUp';
  useEffect(() => {
    loadCaptchaEnginge(6); // 6 character captcha
  }, []);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    let label = '';
    let color = '';

    // Length check
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Determine strength label and color
    if (score <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      label = 'Acceptable';
      color = 'bg-yellow-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    return { score, label, color };
  };

  // Check password match
  const checkPasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  };

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
  
  // For US numbers, check if it has 10 digits (with or without country code)
  const cleanPhone = phone.replace(/\D/g, ''); // Remove all non-digits
  
  // Accept both formats: 5685458584 (10 digits) or 15685458584 (11 digits with country code)
  if (cleanPhone.length === 10 || (cleanPhone.length === 11 && cleanPhone.startsWith('1'))) {
    return null; // Valid
  }
  
  return "Please enter a valid US phone number";
};

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    return null;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
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

    const updatedFormData = { ...formData, [target.name]: value };
    setFormData(updatedFormData);

    // Update password strength in real-time
    if (target.name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);

      // Check password match if confirm password exists
      if (updatedFormData.confirmPassword) {
        setPasswordMatch(checkPasswordMatch(value, updatedFormData.confirmPassword));
      }
    }

    // Update password match in real-time
    if (target.name === 'confirmPassword') {
      setPasswordMatch(checkPasswordMatch(updatedFormData.password, value));
    }
  }

  const validateForm = () => {
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

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
    if (confirmPasswordError) {
      toast.error(confirmPasswordError);
      return false;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return false;
    }
    if (!validateCaptcha(captchaValue)) {
      toast.error("Please enter the correct CAPTCHA");
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

      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...submitData } = formData;

      const res = await fetch(`/api/user/signup`, {
        method: 'POST',
        body: JSON.stringify(submitData),
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
        password: '',
        confirmPassword: ''
      });
      setPasswordStrength({ score: 0, label: '', color: '' });
      setPasswordMatch(null);
      router.push("/verify/user_created");
    } catch (err) {
      toast.error("Username must be unique!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClick = () => {
    router.push("/privacy-policy");
  };

  return (
   <div className="flex min-h-screen items-center justify-center lg:justify-center overflow-hidden relative">
  {/* Blurred background */}
  <div 
    className="absolute inset-0 bg-cover bg-center blur-md"
    style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/banner+image.jpg')" }}
  ></div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        style={{ zIndex: 1000 }}
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
   
      {/* Background image for mobiles */}
    {/* Background image for mobiles */}
<div
  className="lg:hidden absolute inset-0 z-0 bg-cover bg-center blur-md"
  style={{ backgroundImage: "url('https://s3.ap-south-1.amazonaws.com/jkare.data/banner+image.jpg')" }}
></div>
      <div className="relative p-8 mx-4 rounded-lg max-w-md w-full z-10 lg:mr-32 border-2 border-white shadow-2xl bg-black/30 backdrop-blur-xl object-center">
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
              international={false}
              defaultCountry="US"
              countries={["US"]}
              value={formData.phone}
              onChange={value => setFormData({ ...formData, phone: value || "" })}
              className="w-full px-4 py-2 mt-2 border border-none rounded-md focus:border-none focus:outline-none focus:ring-1 bg-white focus:ring-blue-600"
              disabled={isLoading}
              placeholder="Enter your phone number"
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
            <label className="block text-white">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 pr-10"
              placeholder="Enter your Password (min 6 characters)"
              name="password"
              value={formData.password}
              onChange={(e) => formHandler(e)}
              disabled={isLoading}
            />
            <div
              className="absolute right-3 top-10 flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            // style={{ top: '2.25rem' }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">Password Strength:</span>
                  <span className={`text-sm font-medium ${passwordStrength.label === 'Weak' ? 'text-red-400' :
                      passwordStrength.label === 'Acceptable' ? 'text-yellow-400' :
                        'text-green-400'
                    }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${level <= passwordStrength.score ? passwordStrength.color : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 relative">
            <label className="block text-white">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 pr-10"
              placeholder="Confirm your Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => formHandler(e)}
              disabled={isLoading}
            />
            <div
              className="absolute right-3 top-10 flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            // style={{ top: '2.25rem' }}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center">
                {passwordMatch ? (
                  <div className="flex items-center text-green-400">
                    <FaCheck className="mr-1" size={14} />
                    <span className="text-sm">Passwords match</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-400">
                    <FaTimes className="mr-1" size={14} />
                    <span className="text-sm">Passwords do not match</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CAPTCHA */}
          <div className="mb-4">
            <label className="block text-white mb-2">Please solve the CAPTCHA</label>
            <div className="bg-white p-2 rounded mb-2 flex justify-center">
              <LoadCanvasTemplate />
            </div>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter CAPTCHA"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="mb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-white">
                By signing up, I agree to the{" "}
                <button
                  type="button"
                  onClick={handleTermsClick}
                  className="text-blue-300 hover:text-blue-100 underline focus:outline-none"
                >
                  Terms and Conditions
                </button>
              </label>
            </div>
          </div>
            <button
            className="bg-transparent hover:bg-customBlue text-white hover:text-white font-bold py-2 px-4 rounded border border-white hover:border-transparent focus:outline-none focus:shadow-outline w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-4"
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