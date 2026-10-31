import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; // Adjust import path as needed
import { supabase } from "../lib/supabase";

export default function OTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  // The signup confirmation code is sent to the registered email.
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registrationEmail');
    if (!storedEmail) {
      navigate('/register');
      return;
    }
    
    setEmail(storedEmail);
  }, [navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
      if (resendError) throw resendError;

      setMessage('A new verification code has been sent to your email');
      setCountdown(60); // Disable resend button for 60 seconds
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Check if all digits are filled
    if (otp.includes("")) {
      setError("Please enter all 6 digits of the OTP.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const otpString = otp.join("");
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otpString,
        type: 'email',
      });
      if (verifyError) throw verifyError;

      setMessage('Email verified successfully!');
      
      // Clear session storage
      sessionStorage.removeItem('registrationEmail');
      
      // Redirect to home page after short delay
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-2xl shadow-2xl text-center py-16 px-12 relative">
          <div className="absolute top-0 left-0 w-full h-48 bg-red-500 clip-path-triangle"></div>
          <div className="relative z-10">
            <div className="w-44 h-44 mx-auto mb-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5957/5957507.png"
                alt="Verify Illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-3">Please Verify Your Account</h1>
            <p className="text-lg text-gray-500 mb-2">
              Enter the six digit code we sent to your email address to verify your
              new WitScribe account.
            </p>
            {email && (
              <p className="text-md font-medium text-gray-700 mb-8">
                Verification code sent to: {email}
              </p>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {message}
              </div>
            )}

            <div className="flex justify-center gap-4 mb-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-16 h-16 text-center text-2xl border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                  disabled={loading}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-base mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white text-lg px-10 py-3 rounded-md disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <p className="text-base text-gray-600 mt-6">
              Didn't Receive it?{' '}
              <button 
                onClick={handleResend} 
                disabled={loading || countdown > 0}
                className="text-black font-semibold underline disabled:text-gray-400"
              >
                {countdown > 0
                  ? `Resend OTP (${countdown}s)`
                  : loading
                  ? 'Sending...'
                  : 'Resend OTP'}
              </button>
            </p>
          </div>
        </div>

        <style>{`
          .clip-path-triangle {
            clip-path: polygon(0 0, 100% 0, 50% 100%);
          }
        `}</style>
      </div>
    </>
  );
}

