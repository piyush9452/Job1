import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

export default function Testimonials() {
    const testimonials = [
        {
            title: "Great experience",
            text: "As a web developer, I truly appreciate platforms that combine functionality with simplicity. This portal offered a great experience — fast, responsive, and well-organized.",
            name: "Lucas Gray",
            role: "Web Developer",
            img: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 5
        },
        {
            title: "Great quality!",
            text: "I am genuinely impressed with the quality this job portal offers. Every feature is thoughtfully designed and adds real value. I constantly recommend it to my clients.",
            name: "Aliza Thompson",
            role: "Consultant",
            img: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 5
        },
        {
            title: "Very useful!",
            text: "The portal simplifies the job search process beautifully. Its UI is intuitive, and the performance is top-notch. It's easily the best recruitment tool I've used this year.",
            name: "Ryan Cooper",
            role: "Project Manager",
            img: "https://randomuser.me/api/portraits/men/52.jpg",
            rating: 4
        },
    ];

    return (
        <section className="bg-slate-50 py-24 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative">

                {/* Header with Custom Navigation */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-left">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Testimonials</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                            What the <span className="text-blue-600">Community</span> Says
                        </h2>
                    </div>

                    {/* Custom Nav Buttons */}
                    <div className="flex gap-3">
                        <button className="prev-btn w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                            <FaChevronLeft size={16} />
                        </button>
                        <button className="next-btn w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                            <FaChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={2}
                    navigation={{
                        prevEl: ".prev-btn",
                        nextEl: ".next-btn",
                    }}
                    pagination={{ clickable: true, el: ".custom-pagination" }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        1024: { slidesPerView: 2 },
                    }}
                    className="!pb-16"
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 relative h-full flex flex-col justify-between group hover:border-blue-200 transition-colors duration-300">

                                {/* Background Decorative Quote */}
                                <FaQuoteLeft className="absolute top-10 right-10 text-slate-100 text-6xl group-hover:text-blue-50 transition-colors duration-300" />

                                <div className="relative z-10">
                                    <div className="flex gap-1 mb-6 text-amber-400">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <FaStar key={i} size={14} />
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed italic">
                                        "{item.text}"
                                    </p>
                                </div>

                                <div className="mt-10 flex items-center gap-4 border-t border-slate-50 pt-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="relative w-14 h-14 rounded-full border-2 border-white object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-none">{item.name}</p>
                                        <p className="text-blue-600 text-sm mt-1 font-medium">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Pagination Dot Positioning */}
                <div className="custom-pagination mt-4 flex justify-center gap-2" />
            </div>
        </section>
    );
}
