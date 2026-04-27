import React from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import JobCategories from "../components/JobCategories";
import FeaturedJobs from "../components/FeaturedJobs";
import CompanyCard from "../components/CompanyCard";
import VideoSection from "../components/VideoSection";
import LiveTicker from "../components/LiveTicker";
import ProcessBento from "../components/ProcessBento";
import CTA from "../components/CTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
      <header className="relative overflow-hidden bg-slate-900">
        <Hero />
      </header>

      {/* FACT: Removed space-y-20 so components sit flush and manage their own padding */}
      <main className="flex-grow w-full">
        <LiveTicker />
        <JobCategories />

        {/* Visual Break with subtle border */}
        <div className="w-full border-t border-slate-200/60 bg-white">
          <CompanyCard />
        </div>

        <FeaturedJobs />

        <div className="w-full border-t border-slate-200/60 bg-white">
          <ProcessBento />
        </div>

        <VideoSection />
        <Testimonials />
        <CTA />
      </main>

      <footer className="bg-[#0B1120] text-slate-400 w-full pt-20 pb-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Job1<span className="text-blue-500">Portal</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs font-medium">
              Connecting elite talent with tomorrow's leading companies. The
              most trusted career platform in the region.
            </p>
            <div className="flex space-x-3">
              {[FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>

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

        <div className="max-w-6xl mx-auto px-6 border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium">
          <p>© {new Date().getFullYear()} Job1 Portal. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 opacity-60">
            Engineered by Simtrak Solutions.
          </p>
        </div>
      </footer>
    </div>
  );
}
