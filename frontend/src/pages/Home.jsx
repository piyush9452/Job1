import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import JobCategories from "../components/JobCategories";
import FeaturedJobs from "../components/FeaturedJobs";
//   this is home
export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">

            <Hero/>
            <JobCategories/>
            <FeaturedJobs/>

            {/* Contact / Footer */}
            <footer className="bg-blue-700 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>Email: support@job1.com | Phone: +91 98765 43210</p>
                    <p className="mt-4 text-sm">© {new Date().getFullYear()} Job1 Portal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
