"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"

export default function QuizPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { quizData, topic } = location.state || {}

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [timer, setTimer] = useState(30)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [redirectTimer, setRedirectTimer] = useState(30)
  const [showColorGuide, setShowColorGuide] = useState(true)

  const handleNext = useCallback(() => {
    if (currentQuestion < (quizData?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setAnswered(false)
      setTimer(30)
    } else {
      setShowResult(true)
    }
  }, [currentQuestion, quizData?.length])

  useEffect(() => {
    if (showResult) {
      const redirectInterval = setInterval(() => {
        setRedirectTimer((prev) => {
          if (prev === 1) {
            navigate("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(redirectInterval)
    }
  }, [showResult, navigate])

  useEffect(() => {
    if (showResult) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleNext()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentQuestion, showResult, handleNext])

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-2xl font-semibold text-gray-800 mb-4">No quiz data found</div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  const current = quizData[currentQuestion]

  const handleGotIt = () => {
    setShowColorGuide(false)
  }

  const handleOptionClick = (index) => {
    if (answered || showResult) return
    setSelectedOption(index)
    setAnswered(true)

    const correctIndex = current.answer.charCodeAt(0) - 65
    if (index === correctIndex) {
      setScore((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    setShowResult(true)
  }

  const getButtonStyle = (index) => {
    if (!answered) {
      return "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
    }
    const correctIndex = current.answer.charCodeAt(0) - 65
    if (index === correctIndex) return "bg-red-500 text-white border border-red-500 shadow-lg"
    if (index === selectedOption) return "bg-black text-white border border-black shadow-lg"
    return "bg-white border border-gray-300 text-gray-800 opacity-50"
  }

  const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100
  const timerPercentage = (timer / 30) * 100

  if (showResult) {
    const percentage = Math.round((score / quizData.length) * 100)
    const getScoreColor = () => {
      if (percentage >= 80) return "text-green-600"
      if (percentage >= 60) return "text-yellow-600"
      return "text-red-500"
    }

    const getScoreMessage = () => {
      if (percentage >= 90) return "Outstanding! 🎉"
      if (percentage >= 80) return "Great job! 👏"
      if (percentage >= 70) return "Good work! 👍"
      if (percentage >= 60) return "Not bad! 🙂"
      return "Keep practicing! 💪"
    }

    return (
      <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-800">Quiz Completed!</div>
              <div className="text-lg text-gray-600">{topic}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="text-5xl font-bold">
                <span className={getScoreColor()}>{score}</span>
                <span className="text-gray-400"> / {quizData.length}</span>
              </div>
              <div className="text-xl font-semibold text-gray-700">{percentage}% Correct</div>
              <div className="text-gray-600">{getScoreMessage()}</div>
            </div>

            <div className="space-y-3">
              <div className="text-gray-500">
                Redirecting to home in <span className="font-semibold text-red-500">{redirectTimer}</span> seconds...
              </div>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-black transition-all duration-300 shadow-lg"
              >
                Go Home Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      {showColorGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-black p-4">
              <h2 className="text-xl font-bold text-white">Quiz Instructions</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-800 font-semibold mb-2">📋 Quiz Structure</p>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Total Questions: {quizData.length}</li>
                    <li>• Time per Question: 30 seconds</li>
                    <li>• Auto-advance when time expires</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-800 font-semibold mb-2">🎨 Answer Colors</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <p className="text-gray-700 text-sm">Correct Answer</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded"></div>
                      <p className="text-gray-700 text-sm">Your Selected Answer</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGotIt}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg font-semibold hover:from-black hover:to-gray-800 transition-all duration-300"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-black p-4">
              <div className="flex justify-between items-center text-white">
                <div className="space-y-1">
                  <div className="text-sm opacity-90">{topic}</div>
                  <div className="text-lg font-semibold">
                    Question {currentQuestion + 1} of {quizData.length}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSkip}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-300"
                  >
                    End Quiz
                  </button>
                  <div className="text-right">
                    <div className="text-xs opacity-90">Time Left</div>
                    <div className="text-xl font-bold">00:{timer < 10 ? `0${timer}` : timer}</div>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs opacity-90">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      timer <= 10 ? "bg-red-400" : timer <= 20 ? "bg-yellow-400" : "bg-green-400"
                    }`}
                    style={{ width: `${timerPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-800 leading-relaxed">{current.question}</div>
              </div>

              {/* Options */}
              <div className="grid md:grid-cols-2 gap-4">
                {current.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={answered}
                    className={`group relative p-4 rounded-xl text-left font-medium transition-all duration-300 transform hover:scale-[1.02] ${getButtonStyle(index)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${
                          !answered
                            ? "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
                            : current.answer.charCodeAt(0) - 65 === index
                              ? "bg-white text-red-500"
                              : selectedOption === index
                                ? "bg-white text-black"
                                : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1 leading-relaxed">{option}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Next Button */}
              {answered && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-bold tracking-wide hover:from-black hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
                  </button>
                </div>
              )}
            </div>

            {/* Score Display */}
            <div className="bg-gray-50 px-6 py-3 border-t">
              <div className="flex justify-between items-center text-gray-600 text-sm">
                <div>
                  Current Score: <span className="font-semibold text-gray-800">{score}</span> /{" "}
                  {currentQuestion + (answered ? 1 : 0)}
                </div>
                <div>
                  Accuracy:{" "}
                  <span className="font-semibold text-gray-800">
                    {currentQuestion + (answered ? 1 : 0) > 0
                      ? Math.round((score / (currentQuestion + (answered ? 1 : 0))) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
