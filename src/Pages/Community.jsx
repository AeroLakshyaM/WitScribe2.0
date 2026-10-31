import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/useAuth';
import {
  createQuestion,
  listQuestions,
  subscribeToQuestions,
  toggleQuestionLike,
} from '../services/communityService';

export default function Community() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", description: "" });
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Load the feed and keep it current as questions, likes, and comments change.
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const result = await listQuestions(currentUser?.id);
        if (active) setQuestions(result);
      } catch (error) {
        console.error('Error loading community questions:', error);
      }
    };
    refresh();
    const channel = subscribeToQuestions(refresh, (error) => console.error(error));
    return () => {
      active = false;
      channel.unsubscribe();
    };
  }, [currentUser?.id]);

  // Reset mobile UI states when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setShowMobileSearch(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add a new question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (newQuestion.title.trim() && currentUser) {
      try {
        const questionId = await createQuestion({ ...newQuestion, user: currentUser });
        setNewQuestion({ title: "", description: "" });
        setIsModalOpen(false);
        // Navigate to the new question
        navigate(`/community/question/${questionId}`);
      } catch (error) {
        console.error("Error adding question:", error);
      }
    }
  };

  // Like/unlike a question
  const handleLike = async (question, e) => {
    e.preventDefault(); // Prevent navigation when clicking like button
    e.stopPropagation(); // Stop event bubbling
    
    if (!currentUser) {
      alert("Please sign in to like questions");
      return;
    }
    
    try {
      await toggleQuestionLike(question.id, currentUser.id, question.isLiked);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Navigate to question detail when clicking a question
  const handleQuestionClick = (questionId) => {
    navigate(`/community/question/${questionId}`);
  };

  // Search questions
  const filteredQuestions = questions.filter(q =>
    q.title?.toLowerCase().includes(search.toLowerCase()) ||
    (q.description && q.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setMobileMenuOpen(false);
    if (!showMobileSearch) {
      setTimeout(() => {
        document.getElementById('mobile-search-input')?.focus();
      }, 100);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <nav className="bg-black text-white py-2 px-3 md:p-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/home" 
            className="font-bold hover:text-gray-300 transition-colors text-lg md:text-xl z-10"
          >
            WitScribe
          </Link>
          
          {/* Desktop Search */}
          <div className="hidden md:block md:w-64 lg:w-80 mx-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="w-full px-3 py-1 text-sm rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-gray-200"
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              className="text-xl hover:opacity-75 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            >➕</button>
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
                src="https://i.pravatar.cc/32"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {!showMobileSearch && (
              <>
                <button onClick={toggleMobileSearch} className="p-1">
                  🔍
                </button>
                <button onClick={() => setIsModalOpen(true)} className="p-1">
                  ➕
                </button>
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1"
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Compact version */}
        {showMobileSearch && (
          <div className="mt-2 flex items-center md:hidden">
            <button 
              onClick={toggleMobileSearch}
              className="mr-2 text-sm"
            >
              ←
            </button>
            <input
              id="mobile-search-input"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="flex-1 px-2 py-1 text-sm rounded-lg bg-white text-gray-900 border border-gray-200"
              autoFocus
            />
            <button 
              onClick={toggleMobileSearch}
              className="ml-2 text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black z-20 border-t border-gray-800 md:hidden">
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-8 h-4 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                </label>
              </div>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 py-2 hover:bg-gray-800 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src="https://i.pravatar.cc/32"
                  alt="Profile"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm">Profile</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className={`flex flex-1 p-4 py-10 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="flex-1 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Community Questions</h1>
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id} 
                className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}
                onClick={() => handleQuestionClick(question.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{question.author}</span>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2 hover:text-red-500">{question.title}</h2>
                  {question.description && (
                    <p className="mb-3 text-gray-500">{question.description}</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={(e) => handleLike(question, e)}
                    className="flex items-center gap-1 text-red-500"
                  >
                    {question.isLiked ? '❤' : '♡'} {question.likes || 0}
                  </button>
                  <span className="flex items-center gap-1">
                    💬 {question.comments?.length || 0}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredQuestions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions found</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Ask a Question
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Add Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ask a Question</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddQuestion}>
              <div className="mb-4">
                <label className="block mb-2">Question Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 border border-gray-200"
                  placeholder="Enter your question title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description (Optional)</label>
                <textarea
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 border border-gray-200"
                  placeholder="Add more details to your question"
                  rows="4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  disabled={!newQuestion.title.trim() || !currentUser}
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
