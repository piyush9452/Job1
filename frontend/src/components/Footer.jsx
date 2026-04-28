import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-slate-400 w-full pt-20 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand & Socials */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Job1<span className="text-blue-500">Portal</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs font-medium">
            Connecting elite talent with tomorrow's leading companies. The most
            trusted career platform in the region.
          </p>

          <div className="flex space-x-4">
            {[
              { Icon: FaFacebookF, url: "https://simtrak.in" },
              {
                Icon: FaLinkedinIn,
                url: "https://www.linkedin.com/company/simtraksolutions/",
              },
              { Icon: FaInstagram, url: "https://simtrak.in" },
              { Icon: FaWhatsapp, url: "https://simtrak.in" },
            ].map(({ Icon, url }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                // FACT: Replicated the SCSS glassmorphism strictly with Tailwind.
                className="group relative overflow-hidden w-20 h-15 flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/20 border-r-white/5 border-b-white/5 shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <Icon
                  size={36}
                  className="text-white opacity-80 group-hover:opacity-100 transition-opacity"
                />
                {/* FACT: The Diagonal Shine Effect */}
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/30 skew-x-[45deg] group-hover:left-[200%] transition-all duration-500 ease-out pointer-events-none" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore Links */}
        <div className="grid grid-cols-2 lg:col-span-2 gap-8">
          <div>
            <h3 className="text-slate-50 font-bold mb-6 tracking-wide">
              Explore
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link
                  to="/jobs"
                  className="hover:text-blue-400 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-blue-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-blue-400 transition-colors"
                >
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-slate-50 font-bold mb-6 tracking-wide">
              Company
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-slate-50 font-bold mb-6 tracking-wide">
            Contact Us
          </h3>
          <div className="flex items-center space-x-3 text-sm font-medium">
            <FaPhoneAlt className="text-blue-500" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center space-x-3 text-sm font-medium">
            <FaEnvelope className="text-blue-500" />
            <span>support@job1.com</span>
          </div>
          <div className="flex items-start space-x-3 text-sm font-medium mt-2">
            <FaMapMarkerAlt className="text-blue-500 mt-1 shrink-0" />
            <span className="leading-relaxed">
              329 Sarojini Street,
              <br />
              Delhi, India.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium">
        <p>© {new Date().getFullYear()} Job1 Portal. All Rights Reserved.</p>
        <p className="mt-2 md:mt-0 opacity-60">
          Engineered by Simtrak Solutions.
        </p>
      </div>
    </footer>
  );
}
