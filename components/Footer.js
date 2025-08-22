"use client";
import React, { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

import {
  FaTiktok,
  FaYoutube,
  FaPinterest,
  FaReddit,
  FaSnapchat,
} from "react-icons/fa";

const lucideIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

const reactIcons = {
  tiktok: FaTiktok,
  youtube: FaYoutube,
  pinterest: FaPinterest,
  reddit: FaReddit,
  snapchat: FaSnapchat,
};

function Footer() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch("/api/user/role?role=admin");
        if (!res.ok) throw new Error("Failed to fetch admin user");
        const data = await res.json();
        if (data[0]?.links) setLinks(data[0].links);
      } catch (error) {
        console.error("Error loading footer links:", error);
      }
    }

    fetchSocialLinks();
  }, []);

  return (
    <footer className="bg-[#0a1526] text-[#e0e4f1] px-6 md:px-32 py-10 text-sm font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between flex-wrap gap-8">
        {/* Left section */}
        <div className="max-w-xs md:mb-0">
          <h3 className="font-bold mb-2.5 text-lg">Chest of Contemplation</h3>
          <p className="leading-relaxed">
            Ploughing the depths of human thought through poetic wisdom and philosophical inquiry...
          </p>
          <p className="mt-5 leading-relaxed text-[#8c8f98] whitespace-pre-line text-sm">
            chestofcontemplation@gmail.com
          </p>
        </div>

        {/* Right section */}
        <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
          <nav className="flex flex-wrap gap-5 text-sm">
            <a href="/" className="text-[#e0e4f1] hover:underline">Home</a>
            <a href="/blog" className="text-[#e0e4f1] hover:underline">Blog</a>
            <a href="/about" className="text-[#e0e4f1] hover:underline">About us</a>
            <a href="/contact" className="text-[#e0e4f1] hover:underline">Contact us</a>
            <a href="/privacy-policy" className="text-[#e0e4f1] hover:underline">Privacy Policy</a>
          </nav>

          {/* Social icons */}
          <div className="flex gap-4">
            {links.map(({ label, url }, index) => {
              if (!label || !url) return null;

              const key = label.toLowerCase();
              const LucideIcon = lucideIcons[key];
              const ReactIcon = reactIcons[key];

              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#8c8f98] hover:text-[#e0e4f1] transition-colors duration-200"
                >
                  {LucideIcon ? (
                    <LucideIcon size={18} />
                  ) : ReactIcon ? (
                    <ReactIcon size={18} />
                  ) : (
                    <span className="text-xs uppercase font-semibold">{label[0]}</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="border-[#23304e] my-5" />

      <p className="text-center text-[#8c8f98] text-xs m-0">
        © 2025 Chest of Contemplation. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
