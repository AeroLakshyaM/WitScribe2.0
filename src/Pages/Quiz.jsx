"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import quizIllustration from "../assets/quiz-illustration.webp"
import Navbar from "../Components/Navbar"

// Read Gemini API key from Vite environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3-flash-preview"

export default function Quiz1() {
  const [quizTopic, setQuizTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [numQuestions, setNumQuestions] = useState(10)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!quizTopic.trim()) return
    // Ensure API key is available before starting
    if (!GEMINI_API_KEY) {
      alert("VITE_GEMINI_API_KEY is not configured. Please set it in your .env file and restart the dev server.")
      return
    }

    setLoading(true)
    try {
      const prompt = `Generate a multiple choice quiz with ${numQuestions} ${difficulty}-difficulty questions about "${quizTopic}". Each question should include:
- question text
- 4 options (A, B, C, D)
- correct answer letter

Respond in JSON format like:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Paris", "Madrid", "Rome"],
    "answer": "B"
  }
]`

      let res
      let data

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          },
        )

        data = await res.json().catch(() => ({}))

        if (res.ok && !data.error) {
          break
        }

        if (res.status !== 429 || attempt === 3) {
          break
        }

        const retryDelayMs = 600 * attempt
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
      }

      if (!res?.ok || data?.error) {
        const apiMessage = data?.error?.message
        if (res?.status === 429) {
          throw new Error("Gemini rate limit reached. Please wait a moment and try again.")
        }
        throw new Error(apiMessage || "Failed to generate quiz")
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      let quizData = []
      try {
        const jsonStart = rawText.indexOf("[")
        const jsonEnd = rawText.lastIndexOf("]")
        const extractedJson = rawText.slice(jsonStart, jsonEnd + 1)
        quizData = JSON.parse(extractedJson)
      } catch (err) {
        console.error("Failed to parse quiz JSON:", err)
        alert("Could not parse quiz questions from Gemini. Try again.")
        setLoading(false)
        return
      }

      navigate("/playquiz", { state: { quizData, topic: quizTopic.trim() } })
    } catch (err) {
      console.error("Gemini API Error:", err)
      alert(err.message || "Something went wrong while generating the quiz.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col">
          <div className="pt-16 px-4">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-2 text-black">Quiz Time !!</h1>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                Type a topic, hit play, and let's find out if you're a genius... or just confidently wrong!
              </p>
            </div>

            <div className="w-full max-w-4xl mx-auto mb-16">
              <form onSubmit={handleSearch} className="space-y-8">
                {/* Topic Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="Enter topic for your quiz"
                    className="w-full px-6 py-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 hover:text-gray-600 text-red-500 text-xl font-bold"
                  >
                    {loading ? "..." : "→"}
                  </button>
                </div>

                {/* Options Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Difficulty Selection */}
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-black">Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["easy", "medium", "hard"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                            difficulty === level
                              ? "border-red-500 bg-red-50 text-red-600"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Questions */}
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-black">Number of Questions</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[5, 10, 15, 20].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNumQuestions(num)}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                            numQuestions === num
                              ? "border-red-500 bg-red-50 text-red-600"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quiz Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Quiz Configuration:</span>
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {numQuestions} Questions
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="flex-1 bg-black">
            <div className="max-w-screen-xl mx-auto px-4 flex justify-center items-start">
              <div className="w-full max-w-3xl">
                <img
                  src={quizIllustration || "/placeholder.svg"}
                  alt="Quiz Illustration"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "450px" }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
