
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Button from "../Button";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

function Navigation() {
  const router = useRouter();
  const { user, setUser, loading } = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowInput(false);
    setMobileMenuOpen(false);
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setCategoryMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setCategoryMenuOpen(false);
        setMobileMenuOpen(false);
        setMobileCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.push("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
  };

  return (
    <>
      {/* Slim top nav */}
      <div
        className="w-full py-2 px-6 flex justify-end items-center text-sm bg-[#0a1526] text-white"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {!loading && !user && (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
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
        <Link href="/" className="text-2xl font-bold">
          Chest of Contemplation
        </Link>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <div className="flex items-center gap-10">
            <Link href="/" className="hover:opacity-80 transition">
              Home
            </Link>

            <Link href="/blog" className="hover:opacity-80 transition">
              Blog
            </Link>

            {/* Categories Mega Dropdown */}
            <div
              className="relative"
              ref={categoryRef}
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => setCategoryMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                aria-expanded={categoryMenuOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 hover:opacity-80 transition py-2"
              >
                Categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoryMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoryMenuOpen && (
                <div className="absolute left-0 top-full pt-3 w-[420px] z-[100]">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 text-gray-800 dark:text-gray-100">

                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="font-semibold text-sm">
                        Explore Categories
                      </h3>

                      <span className="text-xs text-gray-400">
                        {categories.length} categories
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto overscroll-contain pr-2 custom-scrollbar">
                      {categoriesLoading ? (
                        <div className="py-6 text-center text-sm text-gray-400">
                          Loading categories...
                        </div>
                      ) : categories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1">
                          {categories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/blog-category/${category.slug}`}
                              onClick={() => setCategoryMenuOpen(false)}
                              className="px-3 py-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors truncate"
                              title={category.name}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="py-6 text-center text-sm text-gray-400">
                          No categories available.
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3">
                      <Link
                        href="/blog"
                        onClick={() => setCategoryMenuOpen(false)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                      >
                        Explore all posts →
                      </Link>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <Link href="/contact" className="hover:opacity-80 transition">
              Contact
            </Link>

            <Link href="/about" className="hover:opacity-80 transition">
              About
            </Link>
          </div>

          {/* Search + Subscribe + User */}
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
                  if (showInput && query.trim()) {
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
                text: "var(--foreground)",
              }}
            />

            {/* User Avatar */}
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
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            router.push("/admin");
                            setDropdownOpen(false);
                          }}
                        >
                          Admin Panel
                        </li>
                      ) : (
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
            className="absolute top-full left-0 w-full flex flex-col gap-4 p-6 shadow md:hidden z-[999]"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <Link href="/" onClick={closeMobileMenu}>
              Home
            </Link>

            <Link href="/blog" onClick={closeMobileMenu}>
              Blog
            </Link>

            {/* Mobile Categories Accordion */}
            <div className="w-full">
              <button
                type="button"
                onClick={() =>
                  setMobileCategoriesOpen(!mobileCategoriesOpen)
                }
                aria-expanded={mobileCategoriesOpen}
                className="flex items-center justify-between w-full"
              >
                <span>Categories</span>

                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileCategoriesOpen && (
                <div className="mt-3 ml-2 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                  <div className="max-h-56 overflow-y-auto overscroll-contain flex flex-col gap-1 pr-2">
                    {categoriesLoading ? (
                      <p className="text-sm text-gray-400 py-2">
                        Loading categories...
                      </p>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/blog-category/${category.slug}`}
                          onClick={closeMobileMenu}
                          className="py-2 px-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 py-2">
                        No categories available.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/contact" onClick={closeMobileMenu}>
              Contact
            </Link>

            <Link href="/about" onClick={closeMobileMenu}>
              About
            </Link>

            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center gap-3 w-full mt-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="border rounded-lg px-3 py-2 text-sm outline-none flex-1 min-w-0 bg-transparent"
              />

              <button type="submit" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
            </form>

            <Button
              text="Subscribe"
              href="/#subscribe"
              style={{
                backgroundColor: "var(--cta-color)",
                color: "var(--foreground)",
              }}
            />

            {/* Mobile User Menu */}
            {!loading && user && (
              <div className="flex flex-col gap-2 pt-4 border-t mt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl || "/default.webp"}
                    alt={user.name || "User Avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <span className="text-sm font-medium">
                    {user.name}
                  </span>
                </div>

                {user.role === "admin" ? (
                  <button
                    onClick={() => {
                      router.push("/admin");
                      closeMobileMenu();
                    }}
                    className="text-left text-sm px-2 py-1"
                  >
                    Admin Panel
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      router.push("/settings");
                      closeMobileMenu();
                    }}
                    className="text-left text-sm px-2 py-1"
                  >
                    Settings
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="text-left text-sm px-2 py-1 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navigation;
