import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import shraddhadi from "../assets/websocket.webp";
import quizzy from "../assets/quiz.webp";
import leadery from "../assets/leaderboard.webp";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 800,
  easing: "ease-in-out-cubic",
  once: false,
  mirror: true,
});

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Enhanced Landing Page Animations CSS */}
      <style>{`
        /* Floating Particles */
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(239, 68, 68, 0.3);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-100vh) rotate(180deg);
            opacity: 1;
          }
        }

        /* Navigation Pills */
        .nav-pill {
          animation: slideInFromTop 0.6s ease-out forwards;
          transform: translateY(-20px);
          opacity: 0;
        }

        @keyframes slideInFromTop {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Hero Section Animations */
        .hero-section {
          animation: heroFadeIn 1.5s ease-out forwards;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Geometric Patterns */
        .geometric-patterns {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .pattern {
          position: absolute;
          border: 2px solid rgba(239, 68, 68, 0.1);
          animation: patternRotate 20s linear infinite;
        }

        .pattern-1 {
          top: 10%;
          left: 10%;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          animation-delay: 0s;
        }

        .pattern-2 {
          top: 20%;
          right: 15%;
          width: 60px;
          height: 60px;
          transform: rotate(45deg);
          animation-delay: -5s;
        }

        .pattern-3 {
          bottom: 20%;
          left: 20%;
          width: 80px;
          height: 80px;
          border-radius: 20px;
          animation-delay: -10s;
        }

        @keyframes patternRotate {
          0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: rotate(180deg) scale(1.2); opacity: 0.1; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
        }

        /* Text Animations */
        .text-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5),
                       0 0 40px rgba(255, 255, 255, 0.3),
                       0 0 60px rgba(255, 255, 255, 0.2);
        }

        .text-outline {
          color: transparent;
          -webkit-text-stroke: 2px #ffffff;
          text-stroke: 2px #ffffff;
        }

        .animated-text {
          animation: textSlideIn 1s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .animated-text-delay {
          animation: textSlideIn 1s ease-out 0.3s forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .animated-text-delay-2 {
          animation: textSlideIn 1s ease-out 0.6s forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes textSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sliding-text {
          animation: slideFromLeft 1s ease-out 0.9s forwards;
          opacity: 0;
          transform: translateX(-30px);
        }

        .sliding-text-delay {
          animation: slideFromLeft 1s ease-out 1.2s forwards;
          opacity: 0;
          transform: translateX(-30px);
        }

        @keyframes slideFromLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Button Animations */
        .cta-button {
          animation: buttonPulse 2s ease-in-out infinite;
        }

        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Message Bubble Animations */
        .message-bubble {
          animation: messageSlideIn 0.6s ease-out forwards;
          opacity: 0;
          transform: translateX(-20px);
        }

        @keyframes messageSlideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Chat Window Animations */
        .chat-window {
          animation: chatWindowScale 0.8s ease-out forwards;
          transform: scale(0.95);
        }

        @keyframes chatWindowScale {
          to {
            transform: scale(1);
          }
        }

        /* Review Card Animations */
        .review-card {
          animation: cardFadeIn 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes cardFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Interaction Animations */
        .interaction-button:hover {
          transform: scale(1.1);
        }

        /* Sticky Navigation */
        .sticky-nav {
          position: sticky;
          top: 20px;
          z-index: 50;
        }

        /* Scroll-triggered animations */
        .animated-section {
          animation: sectionFadeIn 1s ease-out forwards;
        }

        @keyframes sectionFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Feature Section Enhancements */
        .feature-section .image-container:hover {
          transform: scale(1.05) rotate(2deg);
        }

        /* Quiz Section Image Grid */
        .images-grid .image-card:nth-child(1) {
          animation: imageFloat1 6s ease-in-out infinite;
        }

        .images-grid .image-card:nth-child(2) {
          animation: imageFloat2 6s ease-in-out infinite;
        }

        @keyframes imageFloat1 {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes imageFloat2 {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }

        /* Advanced Hover Effects */
        .review-card:hover {
          transform: translateY(-8px) rotate(1deg);
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.15);
        }

        /* Loading States */
        .community-chat-container {
          animation: containerSlideUp 1s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes containerSlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Enhancements */
        @media (max-width: 768px) {
          .text-glow {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }

          .particle {
            width: 2px;
            height: 2px;
          }

          .pattern-1, .pattern-2, .pattern-3 {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .geometric-patterns {
            display: none;
          }

          .floating-particles .particle:nth-child(n+10) {
            display: none;
          }
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(239, 68, 68, 0.1) 0%, rgba(75, 85, 99, 0.05) 50%, transparent 100%)`,
          }}
        />
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="min-h-screen bg-transparent">
          <div className="space-y-8 bg-transparent p-6">
            {/* Animated Navigation */}
            <nav className="sticky-nav flex items-center justify-center gap-4 md:gap-8 mt-2">
              {[
                { to: "/home", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact Us" },
                { to: "/faq", label: "FAQ" },
              ].map((item, index) => (
                <Link
                  key={item.to}
                  className="nav-pill group relative overflow-hidden bg-gray-800 text-white rounded-full px-4 py-2 text-xs md:text-sm lg:text-base font-medium transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                  to={item.to}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {item.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-white animate-pulse" />
                  </div>
                </Link>
              ))}
            </nav>

            {/* Hero Section */}
            <section className="animated-section hero-section text-center relative py-20 md:py-32 mb-8 overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-red-600/5" />
                <div className="geometric-patterns">
                  <div className="pattern pattern-1" />
                  <div className="pattern pattern-2" />
                  <div className="pattern pattern-3" />
                </div>
              </div>

              <div className="relative z-10 text-white">
                <div className="typewriter-container mb-6">
                  <h1 className="text-4xl md:text-7xl font-black mb-4 leading-tight tracking-tight">
                    <span className="text-glow animated-text">
                      Level Up Your
                    </span>
                    <br />
                    <span className="text-gradient bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent animated-text-delay">
                      Studies
                    </span>
                    <br />
                    <span className="text-outline animated-text-delay-2">
                      With WitScribe
                    </span>
                  </h1>
                </div>

                <div className="sliding-text-container overflow-hidden mb-8">
                  <p className="text-gray-300 text-lg md:text-2xl mb-6 p-4 max-w-4xl mx-auto leading-relaxed">
                    <span className="sliding-text">
                      Supercharge Your Studies with Us —
                    </span>
                    <br />
                    <span className="sliding-text-delay">
                      Embark on a Transformative Learning Journey Today!
                    </span>
                  </p>
                </div>

                <Link to="/register">
                  <button className="cta-button group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-10 md:py-5 md:px-12 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/50">
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Explore for free</span>
                      <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 opacity-30 blur group-hover:opacity-50 transition-opacity duration-300" />
                  </button>
                </Link>
              </div>
            </section>
          </div>

          {/* Video Summarizer Section */}
          <section className="animated-section feature-section mx-4 md:mx-10 mb-20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                <div className="md:w-1/2 mb-6 md:mb-0 group">
                  <div className="image-container relative overflow-hidden rounded-2xl transform transition-all duration-700 group-hover:scale-105">
                    <img
                      src={shraddhadi}
                      alt="How to use WebSocket?"
                      className="w-full h-auto rounded-2xl shadow-2xl transition-all duration-700 group-hover:shadow-red-500/25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 ring-1 ring-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                <div className="md:w-1/2 text-center md:text-left text-white">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-glow">
                    <span className="text-red-400">Is the video</span> too long
                    for you?
                  </h2>
                  <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                    What if we say you can learn what is in the video{" "}
                    <span className="text-red-400 font-semibold">
                      faster and much better
                    </span>{" "}
                    without even watching the video with the help of{" "}
                    <span className="text-red-400 font-semibold">
                      Artificial Intelligence
                    </span>
                  </p>
                  <Link to="/register">
                    <button className="secondary-cta group relative overflow-hidden bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <span className="relative z-10 flex items-center gap-2">
                        <span>Enhance Your Studies</span>
                        <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <span className="absolute inset-0 bg-white group-hover:text-white transition-colors duration-300" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Quiz Generation Section */}
          <section className="animated-section quiz-section py-16 px-4 mb-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2">
                  <div className="text-content space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                      <span className="text-gray-900">Generate</span>
                      <span className="text-red-500"> live quizzes</span>
                      <br />
                      <span className="text-gray-700">
                        of the topics you learn
                      </span>
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                      Yes it's true, you heard it right! You just upload the
                      link of the YouTube video, click on{" "}
                      <span className="text-red-500 font-semibold">
                        generate quiz
                      </span>{" "}
                      and{" "}
                      <span className="text-red-500 font-semibold">poof!</span>{" "}
                      you have your own quiz generated especially for you
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="images-grid grid grid-cols-2 gap-6">
                    <div className="image-card group relative overflow-hidden rounded-2xl transform transition-all duration-500 hover:scale-105 hover:-rotate-2">
                      <img
                        src={quizzy}
                        alt="Quiz Generation"
                        className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-red-500/25"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-bold text-sm">
                          Interactive Quizzes
                        </h3>
                      </div>
                    </div>

                    <div className="image-card group relative overflow-hidden rounded-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-2 mt-8">
                      <img
                        src={leadery}
                        alt="Leaderboard"
                        className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-red-500/25"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-bold text-sm">Track Progress</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section className="animated-section community-section py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="text-gray-900">Explore Our</span>
                  <span className="text-red-500"> Community</span>
                  <br />
                  <span className="text-gray-700">Of Students</span>
                </h3>
              </div>

              <div className="community-chat-container relative overflow-hidden rounded-3xl bg-gray-100 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 to-red-500/5" />
                <div className="chat-window relative bg-gray-900 rounded-2xl p-6 text-white shadow-inner">
                  <div className="chat-header flex items-center gap-3 pb-4 border-b border-gray-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <div
                        className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm ml-auto">
                      WitScribe Community
                    </span>
                  </div>

                  <div className="chat-messages space-y-4 mt-4">
                    {/* First comment */}
                    <div className="message-bubble animate-slide-in pb-4 border-b border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          S
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-100">
                            Sean
                          </span>
                          <span className="text-xs text-gray-400">
                            just now
                          </span>
                        </div>
                      </div>
                      <p className="mb-3 text-gray-200">
                        Guys can you help me out with this question?
                      </p>
                      <div className="attachment bg-gray-700 h-20 w-1/2 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-gray-600">
                        📄 Math Problem.jpg
                      </div>
                    </div>

                    {/* Second comment */}
                    <div
                      className="message-bubble animate-slide-in py-4 border-b border-gray-700"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          A
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-100">
                            Andrew
                          </span>
                          <span className="text-xs text-gray-400">
                            2 min ago
                          </span>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-200 leading-relaxed">
                        Yes Sean, The best way to solve this question is that
                        you can actually add 1 and subtract 1 in numerator and
                        then divide the whole equation in two parts and then
                        solve them independently
                      </p>
                      <div className="flex items-center gap-6">
                        <button className="interaction-button flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span>Reply</span>
                        </button>
                        <div className="interaction-button flex items-center gap-2 text-sm text-red-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 animate-pulse"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>3 Likes</span>
                        </div>
                      </div>
                    </div>

                    {/* Third comment */}
                    <div
                      className="message-bubble animate-slide-in pt-4"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          Al
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-100">
                            Albert
                          </span>
                          <span className="text-xs text-gray-400">
                            1 min ago
                          </span>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-200 leading-relaxed">
                        Andrew is right! This method is much easier to use than
                        textbook one. Think of it as a{" "}
                        <span className="text-yellow-400">cheat code</span> 🚀
                      </p>
                      <div className="flex items-center gap-6">
                        <button className="interaction-button flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span>Reply</span>
                        </button>
                        <div className="interaction-button flex items-center gap-2 text-sm text-red-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>1 Like</span>
                        </div>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="typing-indicator flex items-center gap-3 pt-4 text-gray-400">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        M
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Maria is typing</span>
                        <div className="typing-dots flex gap-1 ml-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="animated-section reviews-section py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="w-full lg:w-2/3">
                  <h3 className="text-2xl font-bold mb-8 text-gray-900">
                    Latest reviews
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Review 1 */}
                    <div className="review-card group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="flex mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="w-5 h-5 text-yellow-400 transform transition-transform duration-200 hover:scale-110"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              style={{ animationDelay: `${star * 0.1}s` }}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                          Andrew was here
                        </h4>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          I can get notes of any video I want, it also provides
                          time stamps of those videos, its awesome
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            A
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              Andrew
                            </span>
                            <span className="text-xs text-gray-500">
                              2-4-2025
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review 2 */}
                    <div
                      className="review-card group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="flex mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="w-5 h-5 text-yellow-400 transform transition-transform duration-200 hover:scale-110"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              style={{ animationDelay: `${star * 0.1}s` }}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                          Best Summarizer
                        </h4>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          Provide the best summaries of any topic I want just
                          time to upload the link
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            C
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              Cristina
                            </span>
                            <span className="text-xs text-gray-500">
                              27-1-2025
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review 3 */}
                    <div
                      className="review-card group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="flex mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="w-5 h-5 text-yellow-400 transform transition-transform duration-200 hover:scale-110"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              style={{ animationDelay: `${star * 0.1}s` }}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                          A Saviour
                        </h4>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          It saved me at the time just before exams
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            AS
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              Amrita Sharma
                            </span>
                            <span className="text-xs text-gray-500">
                              6-2-2025
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 lg:pl-8">
                  <div className="sticky top-8">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                      <span className="text-gray-900">What Our</span>
                      <br />
                      <span className="text-red-500">Users Say?</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      You will love us too just like our users so try us now
                    </p>
                    <Link to="/register">
                      <button className="cta-secondary group relative overflow-hidden bg-transparent border-2 border-red-500 text-red-500 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-lg">
                        <span className="relative z-10 flex items-center gap-3">
                          <span>Try Now</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
