"use client"

import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa"
import Navbar from "../Components/Navbar"

import "../App.css"
import bookzy from "../assets/books.webp"
import nighty from "../assets/nightlamp.webp"
import manwrit from "../assets/manwriting.webp"
import personal from "../assets/persononlaptop.webp"
import star from "../assets/star-trail-removebg-preview.webp"
import laks from "../assets/lakshya1.webp"

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-transperent">
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto text-center relative">
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-red-500 to-gray-900 mb-4">
                About Us
              </h1>
              <div className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold text-gray-200/30 -z-10 transform translate-x-2 translate-y-2">
                About Us
              </div>
            </div>
            <p className="text-xl text-gray-600 mt-8 max-w-2xl mx-auto">
              Transforming the way you learn, one video at a time
            </p>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What We Offer – <span className="text-red-500">" Your Smart Study BFF "</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "YouTube Summariser",
                  desc: "Long video? Snip! Here's the juicy stuff with timestamps.",
                  icon: "🎥",
                },
                {
                  title: "AI Doubt Solver",
                  desc: "Ask away, our brainy bot's got your back 24/7.",
                  icon: "🤖",
                },
                {
                  title: "Quiz on Anything",
                  desc: "Wanna test your brain on cats, calculus, or cooking? Go for it.",
                  icon: "🧠",
                },
                {
                  title: "Study Room Vibes",
                  desc: "Chill zone for focused learning with your study squad.",
                  icon: "📚",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-500 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20 px-6 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Our <span className="text-red-500">Mission</span>
                </h2>
                <img
                  loading="lazy"
                  src={star || "/placeholder.svg?height=60&width=60"}
                  alt="Star trail"
                  className="w-12 h-12 opacity-80"
                />
              </div>
            </div>

            <div className="space-y-8 text-center">
              <p className="text-2xl md:text-3xl font-light text-red-400 leading-relaxed">
                Empowering Learners Everywhere: Making Education Faster, Smarter, and Accessible for All.
              </p>

              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                We believe that education should be inclusive and tailored to fit every learner's unique needs.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <p className="text-lg text-gray-200 mb-4">
                  Whether you're a student preparing for exams, a NeuroDivergent learner needing accessible content, a
                  professional upskilling on the go, or a hobbyist exploring new skills,
                </p>
                <p className="text-2xl font-bold text-red-400">WitScribe adapts to YOU!!!</p>
              </div>

              <p className="text-xl text-gray-300 mb-8">Our mission is simple:</p>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  "Break down barriers in learning.",
                  "Make video-based education structured, interactive, and engaging.",
                  "Ensure everyone, regardless of abilities or environment, has access to smarter learning tools.",
                ].map((point, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-4 mx-auto">
                      {i + 1}
                    </div>
                    <p className="text-gray-200">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Empowering Section */}
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative">
                "Empowering Every Learner — One Video at a Time."
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Your smart companion for turning YouTube videos into bite-sized learning with summaries, quizzes, audio,
                and community support.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[bookzy, nighty, manwrit, personal].map((imgSrc, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    loading="lazy"
                    src={imgSrc || `/placeholder.svg?height=300&width=300`}
                    alt={`Learning image ${i + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our <span className="text-red-500">Journey</span> Till Date
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 to-red-300"></div>

              {[
                { emoji: "💡", title: "Idea Sparked", desc: "Saw the need to simplify learning from long videos" },
                {
                  emoji: "🎯",
                  title: "Prototype Built",
                  desc: "Created core features: summaries, TTS, quizzes",
                },
                {
                  emoji: "♿",
                  title: "Inclusive Design & Collaboration",
                  desc: "Added features for neurodivergent and busy learners",
                },
                { emoji: "🚀", title: "Platform Expanded", desc: "Evolved into a full learning companion" },
                {
                  emoji: "🔮",
                  title: "Future Focused",
                  desc: "Mobile app, multilingual support, AI learning paths & more...",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  } md:items-center mb-16`}
                >
                  {/* Timeline marker */}
                  <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center z-10">
                    <div className="bg-white rounded-full border-4 border-red-500 w-12 h-12 flex items-center justify-center shadow-lg">
                      <span className="text-xl">{item.emoji}</span>
                    </div>
                  </div>

                  {/* Content container */}
                  <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"} pb-8 md:pb-0`}>
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                      <div className="flex items-center mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-300">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-20 px-6 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Meet Our <span className="text-red-500">Team</span>
              </h2>
              <p className="text-xl text-gray-300">A perfect blend of creativity & technical wizardry</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 hover:border-white/30 hover:bg-white/15 transition-all duration-500 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="relative flex-shrink-0 mx-auto md:mx-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                    <img
                      loading="lazy"
                      src={laks || "/placeholder.svg?height=180&width=180"}
                      alt="Lakshya Mishra"
                      className="relative w-40 h-40 md:w-44 md:h-44 rounded-full object-cover border-4 border-red-500 shadow-2xl"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-300 mb-2">Founder</p>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Lakshya Mishra</h3>
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                      Building WitScribe to make learning feel lighter, faster, and more personal. Focused on turning
                      long-form videos into practical study flows with summaries, quizzes, and accessibility-first
                      features that help learners stay consistent every day.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                        <p className="text-xs uppercase tracking-wide text-gray-300">Core Focus</p>
                        <p className="text-white font-semibold">AI-Powered Learning Experience</p>
                      </div>
                      <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                        <p className="text-xs uppercase tracking-wide text-gray-300">Vision</p>
                        <p className="text-white font-semibold">Accessible Study Tools for Everyone</p>
                      </div>
                    </div>

                    <div className="flex justify-center md:justify-start gap-4">
                      {[
                        { icon: FaInstagram, href: "https://instagram.com" },
                        { icon: FaLinkedin, href: "https://linkedin.com" },
                        { icon: FaTwitter, href: "https://twitter.com" },
                      ].map((social, idx) => (
                        <a
                          key={idx}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
                        >
                          <social.icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs
