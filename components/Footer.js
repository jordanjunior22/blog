import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#0a1526] text-[#e0e4f1] px-6 md:px-32 py-10 text-sm font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between flex-wrap gap-8">
        {/* Left section */}
        <div className="max-w-xs md:mb-0">
          <h3 className="font-bold mb-2.5 text-lg">Philosophic</h3>
          <p className="leading-relaxed">
            Exploring the depths of human thought through poetic wisdom and philosophical inquiry.
          </p>
          <p className="mt-5 leading-relaxed text-[#8c8f98] whitespace-pre-line text-sm">
            Finstreet 118 2561 Fintown{"\n"}
            Hello@gmail.com 020 7993 2905
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
            <a href="#" aria-label="Facebook" className="text-[#8c8f98] hover:text-[#e0e4f1] transition-colors duration-200">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Twitter" className="text-[#8c8f98] hover:text-[#e0e4f1] transition-colors duration-200">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="text-[#8c8f98] hover:text-[#e0e4f1] transition-colors duration-200">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-[#8c8f98] hover:text-[#e0e4f1] transition-colors duration-200">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      <hr className="border-[#23304e] my-5" />

      <p className="text-center text-[#8c8f98] text-xs m-0">
        © 2025 Philosophica. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
