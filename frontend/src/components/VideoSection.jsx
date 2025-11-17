export default function VideoSection() {
    return (
        <div className="flex flex-col mt-10 p-10">
            <h1 className="text-3xl md:text-5xl font-sans leading-tight">
                How Job1 helps you grow</h1>
            <p className="mt-6 text-lg md:text-xl text-gray-500">Discover top talent or your next big opportunity — all in one place.</p>
            <div className="my-5 flex justify-center">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    width="1200"

                >
                    <source src="/video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}
