import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Testimonials() {
    const testimonials = [
        {
            title: "Great experience",
            text: "As a web developer, I truly appreciate platforms that combine functionality with simplicity. This job portal offered a great experience — fast, responsive, and well-organized.",
            name: "Lucas Gray",
            role: "Web Developer",
            img: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
            title: "Great quality!",
            text: "I am genuinely impressed with the quality this job portal offers. Every feature is thoughtfully designed and adds real value. As a consultant, I constantly recommend platforms to clients.",
            name: "Aliza Thompson",
            role: "Consultant",
            img: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
            title: "Very useful!",
            text: "The portal simplifies the job search process beautifully. Its UI is intuitive, and the performance is top-notch. Loved using it!",
            name: "Ryan Cooper",
            role: "Project Manager",
            img: "https://randomuser.me/api/portraits/men/52.jpg",
        },
    ];

    return (
        <section className="bg-blue-50 py-16">
            <h2 className="text-3xl font-bold text-center mb-10">Trusted by Professionals</h2>

            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={2}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                className="max-w-6xl mx-auto"
                breakpoints={{
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                }}
            >
                {testimonials.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center mx-4 transition-all duration-300 hover:shadow-xl">
                            <h3 className="text-blue-600 font-semibold mb-4">{item.title}</h3>
                            <p className="text-gray-600 italic mb-6">{item.text}</p>
                            <div className="flex flex-col items-center">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-full mb-3 border-2 border-blue-200"
                                />
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-blue-500 text-sm">{item.role}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
