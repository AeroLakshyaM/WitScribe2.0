"use client"
import { useLocation, Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { useState, useEffect, useRef } from "react"

import Navbar from "../Components/Navbar" // Adjust import path as needed

// Text-to-Speech component remains unchanged
function TextToSpeechButton({ textToRead }) {
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState("")
  const [isPaused, setIsPaused] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showTtsControls, setShowTtsControls] = useState(false)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)

  // References
  const utteranceRef = useRef(null)

  useEffect(() => {
    // Initialize speech synthesis and load available voices
    const synth = window.speechSynthesis

    const loadVoices = () => {
      const availableVoices = synth.getVoices()
      setVoices(availableVoices)

      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name)
      }
    }

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices
    }

    loadVoices()

    return () => {
      if (synth.speaking) {
        synth.cancel()
      }
    }
  }, [])

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value)
  }

  const handleRateChange = (e) => {
    setRate(Number.parseFloat(e.target.value))
  }

  const handlePitchChange = (e) => {
    setPitch(Number.parseFloat(e.target.value))
  }

  const handleVolumeChange = (e) => {
    setVolume(Number.parseFloat(e.target.value))
  }

  const speak = () => {
    const synth = window.speechSynthesis

    if (synth.speaking) {
      synth.cancel()
    }

    if (textToRead) {
      const utterance = new SpeechSynthesisUtterance(textToRead)
      utteranceRef.current = utterance

      const voice = voices.find((v) => v.name === selectedVoice)
      if (voice) {
        utterance.voice = voice
      }

      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      synth.speak(utterance)
    }
  }

  const togglePause = () => {
    const synth = window.speechSynthesis

    if (synth.speaking) {
      if (isPaused) {
        synth.resume()
        setIsPaused(false)
      } else {
        synth.pause()
        setIsPaused(true)
      }
    }
  }

  const stop = () => {
    const synth = window.speechSynthesis
    synth.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  return (
    <>
      <button
        onClick={() => setShowTtsControls(!showTtsControls)}
        className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex-1 text-center"
      >
        Read Aloud
      </button>

      {showTtsControls && (
        <div className="mt-4 p-4 bg-transparent rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3">Text to Speech Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="voice">
                Voice:
              </label>
              <select
                id="voice"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedVoice}
                onChange={handleVoiceChange}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="rate">
                Rate: {rate}
              </label>
              <input
                id="rate"
                type="range"
                className="w-full"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={handleRateChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="pitch">
                Pitch: {pitch}
              </label>
              <input
                id="pitch"
                type="range"
                className="w-full"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={handlePitchChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="volume">
                Volume: {volume}
              </label>
              <input
                id="volume"
                type="range"
                className="w-full"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              onClick={speak}
              disabled={isSpeaking && !isPaused}
            >
              Speak
            </button>

            {isSpeaking && (
              <>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none"
                  onClick={togglePause}
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>

                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                  onClick={stop}
                >
                  Stop
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function AccordionQuestion({ question }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-3-flash-preview"

  // Function to fetch answer from Gemini API with proper error handling
  const fetchGeminiAnswer = async () => {
    if (answer) return // Don't fetch if we already have an answer

    setIsLoading(true)
    setError(null)

    try {
      // Prefer API key from Vite env. Falls back to undefined which we handle below.
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY is not set. Gemini requests will likely fail.")
      }

      // If there's no API key, bail out early with a useful error message
      if (!apiKey) {
        setError("VITE_GEMINI_API_KEY is not configured. Please set it in the .env file and restart the dev server.")
        setIsLoading(false)
        return
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      let response
      let errorText = ""
      let data

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Please provide a clear and concise answer to this question: ${question}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
            signal: controller.signal,
          },
        )

        if (response.ok) {
          data = await response.json()
          break
        }

        errorText = await response.text().catch(() => "")

        if (response.status !== 429 || attempt === 3) {
          break
        }

        const retryDelayMs = 600 * attempt
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
      }

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error("API Error Response:", errorText)
        if (response.status === 429) {
          throw new Error("Gemini rate limit reached. Please wait a moment and try again.")
        }
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      // Extract the answer from the response with better error handling
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        setAnswer(data.candidates[0].content.parts[0].text)
      } else {
        console.error("Unexpected API response structure:", data)
        throw new Error("No valid answer found in API response")
      }
    } catch (err) {
      console.error("Error fetching answer from Gemini:", err)
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.")
      } else {
        setError("Failed to get answer. Please try again later. " + err.message)
      }

      // Provide a fallback answer when the API fails
      setAnswer(
        "I'm unable to generate an answer from the Gemini API right now. Here's a general response:\n\n" +
          "This would typically contain an answer to your question about the video content. " +
          "Please try again later when our AI service is available.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle accordion and fetch answer if needed
  const toggleAccordion = () => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)

    if (newExpandedState && !answer && !isLoading) {
      fetchGeminiAnswer()
    }
  }

  return (
    <div className="mt-6 bg-gray-200 rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={toggleAccordion}>
        <div className="font-medium">{question}</div>
        <div
          className={`w-8 h-8 bg-red-100 rounded-full flex items-center justify-center transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
              <span className="ml-2">Getting answer from Gemini...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 py-2">{error}</div>
          ) : (
            <div className="prose max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const Notes = () => {
  const location = useLocation()
  const { transcript, notes, videoId } = location.state || {}
  const [parsedTranscript, setParsedTranscript] = useState([])
  const [formattedNotes, setFormattedNotes] = useState([])
  const [showFullTranscript, setShowFullTranscript] = useState(false)
  const [questions, setQuestions] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("notes") // 'notes' or 'questions'

  // Check if on mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    // Parse transcript into timestamped lines
    if (transcript) {
      const lines = transcript.split("\n").filter((line) => line.trim() !== "")
      setParsedTranscript(lines)
    }

    // Parse and format notes with improved logic
    if (notes) {
      const formattedContent = formatNotes(notes)
      setFormattedNotes(formattedContent)
    }
  }, [transcript, notes])

  // Improved notes formatting function
  const formatNotes = (rawNotes) => {
    if (!rawNotes) return []

    // Better section detection - handles headings and subheadings
    const sections = []
    let currentSection = null
    let currentSubsection = null

    const lines = rawNotes.split("\n")
    let inCodeBlock = false

    lines.forEach((line) => {
      // Toggle code block state
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock

        // Add the code block marker to the current section/subsection
        if (currentSubsection) {
          currentSubsection.content.push(line)
        } else if (currentSection) {
          currentSection.content.push(line)
        } else {
          // Create default section if needed
          currentSection = {
            id: 1,
            title: "Notes",
            type: "section",
            content: [line],
            subsections: [],
          }
          sections.push(currentSection)
        }
        return
      }

      // Don't process headings inside code blocks
      if (inCodeBlock) {
        if (currentSubsection) {
          currentSubsection.content.push(line)
        } else if (currentSection) {
          currentSection.content.push(line)
        }
        return
      }

      // Process headings and content
      if (line.startsWith("# ")) {
        // Main heading - create new section
        if (currentSection) {
          sections.push(currentSection)
        }

        currentSection = {
          id: sections.length + 1,
          title: line.replace(/^# /, "").trim(),
          type: "section",
          content: [],
          subsections: [],
        }
        currentSubsection = null
      } else if (line.startsWith("## ")) {
        // Subheading - create new subsection
        if (!currentSection) {
          // Create default section if none exists
          currentSection = {
            id: sections.length + 1,
            title: "Notes",
            type: "section",
            content: [],
            subsections: [],
          }
          sections.push(currentSection)
        }

        currentSubsection = {
          id: `${currentSection.id}.${currentSection.subsections.length + 1}`,
          title: line.replace(/^## /, "").trim(),
          type: "subsection",
          content: [],
        }

        currentSection.subsections.push(currentSubsection)
      } else if (line.trim() !== "") {
        // Regular content
        if (currentSubsection) {
          currentSubsection.content.push(line)
        } else if (currentSection) {
          currentSection.content.push(line)
        } else {
          // Create default section if no section exists yet
          currentSection = {
            id: sections.length + 1,
            title: "Notes",
            type: "section",
            content: [line],
            subsections: [],
          }
          sections.push(currentSection)
        }
      }
    })

    // Add the last section if it exists
    if (currentSection && !sections.includes(currentSection)) {
      sections.push(currentSection)
    }

    return sections
  }

  // Function to render formatted notes content
  const renderNotesContent = (content) => {
    if (!content || content.length === 0) return null

    // Group content by list items and paragraphs
    const formattedContent = []
    let currentList = []

    content.forEach((line, index) => {
      // Detect list items
      if (line.trim().match(/^(-|\*|\d+\.)\s/)) {
        // Add to current list
        currentList.push(line.trim().replace(/^(-|\*|\d+\.)\s/, ""))
      } else {
        // If we were building a list and now hit non-list content
        if (currentList.length > 0) {
          formattedContent.push({
            type: "list",
            items: [...currentList],
          })
          currentList = []
        }

        // Add paragraph content
        if (line.trim()) {
          formattedContent.push({
            type: "paragraph",
            content: line,
          })
        }
      }
    })

    // Add any remaining list items
    if (currentList.length > 0) {
      formattedContent.push({
        type: "list",
        items: [...currentList],
      })
    }

    return (
      <>
        {formattedContent.map((item, idx) => {
          if (item.type === "list") {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 my-2">
                {item.items.map((listItem, i) => (
                  <li key={i} className="text-gray-800">
                    {listItem}
                  </li>
                ))}
              </ul>
            )
          } else {
            return (
              <p key={idx} className="my-2 text-gray-800">
                {item.content}
              </p>
            )
          }
        })}
      </>
    )
  }

  // Format transcript line with timestamp if available
  const formatTranscriptLine = (line) => {
    // Try to extract timestamp pattern like "00:00:00.000" or "00:00"
    const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})/)
    if (timeMatch) {
      const time = timeMatch[0]
      const text = line.replace(timeMatch[0], "").trim()
      return { time, text }
    }
    return { time: "", text: line }
  }

  // Get a limited number of transcript lines for display
  const displayTranscriptLines = showFullTranscript ? parsedTranscript : parsedTranscript.slice(0, 13)

  if (!transcript || !notes) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <p>No data available. Please go back and try again.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-6 md:mt-14 px-4">
        {/* Mobile Navigation Tabs */}
        {isMobile && (
          <div className="flex border-b border-gray-300 mb-4">
            <button
              className={`flex-1 py-3 font-medium ${activeTab === "notes" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("notes")}
            >
              Notes
            </button>
            <button
              className={`flex-1 py-3 font-medium ${activeTab === "questions" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("questions")}
            >
              Ask Questions
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Left Column - Video and Transcript */}
          <div className={`md:w-1/3 w-full`}>
            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                ></iframe>
              ) : (
                <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
                  <div className="text-white">Video Unavailable</div>
                </div>
              )}
            </div>

            {/* Transcript Section - Hidden on mobile */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow hidden md:block">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Transcript</h3>
                <button
                  className="text-sm text-gray-700 flex items-center"
                  onClick={() => setShowFullTranscript(!showFullTranscript)}
                >
                  {showFullTranscript ? "Show Less" : "Show More"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transform transition-transform ${showFullTranscript ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto pr-2">
                {displayTranscriptLines.map((line, index) => {
                  const { time, text } = formatTranscriptLine(line)
                  return (
                    <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                      {time && <span className="font-mono text-xs text-gray-500 block">{time}</span>}
                      <span className="text-sm text-gray-800">{text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quiz Section - Hidden on mobile */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow hidden md:block">
              <Link to={"/quiz"} className="block">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="text-black">Play</span>
                  <span className="text-gray-300 ml-2">Quiz</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </h2>
                <p className="text-sm text-gray-600 mt-1">Test your knowledge on this video content</p>
              </Link>
            </div>
          </div>

          {/* Mobile Notes and Questions Section */}
          <div className="md:hidden w-full mt-6">
            {/* Notes Tab Content */}
            {activeTab === "notes" && (
              <div className="bg-white rounded-lg p-5 shadow mb-6 w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Video Notes</h2>

                {/* Render formatted notes */}
                {formattedNotes.length > 0 ? (
                  formattedNotes.map((section) => (
                    <div key={section.id} className="mb-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800">
                        {section.id}. {section.title}
                      </h3>

                      {/* Section content */}
                      <div className="mb-4 pl-2">{renderNotesContent(section.content)}</div>

                      {/* Subsections */}
                      {section.subsections.map((subsection) => (
                        <div key={subsection.id} className="mb-4 ml-4">
                          <h4 className="text-lg font-semibold mb-2 text-gray-700">
                            {subsection.id} {subsection.title}
                          </h4>
                          <div className="pl-2">{renderNotesContent(subsection.content)}</div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="prose max-w-none">
                    <ReactMarkdown>{notes}</ReactMarkdown>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => {
                      const element = document.createElement("a")
                      const file = new Blob([notes], { type: "text/markdown" })
                      element.href = URL.createObjectURL(file)
                      element.download = "youtube_notes.md"
                      document.body.appendChild(element)
                      element.click()
                      document.body.removeChild(element)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex-1 text-center"
                  >
                    Download Notes
                  </button>

                  {/* Text-to-Speech Button Component */}
                  <TextToSpeechButton textToRead={notes} />
                </div>
              </div>
            )}

            {/* Questions Tab Content */}
            {activeTab === "questions" && (
              <div className="bg-white rounded-lg p-5 shadow w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Ask AI About This Content</h2>

                {/* Add custom question input */}
                <div className="mb-6">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Ask a question about the video..."
                      className="flex-1 py-3 px-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          setQuestions([...questions, e.target.value.trim()])
                          e.target.value = ""
                        }
                      }}
                    />
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-r-lg font-medium"
                      onClick={(e) => {
                        const input = e.target.previousSibling
                        if (input.value.trim()) {
                          setQuestions([...questions, input.value.trim()])
                          input.value = ""
                        }
                      }}
                    >
                      Ask
                    </button>
                  </div>
                </div>

                {/* Rendering accordion questions */}
                {questions.length > 0 ? (
                  questions.map((question, index) => <AccordionQuestion key={index} question={question} />)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg">No questions asked yet.</p>
                    <p>Type a question above to get insights about the video content!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Notes and Q&A (Desktop only) */}
          <div className="hidden md:block md:w-2/3 w-full">
            {/* Notes Section */}
            <div className="bg-white rounded-lg p-5 shadow mb-6 w-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Video Notes</h2>

              {/* Render formatted notes */}
              {formattedNotes.length > 0 ? (
                formattedNotes.map((section) => (
                  <div key={section.id} className="mb-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">
                      {section.id}. {section.title}
                    </h3>

                    {/* Section content */}
                    <div className="mb-4 pl-2">{renderNotesContent(section.content)}</div>

                    {/* Subsections */}
                    {section.subsections.map((subsection) => (
                      <div key={subsection.id} className="mb-4 ml-4">
                        <h4 className="text-lg font-semibold mb-2 text-gray-700">
                          {subsection.id} {subsection.title}
                        </h4>
                        <div className="pl-2">{renderNotesContent(subsection.content)}</div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="prose max-w-none">
                  <ReactMarkdown>{notes}</ReactMarkdown>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => {
                    const element = document.createElement("a")
                    const file = new Blob([notes], { type: "text/markdown" })
                    element.href = URL.createObjectURL(file)
                    element.download = "youtube_notes.md"
                    document.body.appendChild(element)
                    element.click()
                    document.body.removeChild(element)
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex-1 text-center"
                >
                  Download Notes
                </button>

                {/* Text-to-Speech Button Component */}
                <TextToSpeechButton textToRead={notes} />
              </div>
            </div>

            {/* AI-Powered Q&A Section */}
            <div className="bg-white rounded-lg p-5 shadow w-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Ask AI About This Content</h2>

              {/* Add custom question input */}
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Ask a question about the video..."
                    className="flex-1 py-3 px-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        setQuestions([...questions, e.target.value.trim()])
                        e.target.value = ""
                      }
                    }}
                  />
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-r-lg font-medium"
                    onClick={(e) => {
                      const input = e.target.previousSibling
                      if (input.value.trim()) {
                        setQuestions([...questions, input.value.trim()])
                        input.value = ""
                      }
                    }}
                  >
                    Ask
                  </button>
                </div>
              </div>

              {/* Rendering accordion questions */}
              {questions.length > 0 ? (
                questions.map((question, index) => <AccordionQuestion key={index} question={question} />)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-lg">No questions asked yet.</p>
                  <p>Type a question above to get insights about the video content!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notes
