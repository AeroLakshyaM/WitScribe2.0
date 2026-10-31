"use client"

// QuestionDetail.jsx (Detail page for a single question)
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import {
  addQuestionComment,
  deleteQuestion,
  deleteQuestionComment,
  getQuestionDetail,
  getRelatedQuestions,
  subscribeToQuestion,
  toggleQuestionLike,
} from "../services/communityService"

export default function QuestionDetail() {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [darkMode, setDarkMode] = useState(true)
  const [question, setQuestion] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [relatedQuestions, setRelatedQuestions] = useState([])

  // Fetch the question and its related data, then refresh on database changes.
  useEffect(() => {
    let active = true
    const refreshQuestion = async () => {
      try {
        const result = await getQuestionDetail(questionId, currentUser?.id)
        if (!active) return
        if (!result) {
          navigate("/community")
          return
        }
        setQuestion(result)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching question:", error)
        if (active) setLoading(false)
      }
    }
    const refreshRelated = async () => {
      try {
        const result = await getRelatedQuestions(questionId, currentUser?.id)
        if (active) setRelatedQuestions(result)
      } catch (error) {
        console.error("Error fetching related questions:", error)
      }
    }
    refreshQuestion()
    refreshRelated()
    const channel = subscribeToQuestion(questionId, refreshQuestion, (error) => console.error(error))
    return () => {
      active = false
      channel.unsubscribe()
    }
  }, [questionId, currentUser?.id, navigate])

  const handleDeleteQuestion = async () => {
    if (!currentUser) {
      alert("Please sign in to delete this question")
      return
    }

    // Check if current user is the author of the question
    if (question.authorId !== currentUser.uid) {
      alert("You can only delete your own questions")
      return
    }

    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return
    }

    try {
      // Delete the question document
      await deleteQuestion(questionId)

      // Navigate back to community page
      navigate("/community")
    } catch (error) {
      console.error("Error deleting question:", error)
      alert("Failed to delete question. Please try again.")
    }
  }

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please sign in to like")
      return
    }

    try {
      await toggleQuestionLike(questionId, currentUser.id, question.isLiked)
    } catch (error) {
      console.error("Error updating question like:", error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      alert("Please sign in to comment")
      return
    }

    if (!newComment.trim()) return

    try {
      await addQuestionComment(questionId, currentUser, newComment)

      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Error adding comment. Please try again.")
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) {
      alert("Please sign in to delete comments")
      return
    }

    const commentToDelete = question.comments.find((comment) => comment.id === commentId)
    if (!commentToDelete) return

    // Check if user is authorized to delete this comment
    if (commentToDelete.authorId !== currentUser.uid) {
      alert("You can only delete your own comments")
      return
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      await deleteQuestionComment(commentId)
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Failed to delete comment. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <nav className="bg-black text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center">
            <Link to="/home" className="text-xl font-bold hover:text-gray-300 transition-colors">
              WitScribe
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <nav className="bg-black text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center">
            <Link to="/home" className="text-xl font-bold hover:text-gray-300 transition-colors">
              WitScribe
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <p>Question not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <nav className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/home" className="text-xl font-bold hover:text-gray-300 transition-colors">
            WitScribe
          </Link>
          <div className="flex-1 flex items-center justify-end gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>
              <Link to="/profile" className="hover:opacity-80 transition-opacity">
                <img
                  src={currentUser?.photoURL || "https://i.pravatar.cc/32"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className={`flex flex-1 p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <div className="flex-1 max-w-3xl mx-auto">
          <div className="mb-4">
            <Link to="/community" className="text-blue-500 hover:underline mb-4 inline-block">
              ← Back to Community
            </Link>

            <div
              className={`border rounded-lg p-4 mb-4 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={question.avatar || `https://i.pravatar.cc/100?u=${question.authorId || Math.random()}`}
                    alt={question.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{question.author}</span>
                  <span className="text-sm text-gray-500">
                    {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                {currentUser && question.authorId === currentUser.uid && (
                  <button
                    onClick={handleDeleteQuestion}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    title="Delete question"
                  >
                    Delete
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold mb-2">{question.title}</h2>
              {question.description && (
                <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{question.description}</p>
              )}
              <div className="flex gap-4">
                <button onClick={handleLike} className="flex items-center gap-1 text-red-500">
                  {question.isLiked ? "❤" : "♡"} {question.likes || 0}
                </button>
                <span className="flex items-center gap-1">💬 {question.comments?.length || 0}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-2">Add Your Comment</h3>
              <form onSubmit={handleAddComment} className="bg-opacity-50 mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  className={`w-full p-3 rounded-lg mb-3 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                  rows="3"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  disabled={!currentUser || !newComment.trim()}
                >
                  {currentUser ? "Post Comment" : "Sign in to Comment"}
                </button>
              </form>

              <h3 className="font-bold mb-3">Comments ({question.comments?.length || 0})</h3>
              <div className="space-y-3">
                {question.comments && question.comments.length > 0 ? (
                  question.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"} border`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {currentUser && comment.authorId === currentUser.uid && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            title="Delete comment"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="whitespace-pre-line">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block w-80 ml-4">
          <div
            className={`border rounded-lg p-4 sticky top-4 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-md`}
          >
            <h3 className="font-bold mb-3">Related Questions</h3>
            <div className="space-y-2">
              {relatedQuestions.map((q) => (
                <Link
                  key={q.id}
                  to={`/community/question/${q.id}`}
                  className="block hover:text-blue-500 transition-colors"
                >
                  {q.title}
                </Link>
              ))}
              {relatedQuestions.length === 0 && <p className="text-gray-500">No related questions found</p>}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
