"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { CiShoppingCart, CiUser, CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSession, signOut } from "next-auth/react";
import { DataContext } from "./client/DataContextProvider";
import Cart from "./client/Cart";
import { FaArrowRight } from "react-icons/fa";
import { CartContext } from "./SessionProVider";


const Navbar = () => {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: session } = useSession();
  const data = useContext(DataContext);
  const [cartItems, setCartItems] = useContext(CartContext);
  const menuRef = useRef();
  const userCardRef = useRef();
  const searchRefDesktop = useRef();
  const searchRefMobile = useRef();
  const cartRef = useRef();
  const closeMenuTimer = useRef(null);
  const delayedCloseMobileMenu = () => {
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 800);
  };

  // Delayed close for desktop dropdowns
  const handleMenuMouseLeave = () => {
    closeMenuTimer.current = setTimeout(() => setActive(null), 800); // 2.2s delay
  };
  const handleMenuMouseEnter = () => {
    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
  };

  // Fetch product search results
  const searchHandler = async (e) => {
    try {
      const val = e.target.value;
      setSearchQuery(val);
      if (val.trim().length > 0) {
        setIsSearchDropdownVisible(true);
      } else {
        setIsSearchDropdownVisible(false);
      }
      const res = await fetch(`/api/product?query=${val}`);
      const result = await res.json();
      setSearchResults(result);
    } catch (err) {
      console.log(err);
    }
  };

  // Sign out
  const signMeOut = () => {
    window.localStorage.clear();
    signOut();
  };

  // Close menus on outside click
  const handleClickOutside = (event) => {
    if (
      !searchRefDesktop.current?.contains(event.target) &&
      !searchRefMobile.current?.contains(event.target) &&
      isSearchDropdownVisible
    ) {
      setIsSearchDropdownVisible(false);
    }

    if (
      userCardRef.current &&
      !userCardRef.current.contains(event.target) &&
      isUserCardOpen
    ) {
      setIsUserCardOpen(false);
    }

    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      isMobileMenuOpen
    ) {
      setIsMobileMenuOpen(false);
    }

    if (
      cartRef.current &&
      !cartRef.current.contains(event.target) &&
      isCartOpen
    ) {
      setIsCartOpen(false);
    }
  };
  useEffect(() => {
    const closeHandler = () => setIsCartOpen(false);
    window.addEventListener('closeCart', closeHandler);
    return () => window.removeEventListener('closeCart', closeHandler);
  }, []);
  useEffect(() => {
    // Load cart from localStorage
    const localCart =
      typeof window !== "undefined" && window.localStorage.getItem("medCart");
    if (localCart) setCartItems(JSON.parse(localCart).length);

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSearchDropdownVisible, isUserCardOpen, isMobileMenuOpen]);

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      {/* Top Bar: only visible on md+ */}
      <div className="hidden md:flex bg-customBlue py-2 overflow-hidden">
        <div className="marquee">
          <p className="inline-block text-white text-sm md:text-base font-medium">
            Questions? Call Us Toll-Free <span className="font-bold">305-248-1003</span>
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-lg px-4 lg:px-8 py-2 flex items-center justify-between">
        {/* Left: Logo + Mobile Search */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Logo */}
          <Link href="/">
            <img
              src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
              alt="Logo"
              className="h-6 md:h-8 lg:h-10 flex-shrink-0"
            />

          </Link>

          {/* Mobile Search */}
          <div className="relative block lg:hidden flex-1" ref={searchRefMobile}>
            <input
              type="text"
              placeholder="Search Jkare"
              value={searchQuery}
              onChange={searchHandler}
              className="w-full px-3 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <CiSearch size={18} />
            </span>

            {/* Search dropdown (mobile) */}

            {isSearchDropdownVisible && (
              <div className="absolute  top-full  mt-2  w-72 bg-white shadow-lg rounded-lg p-4 z-50 left-1/2 -translate-x-1/2">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="list-none p-0">
                      {searchResults.map((item) => (
                        <Link
                          href={`/product/${item._id}`}
                          key={item._id}
                          className="flex items-center p-2 border-b border-gray-200 hover:bg-blue-50 rounded-md transition"
                          onClick={() => setIsSearchDropdownVisible(false)}
                        >
                          <img
                            src={item.prod_images[0]}
                            alt={item.prod_name}
                            className="w-8 h-8 rounded-md object-cover mr-3"
                          />
                          <span className="text-gray-800 text-sm">
                            {item.prod_name}
                          </span>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-gray-500 text-center">
                      No items found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Secondary Nav (desktop) */}
        <div className="hidden lg:flex" onMouseLeave={handleMenuMouseLeave} onMouseEnter={handleMenuMouseEnter}>
          {/* Navbar Menu */}
          <div className="flex items-center space-x-6 font-semibold text-sm px-5 rounded-3xl font-montserrat">
            <Menu setActive={setActive}>
              <Link href="/">
                <MenuItem setActive={setActive} active={active} item="Home" />
              </Link>
              <MenuItem setActive={setActive} active={active} item="Products">
                {/* Submenu for 'Products' (unchanged) */}
                <div className="flex flex-col text-sm bg-white  px-2 rounded-md">
                  {data.map((d) => (
                    <HoveredLink key={d.name} href={`/category/${d.name}`}>
                      {d.name}
                    </HoveredLink>
                  ))}
                  <div className="flex items-center">
                    <HoveredLink href="/category">
                      <div className="pr-2 font-normal text-black hover:text-customPink">
                        Shop All
                      </div>
                    </HoveredLink>
                    <FaArrowRight
                      className="text-black hover:text-customPink"
                      size={14}
                    />
                  </div>
                </div>
              </MenuItem>
              <Link href="/about-us">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="About Us"
                />
              </Link>
              <Link href="/our-services">
                <MenuItem setActive={setActive} active={active} item="Services" />
              </Link>
              {/* Patient Resources with multi-column submenu */}
              <MenuItem
                setActive={setActive}
                active={active}
                item="Patient Resources">
                {/* EXACT multi-column layout shown in your screenshot */}
                <div className="grid grid-cols-5 gap-8 w-[1400px] p-4 rounded-md text-gray-800 font-light">
                  {/* 1st Column */}
                  <div>
                    <h4 className="text-base font-semibold mb-1">
                      Safety & Emergency Planning
                    </h4>
                    <hr className="border-gray-300 mb-2" />
                    <div className="flex flex-col space-y-1 text-sm">
                      <HoveredLink href="/Safety&Emergency" >
                        Emergency Planning for the Home Care Patient
                      </HoveredLink>
                      <HoveredLink href="/Safety&Emergency" >
                        How to Make Your Home Safe for Medical Care
                      </HoveredLink>
                    </div>
                  </div>
                  {/* 2nd Column */}
                  <div>
                    <h4 className="text-base font-semibold mb-1">
                      Patient Rights & Advocacy
                    </h4>
                    <hr className="border-gray-300 mb-2" />
                    <div className="flex flex-col space-y-1 text-sm">
                      <HoveredLink href="/PatientRights">HIPAA Privacy Notice</HoveredLink>
                      <HoveredLink href="/PatientRights">
                        Patient&apos;s Bill of Rights and Responsibilities
                      </HoveredLink>
                      <HoveredLink href="/PatientRights">
                        Patient Grievance and Complaint Procedure
                      </HoveredLink>
                      <HoveredLink href="/PatientRights">
                        Making Decisions About Your Health Care
                      </HoveredLink>
                    </div>
                  </div>
                  {/* 3rd Column */}
                  <div>
                    <h4 className="text-base font-semibold mb-1">
                      Support Policies & Information
                    </h4>
                    <hr className="border-gray-300 mb-2" />
                    <div className="flex flex-col space-y-1 text-sm">
                      <HoveredLink href="/SupportPolicies">
                        Medicare DMEPOS Supplier Standards
                      </HoveredLink>
                      <HoveredLink href="/SupportPolicies">Warranty Information</HoveredLink>
                      <HoveredLink href="/SupportPolicies">Insurance Information</HoveredLink>
                      <HoveredLink href="/SupportPolicies">Prescription Requirements</HoveredLink>
                      <HoveredLink href="/SupportPolicies">Medicare Support</HoveredLink>
                    </div>
                  </div>
                  {/* 4th Column */}
                  <div>
                    <h4 className="text-base font-semibold mb-1">
                      Equipment Guides & Instructions
                    </h4>
                    <hr className="border-gray-300 mb-2" />
                    <div className="flex flex-col space-y-1 text-sm">
                      <HoveredLink href="/EquipmentGuide">
                        Customer Instruction Guide for CPAP & BiPAP
                      </HoveredLink>
                      <HoveredLink href="/EquipmentGuide">
                        Nebulizer/Compressor Therapy & Cleaning Instructions
                      </HoveredLink>
                    </div>
                  </div>
                  {/* 5th Column */}
                  <div>
                    <h4 className="text-base font-semibold mb-1">
                      Product Information
                    </h4>
                    <hr className="border-gray-300 mb-2" />
                    <div className="flex flex-col space-y-1 text-sm">
                          {/* <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "biwaze-clear-lung-expansion-device-for-home-care"
                      )}`}>BiWaze Clear Lung Expansion Device for Home Care</HoveredLink>
                      <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "biwaze-cough-for-home-care-english"
                      )}`}>Biwaze Cough For Home Care (English)</HoveredLink> */}
                      <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "afflovest-english"
                      )}`}>Afflovest (English)</HoveredLink>
                      <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "oxlife-liberty-user-manual"
                      )}`}>Oxlife Liberty User Manual</HoveredLink>
                      <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "myairvo-use-and-care-guide"
                      )}`}>MyAirvo Use and Care Guide</HoveredLink>
                              <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "biwaze-clear-lung-expansion-device-for-home-care"
                      )}`}>BiWaze Products</HoveredLink>
                    </div>
                  </div>
                  {/* 6th Column */}
                  {/* <div>
                    <h4 className="text-base font-semibold mb-1">
                      Biwaze Products
                    </h4>
                    <hr className="border-gray-300 mb-2" />
                    <div className="flex flex-col space-y-1 text-sm">
                          <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "biwaze-clear-lung-expansion-device-for-home-care"
                      )}`}>BiWaze Clear Lung Expansion Device for Home Care</HoveredLink>
                      <HoveredLink href={`/ProductBrochers#${encodeURIComponent(
                        "biwaze-cough-for-home-care-english"
                      )}`}>Biwaze Cough For Home Care (English)</HoveredLink>
              
                    </div>
                  </div> */}
                </div>


              </MenuItem>
              <Link href="/Recruitment-Staffing">
                <MenuItem setActive={setActive} active={active} item="Recruiting" />
              </Link>
              <Link href="/contact-us">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Contact Us"
                />
              </Link>
            </Menu>
          </div>
        </div>

        {/* Right: Desktop Search (lg+), Cart, User, Hamburger */}
        <div className="flex items-center space-x-4 ml-2 sm:ml-4">
          {/* Desktop Search: hidden on mobile */}
          <div className="relative hidden lg:block" ref={searchRefDesktop}>
            <input
              type="text"
              placeholder="Search Jkare"
              value={searchQuery}
              onChange={searchHandler}
              className="w-64 px-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <CiSearch size={18} />
            </span>
            {/* Search dropdown (desktop) */}
            {isSearchDropdownVisible && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="list-none p-0">
                      {searchResults.map((item) => (
                        <Link
                          href={`/product/${item._id}`}
                          key={item._id}
                          className="flex items-center p-2 border-b border-gray-200 hover:bg-blue-50 rounded-md transition"
                          onClick={() => setIsSearchDropdownVisible(false)}
                        >
                          <img
                            src={item.prod_images[0]}
                            alt={item.prod_name}
                            className="w-8 h-8 rounded-md object-cover mr-3"
                          />
                          <span className="text-gray-800 text-sm">
                            {item.prod_name}
                          </span>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-gray-500 text-center">
                      No items found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <CiShoppingCart
              size={24}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(!isCartOpen);
              }}
            />
            {cartItems > 0 && (
              <span
                className="absolute -top-2 -right-2 inline-flex items-center justify-center
                  px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
              >
                {cartItems}
              </span>
            )}
            {isCartOpen && <Cart isCartOpen={isCartOpen} authSession={session} cartRef={cartRef} />}
          </div>

          {/* User (Desktop) */}
          <div className="hidden lg:block">
            {session && session.user ? (
              <div className="relative" ref={userCardRef}>
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => setIsUserCardOpen(!isUserCardOpen)}
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <CgProfile size={24} />
                  )}
                </div>
                {isUserCardOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-200">
                    <p className="font-semibold truncate">{session.user.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {session.user.email}
                    </p>
                    {session.provider === "credentials" && (
                      <Link href="/account-settings">
                        <button className="mt-2 w-full bg-blue-600 text-white py-1 px-2 rounded">
                          Account Setting
                        </button>
                      </Link>
                    )}
                    <Link href="/order-history">
                      <button className="mt-2 w-full bg-blue-600 text-white py-1 px-2 rounded">
                        My Orders
                      </button>
                    </Link>
                    <button
                      onClick={signMeOut}
                      className="mt-2 w-full bg-blue-600 text-white py-1 px-2 rounded"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center space-x-1">
                <CiUser size={20} />
                <span className="text-gray-700">Sign In</span>
              </Link>
            )}
          </div>

          {/* Hamburger (Mobile) */}
          <div className="lg:hidden">
            <GiHamburgerMenu
              size={24}
              className="cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={menuRef} className="lg:hidden bg-white shadow-md border-t border-gray-200">
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="font-semibold text-gray-700">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 hover:text-gray-800 "
            >
              Close
            </button>
          </div>
          <div className=" space-y-2 px-4 pb-4 overflow-y-auto max-h-[calc(100dvh-96px)]">
            <Link
              href="/"
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
              onClick={delayedCloseMobileMenu}
            >
              Home
            </Link>
            <button
              onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
              className="flex items-center justify-between w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
            >
              <span>Products</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isProductsDropdownOpen ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"
                  }
                />
              </svg>
            </button>
            {isProductsDropdownOpen && (
              <div className="ml-6 space-y-1">
                {data.map((d) => (
                  <Link
                    key={d.name}
                    href={`/category/${d.name}`}
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-1 rounded"
                    onClick={delayedCloseMobileMenu}
                  >
                    {d.name}
                  </Link>
                ))}
                <div className="flex items-center ml-3 mt-1">
                  <HoveredLink href="/category" onClick={delayedCloseMobileMenu}>
                    <div className="pr-2 text-blue-600 hover:underline">
                      Shop All
                    </div>
                  </HoveredLink>
                  <FaArrowRight className="text-blue-600" size={14} />
                </div>
              </div>
            )}
            <button
              onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
              className="flex items-center justify-between w-full text-left px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
            >
              <span>Patient Resources</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isProductsDropdownOpen ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"
                  }
                />
              </svg>
            </button>
            {isPatientDropdownOpen && (
              <div className="ml-6 space-y-1 text-sm">

                {/* ——— 1. Safety & Emergency Planning ——— */}
                <span className="block font-semibold mt-2">Safety & Emergency Planning</span>
                <Link href="/Safety&Emergency" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Emergency Planning for the Home Care Patient
                </Link>
                <Link href="/Safety&Emergency" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  How to Make Your Home Safe for Medical Care
                </Link>

                {/* ——— 2. Patient Rights & Advocacy ——— */}
                <span className="block font-semibold mt-3">Patient Rights & Advocacy</span>
                <Link href="/PatientRights" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  HIPAA Privacy Notice
                </Link>
                <Link href="/PatientRights" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Patient’s Bill of Rights and Responsibilities
                </Link>
                <Link href="/PatientRights" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Patient Grievance and Complaint Procedure
                </Link>
                <Link href="/PatientRights" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Making Decisions About Your Health Care
                </Link>

                {/* ——— 3. Support Policies & Information ——— */}
                <span className="block font-semibold mt-3">Support Policies & Information</span>
                <Link href="/SupportPolicies" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Medicare DMEPOS Supplier Standards
                </Link>
                <Link href="/SupportPolicies" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Warranty Information
                </Link>
                <Link href="/SupportPolicies" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Insurance Information
                </Link>
                <Link href="/SupportPolicies" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Prescription Requirements
                </Link>
                <Link href="/SupportPolicies" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Medicare Support
                </Link>

                {/* ——— 4. Equipment Guides & Instructions ——— */}
                <span className="block font-semibold mt-3">Equipment Guides & Instructions</span>
                <Link href="/EquipmentGuide" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Customer Instruction Guide for CPAP & BiPAP
                </Link>
                <Link href="/EquipmentGuide" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Nebulizer/Compressor Therapy & Cleaning Instructions
                </Link>

                {/* ——— 5. Product Information ——— */}
                <span className="block font-semibold mt-3">Product Information</span>
                 {/* <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Airway Clearance System User Manual
                </Link>
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Clear Quick Hits
                </Link> */}
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Afflovest (English)
                </Link>
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Products
                </Link>
                {/* <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Cough User Manual (English)
                </Link>
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Cough User Manual (Spanish)
                </Link> */}
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Oxlife Liberty User Manual
                </Link>
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  MyAirvo Use and Care Guide
                </Link>
                {/* ——— 6.Biwaze Product  ——— */}
                {/* <span className="block font-semibold mt-3">Biwaze Products</span>
                 <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Airway Clearance System User Manual
                </Link>
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Clear Quick Hits
                </Link>
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Cough User Manual (English)
                </Link>
                <Link href="/ProductBrochers" onClick={delayedCloseMobileMenu} className="block px-3 py-1 rounded text-gray-600 hover:bg-gray-100">
                  Biwaze Cough User Manual (Spanish)
                </Link> */}
              </div>
            )}

            <Link
              href="/about-us"
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
              onClick={delayedCloseMobileMenu}

            >
              About Us
            </Link>
            <Link
              href="/our-services"
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
              onClick={delayedCloseMobileMenu}
            >
              Our Services
            </Link>
            <Link
              href="/Recruitment-Staffing"
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
              onClick={delayedCloseMobileMenu}
            >
              Recruiting
            </Link>
            <Link
              href="/contact-us"
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded"
              onClick={delayedCloseMobileMenu}
            >
              Contact Us
            </Link>

            {/* Mobile User Section */}
            {session && session.user ? (
              <div className="block px-3 py-2 rounded-md bg-gray-50">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-gray-600">{session.user.email}</p>
                <div className="mt-3 flex flex-col space-y-2">
                  {session.provider === "credentials" && (
                    <Link href="/account-settings">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded">
                        Edit Profile
                      </button>
                    </Link>
                  )}
                  <Link href="/order-history" onClick={delayedCloseMobileMenu}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded">
                      Order History
                    </button>
                  </Link>
                  <button
                    onClick={signMeOut}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <div className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded">
                  Sign In
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
