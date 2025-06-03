/* eslint-disable react/no-unescaped-entities */
"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 25.7617,
  lng: -80.1918,
};

export default function Contact() {
  const { data: session } = useSession();
  let localUser = typeof window !== "undefined" && window.localStorage.getItem("nextUser");
  localUser = localUser ? JSON.parse(localUser) : null;

  const userEmail = (localUser && localUser.email) || (session && session.user && session.user.email) || "";

  const [form, setForm] = useState({ name: "", phone: "", email: "", comment: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const pageTitle = "Contact Us | JKARE";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  // Set user email when component mounts or when userEmail changes
  useEffect(() => {
    if (userEmail) {
      setForm(prevForm => ({
        ...prevForm,
        email: userEmail
      }));
    }
  }, [userEmail]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create a beautifully formatted HTML email body
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #e91e63, #3f51b5); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; }
            .contact-info { background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #e91e63; }
            .info-row { display: flex; align-items: center; margin-bottom: 15px; }
            .info-row:last-child { margin-bottom: 0; }
            .info-label { font-weight: 600; color: #3f51b5; min-width: 80px; }
            .info-value { color: #333; }
            .message-section { margin-top: 30px; }
            .message-title { font-size: 18px; font-weight: 600; color: #3f51b5; margin-bottom: 15px; border-bottom: 2px solid #e91e63; padding-bottom: 8px; }
            .message-content { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; line-height: 1.6; color: #444; }
            .footer { background-color: #3f51b5; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .footer a { color: #ffeb3b; text-decoration: none; }
            .divider { height: 2px; background: linear-gradient(90deg, #e91e63, #3f51b5); margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">JKARE Organization</p>
            </div>
            
            <div class="content">
              <div class="contact-info">
                <div class="info-row">
                  <span class="info-label">👤 Name:</span>
                  <span class="info-value">${form.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">📧 Email:</span>
                  <span class="info-value">${form.email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">📞 Phone:</span>
                  <span class="info-value">${form.phone}</span>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <div class="message-section">
                <div class="message-title">💬 Message</div>
                <div class="message-content">
                  ${form.comment.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #1976d2; font-style: italic;">
                  📅 Received on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">This message was sent via the JKARE contact form</p>
              <p style="margin: 5px 0 0 0;">
                <a href="mailto:info@jkare.org">info@jkare.org</a> | 
                <a href="tel:305-248-1003">305-248-1003</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const response = await fetch(
        "https://vq4lz0otri.execute-api.ap-south-1.amazonaws.com/send/mail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: form.email,
            subject: `🌟 New Contact Form Submission from ${form.name} - JKARE`,
            mailBody: htmlBody,
          }),
        }
      );

      if (response.ok) {
        // Show success toast
        setShowToast(true);
        // Reset form
        setForm({ name: "", phone: "", email: "", comment: "" });
      } else {
        console.error("Failed to send email");
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Message sent successfully! We will contact you soon.</span>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* HERO – same layout as About page */}
      {/* -------------------------------------------------- */}
      <div className="relative h-[450px] w-full font-montserrat">
        <Image
          src="https://s3.ap-south-1.amazonaws.com/jkare.data/kid+waving+hair.jpg"
          alt="JKARE Hero"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
          priority
        />
        <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md px-10 py-5 shadow-lg rounded-r-2xl">
          <h1 className="text-customBlue text-4xl font-medium tracking-wide">Contact&nbsp;Us</h1>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* FORM + MAP */}
      {/* -------------------------------------------------- */}
      <section className="bg-gray-100 py-20 px-6 md:px-10 lg:px-16 xl:px-20 font-montserrat">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 place-items-stretch">
          {/* FORM CARD */}
          <div className="order-2 lg:order-1 flex flex-col justify-center bg-white border-l-8 border-customPink rounded-2xl shadow-xl p-8 sm:p-10 space-y-8">
            <div>
              <h2 className="text-customPink text-3xl font-medium mb-2">Send a Message</h2>
              <p className="text-gray-600">
                We'd love to hear from you! Fill out the form below or use the info alongside.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink/60"
                  required
                  disabled={isLoading}
                />
                
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={form.phone}
                  onChange={value => setForm({ ...form, phone: value || "" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink/60"
                  disabled={isLoading}
                />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink/60"
                required
                disabled={isLoading}
              />
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink/60"
                required
                disabled={isLoading}
              />
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-customPink hover:bg-customBlue transition-colors text-white font-medium py-3 px-8 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customBlue/70 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          {/* MAP */}
          <div className="order-1 lg:order-2 relative h-[450px] lg:h-auto w-full rounded-2xl overflow-hidden shadow-xl">
            <LoadScript googleMapsApiKey="AIzaSyAlEgLIgIlVsoN7-rNOF06Hr6r6klGYz4g">
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* INFO STRIP */}
      {/* -------------------------------------------------- */}
      <section className="bg-white py-12 px-6 md:px-10 lg:px-16 xl:px-20 font-montserrat">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="flex md:flex-col md:items-start items-center gap-4">
            <MapPin className="h-10 w-10 text-customBlue flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-customBlue">Address</h4>
              <p className="text-gray-700 leading-snug">
                4101&nbsp;SW&nbsp;73rd&nbsp;Avenue,<br />Unit C. Miami, FL&nbsp;33155<br />United States
              </p>
            </div>
          </div>

          <div className="flex md:flex-col md:items-start items-center gap-4">
            <Mail className="h-10 w-10 text-customBlue flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-customBlue">Email</h4>
              <p className="text-gray-700 leading-snug">info@jkare.org</p>
            </div>
          </div>

          <div className="flex md:flex-col md:items-start items-center gap-4">
            <Phone className="h-10 w-10 text-customBlue flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-customBlue">Phone</h4>
              <p className="text-gray-700 leading-snug">305‑248‑1003</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}