import './App.css'
import Register from './Pages/Register'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Error from './Pages/Error'
import FAQ from './Pages/FAQ'
import { Route, Routes, BrowserRouter, Navigate, useLocation } from 'react-router-dom'
import Footer from './Components/Footer'
import Quiz from './Pages/Quiz'
import Community from './Pages/Community'
import QuestionDetail from './Pages/QuestionDetail'
import Notes from './Pages/Notes'
import OTP from './Pages/OTP'
import AboutUs from './Pages/AboutUs'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Landing from './Pages/Landing'
import PlayQuiz from './Pages/PlayQuiz'
import TestRegister from './Pages/TestRegister'
import PrivateRoute from './Components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import { Analytics } from "@vercel/analytics/react"

// Only allow About, Contact, Register, Login if not logged in
const PublicOnlyRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const allowed = ['/about', '/contact', '/register', '/login', '/otp'];
  if (!currentUser && allowed.includes(location.pathname)) {
    return children;
  }
  if (!currentUser) {
    // Not logged in, redirect to landing or register
    return <Navigate to="/landing" replace />;
  }
  // If logged in, allow everything
  return children;
};

// Force all initial visits to Landing unless logged in or on allowed public route
const ForceLanding = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const allowed = ['/', '/landing', '/about', '/contact', '/register', '/login', '/otp'];
  if (!currentUser && !allowed.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {

  return (
    <>

    <AuthProvider>
      <BrowserRouter>
        <ForceLanding>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* Public only routes */}
            <Route path="/about" element={
              <PublicOnlyRoute>
                <AboutUs />
              </PublicOnlyRoute>
            } />
            <Route path="/contact" element={
              <PublicOnlyRoute>
                <Contact />
              </PublicOnlyRoute>
            } />
            {/* Protected routes */}
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route index element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="*" element={<Error />}/>
            <Route path='/notes' element={<PrivateRoute><Notes /></PrivateRoute>}/>
            <Route path='/faq' element={<PrivateRoute><FAQ /></PrivateRoute>}/>
            <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}/>
            <Route path='/quiz' element={<PrivateRoute><Quiz /></PrivateRoute>}/>
            <Route path="/playquiz" element={<PrivateRoute><PlayQuiz /></PrivateRoute>} />
            {/* Community Routes */}
            <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
            <Route path="/community/question/:questionId" element={<PrivateRoute><QuestionDetail /></PrivateRoute>} />
            <Route path='/otp' element={<OTP />}/>
            <Route path='/test' element={<PrivateRoute><TestRegister /></PrivateRoute>}/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ForceLanding>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
    <Analytics />
    </>
  )
}

export default App 
