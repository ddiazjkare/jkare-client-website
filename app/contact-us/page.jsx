/* eslint-disable react/no-unescaped-entities */
"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Mail, Phone, MapPin } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 25.7617,
  lng: -80.1918,
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", comment: "" });
  const pageTitle = "Contact Us | JKARE";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.table(form); // TODO: connect to backend
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

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
                We’d love to hear from you! Fill out the form below or use the info alongside.
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
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink/60"
                  required
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
              />
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink/60"
                required
              />
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-customPink hover:bg-customBlue transition-colors text-white font-medium py-3 px-8 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customBlue/70"
                >
                  Send Message
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
                4101&nbsp;SW&nbsp;73rd&nbsp;Avenue,<br />Unit C. Miami, FL&nbsp;33155<br />United States
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
