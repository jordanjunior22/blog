"use client";
import React, { useState, useEffect } from "react";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";

const iconMap = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: FaFacebookF,
  youtube: FaYoutube,
  tiktok: FaTiktok,
};

function About() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/user/role?role=admin");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUser(data[0] || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-6 md:px-30 md:py-15 flex flex-col md:flex-row items-center max-w-7xl mx-auto gap-10 animate-pulse">
        <div className="flex-shrink-0 w-full h-[400px] md:w-4/10 bg-gray-200 rounded-lg" />
        <div className="w-full md:w-2/3 space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="flex space-x-4 mt-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-gray-500">No user found.</p>;
  }

  return (
    <div className="px-6 py-6 md:px-30 md:py-15 flex flex-col md:flex-row items-center max-w-7xl mx-auto gap-10">
      {/* Profile Image */}
      <div className="flex-shrink-0 w-full h-[400px] md:w-4/10 rounded-lg overflow-hidden shadow-lg">
        <img
          src={user.avatarUrl || "/default.webp"}
          alt={user.bioTitle || "Profile"}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>

      {/* Text & Socials */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-4">{user.bioTitle}</h1>
        <p className="text-gray-700 text-sm leading-relaxed mb-6 whitespace-pre-line">
          {user.bio}
        </p>

        <div className="flex justify-center md:justify-start space-x-4 text-gray-600">
          {(user.links || []).map(({ label, url }, idx) => {
            if (!label || typeof label !== "string" || !url) return null;

            const key = label.toLowerCase().trim();
            const Icon = iconMap[key];

            return (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-blue-500 transition-colors bg-purple-200 p-2 rounded-full flex items-center justify-center w-10 h-10"
              >
                {Icon ? <Icon size={20} /> : <span>{label[0].toUpperCase()}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default About;
