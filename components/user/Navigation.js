// components/Navigation.js
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import Button from "../Button";
import { useUser } from "@/context/userContext"; // Assuming this path
import { useRouter } from "next/navigation";

function Navigation() {
  const router = useRouter();
  const { user, setUser, loading } = useUser(); // Destructure loading state

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleSearch = () => {
    if (!query) return;
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      {/* Slim top nav */}
      <div
        className="w-full py-2 px-6 flex justify-end items-center text-sm bg-[#0a1526] text-white"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {/* Conditionally render Login/Avatar based on loading and user state */}
        {!loading && !user && (
          <a href="/login" className="hover:underline">
            Login
          </a>
        )}
      </div>

      {/* Main nav */}
      <nav
        className="w-full py-4 flex justify-between items-center shadow relative z-50 px-6 md:px-30"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        {/* Logo */}
        <div className="text-2xl font-bold">Chest of Contemplation </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {/* Navigation Links */}
          <div className="flex items-center gap-10">
            <a href="/" className="hover:opacity-80 transition">
              Home
            </a>
            <a href="/blog" className="hover:opacity-80 transition">
              Blog
            </a>
            <a href="/contact" className="hover:opacity-80 transition">
              Contact
            </a>
            <a href="/about" className="hover:opacity-80 transition">
              About
            </a>
          </div>

          {/* Search + Button + User Avatar */}
          <div className="flex items-center gap-6 relative">
            <div className="relative flex items-center gap-2">
              {showInput && (
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="border rounded-lg px-3 py-1 text-sm outline-none transition-all w-48"
                  placeholder="Search post..."
                />
              )}
              <Search
                className="w-5 h-5 cursor-pointer text-gray-600 hover:text-purple-600"
                onClick={() => {
                  if (showInput && query) {
                    handleSearch();
                  } else {
                    setShowInput(!showInput);
                  }
                }}
              />
            </div>

            <Button
              text="Subscribe"
              href="/#subscribe"
              style={{
                backgroundColor: "var(--cta-color)",
                color: "var(--foreground)",
              }}
            />

            {/* User Avatar & Dropdown */}
            {/* Render avatar only when not loading and user data is available */}
            {!loading && user && (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 cursor-pointer select-none bg-gray-100"
                  aria-label="User menu"
                >
                  <img
                    src={user.avatarUrl || "/default.webp"}
                    alt={user.name || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-500 dark:text-black border rounded-md shadow-lg z-50">
                    <ul>
                      {user.role === "admin" ? (
                        <li
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer "
                          onClick={() => {
                            router.push("/admin");
                            setDropdownOpen(false);
                          }}
                        >
                          Admin Panel
                        </li>
                      ) : (
                        <li
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                          onClick={() => {
                            router.push("/settings");
                            setDropdownOpen(false);
                          }}
                        >
                          Settings
                        </li>
                      )}
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="absolute top-full left-0 w-full flex flex-col items-start gap-4 p-6 bg-white shadow md:hidden"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <a href="/" className="hover:opacity-80 transition w-full">
              Home
            </a>
            <a href="/blog" className="hover:opacity-80 transition w-full">
              Blog
            </a>
            <a href="/contact" className="hover:opacity-80 transition w-full">
              Contact
            </a>
            <a href="/about" className="hover:opacity-80 transition w-full">
              About
            </a>
            <div className="flex items-center justify-between w-full mt-4">
              <Search className="w-5 h-5 cursor-pointer" />
              <Button
                text="Subscribe"
                href="/subscribe"
                style={{
                  backgroundColor: "var(--cta-color)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navigation;