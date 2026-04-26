"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"
import HomeImage from "../assets/homeImage.webp"

const Home = () => {
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const API_KEY =
    "sd_a4bb48c811685b2bc4911cfc5434188e"
  // Read Gemini API key from Vite env
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3-flash-preview"

  const getYouTubeVideoId = (url) => {
    const regexes = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/user\/\S+\/\S+\/\S+|youtube\.com\/user\/\S+\/\S+|youtube\.com\/\S+\/\S+\/\S+|youtube\.com\/\S+\/\S+|youtube\.com\/\S+)([^"&?/\s]{11})/,
      /(?:youtube\.com.*(?:v=|\/v\/|\/embed\/)|youtu\.be\/)([^"&?/\s]{11})/,
    ]
    for (const regex of regexes) {
      const match = url.match(regex)
      if (match && match[1]) return match[1]
    }
    return null
  }

  const getTranscript = async () => {
    if (!videoUrl) {
      setError("Please enter a YouTube URL")
      return
    }
    setLoading(true)
    setError("")
    try {
      const videoId = getYouTubeVideoId(videoUrl)
      if (!videoId) {
        setError("Invalid YouTube URL. Please enter a valid YouTube video link.")
        setLoading(false)
        return
      }
      const response = await fetch(`https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok || !data?.content) {
        throw new Error(data?.message || "No transcript found for this video")
      }
      const notesResponse = await processWithGemini(data.content, videoId)
      navigate("/notes", {
        state: {
          transcript: data.content,
          notes: notesResponse,
          videoId: videoId,
          videoUrl: videoUrl,
          lang: data.lang || "en",
          availableLangs: data.availableLangs || ["en"],
        },
      })
    } catch (err) {
      setError(err.message || "Something went wrong while processing the video")
    } finally {
      setLoading(false)
    }
  }

  const processWithGemini = async (transcript) => {
    const truncatedTranscript =
      transcript.length > 30000
        ? transcript.substring(0, 30000) + "... (transcript truncated due to length)"
        : transcript

    if (!GEMINI_API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY is not configured. Please set it in the .env file and restart the dev server.")
    }

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `@youtube Create comprehensive, well-structured notes from the following YouTube video transcript. 
          Break it down into sections with clear headings, don't use any puctuation marks , also remove all the special symbols used, don't use asterisk (*) symbol in the lines and summarize main ideas, make sure it relates to the topic of the video and should also include examples that simplifies learning.
          Format the response in markdown.
          TRANSCRIPT:
          ${truncatedTranscript}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }

    let response
    let data

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      data = await response.json().catch(() => ({}))

      if (response.ok && !data.error) {
        break
      }

      if (response.status !== 429 || attempt === 3) {
        break
      }

      const retryDelayMs = 600 * attempt
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }

    if (!response?.ok || data?.error) {
      const apiMessage = data?.error?.message
      if (response?.status === 429) {
        throw new Error("Gemini rate limit reached. Please wait a moment and try again.")
      }
      throw new Error(apiMessage || "Failed to generate notes with AI")
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No content returned."
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getTranscript()
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-transparent">
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    What Do You Want
                    <br />
                    To <span className="text-red-500">Summarize</span>?
                  </h1>
                  <p className="text-xl text-gray-600 font-normal max-w-lg">
                    Transform any YouTube video into comprehensive, well-structured notes with AI-powered summarization.
                  </p>
                </div>

                {/* Input Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Paste YouTube link here..."
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-300 bg-white shadow-sm"
                      disabled={loading}
                    />
                    <button
                      onClick={getTranscript}
                      disabled={loading || !videoUrl}
                      className="absolute right-2 top-2 bottom-2 px-6 bg-red-500 hover:bg-black text-white font-medium rounded-xl disabled:bg-red-400 transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing</span>
                        </div>
                      ) : (
                        "→"
                      )}
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Try:</span>
                    <button
                      onClick={() => setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
                      className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Sample Video
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      onClick={() => setVideoUrl("")}
                      className="text-sm text-gray-500 hover:text-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 text-red-500">⚠</div>
                      <p className="font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <div>
                        <p className="font-medium">Processing your video...</p>
                        <p className="text-sm text-blue-600">This may take a minute or two</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                  <img
                    src={HomeImage || "/placeholder.svg?height=400&width=500"}
                    alt="Summarization illustration"
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-red-500 text-xl">🎯</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Summarization</h3>
                <p className="text-gray-600">
                  AI-powered analysis extracts key points and creates structured notes from any YouTube video.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-red-500 text-xl">⚡</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Get comprehensive notes in minutes, not hours. Save time while learning more effectively.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-red-500 text-xl">📚</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Structured Learning</h3>
                <p className="text-gray-600">
                  Well-organized sections with clear headings and examples for better understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
