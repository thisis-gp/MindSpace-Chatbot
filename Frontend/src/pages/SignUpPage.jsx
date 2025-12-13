import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { database, auth } from "../firebase";
import { ref, set } from "firebase/database";
import { useAuth } from "../components/AuthContext";
import MarkdownModal from "../components/Modal";
import { termsContent, privacyContent } from "../constants";
import { brainwave } from "../assets";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft, Check } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import Toast from "../components/ui/Toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const signUpWithGoogle = async () => {
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const userData = {
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          picture: result.user.photoURL,
        };
        await addUserToRealtimeDatabase(userData);
        login(userData);
        localStorage.setItem("userId", userData.id);
        navigate("/dashboard");
      } catch (popupError) {
        await signInWithRedirect(auth, provider);
      }
    } catch (err) {
      setError("Sign up failed. Please try again.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const addUserToRealtimeDatabase = async (userData) => {
    try {
      const userRef = ref(database, `users/${userData.id}`);
      await set(userRef, {
        name: userData.name,
        email: userData.email,
        id: userData.id,
        picture: userData.picture,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error saving data to Realtime Database:", err);
      setError("Error saving user data. Please try again.");
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      setShowToast(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setShowToast(true);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setShowToast(true);
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: formData.name,
      });

      // Create user data object
      const userData = {
        id: user.uid,
        name: formData.name,
        email: user.email,
        picture: user.photoURL || null,
        createdAt: new Date().toISOString(),
      };

      // Save to database
      await addUserToRealtimeDatabase(userData);

      // Login the user
      login(userData);
      localStorage.setItem("userId", userData.id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign up error:", error);
      let errorMessage = "Sign up failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password accounts are not enabled. Please contact support.";
      }
      
      setError(errorMessage);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { met: formData.password.length >= 6, text: "At least 6 characters" },
    { met: /[A-Z]/.test(formData.password), text: "One uppercase letter" },
    { met: /[0-9]/.test(formData.password), text: "One number" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-stone-50 via-slate-50 to-neutral-50">
      {/* Enhanced Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated gradient blobs */}
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-sage/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent-sky/25 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-300/20 rounded-2xl rotate-45"
          animate={{
            y: [0, -30, 0],
            rotate: [45, 90, 45],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent-terracotta/20 rounded-full"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-accent-sage/25 rounded-lg rotate-12"
          animate={{
            rotate: [12, 372, 12],
            x: [0, -30, 0],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Floating circles */}
        <motion.div
          className="absolute top-1/5 left-1/5 w-16 h-16 bg-primary-400/15 rounded-full"
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-2/3 left-1/3 w-12 h-12 bg-accent-sky/20 rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/5 right-1/5 w-14 h-14 bg-accent-terracotta/15 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Subtle dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #5A9B7A 1px, transparent 0)`, 
            backgroundSize: '60px 60px' 
          }} 
        />
        
        {/* Animated wave pattern at bottom */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-64 opacity-10" 
          viewBox="0 0 1200 200" 
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
            fill="url(#waveGradientSignup)"
            animate={{
              d: [
                "M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z",
                "M0,100 Q300,150 600,100 T1200,100 L1200,200 L0,200 Z",
                "M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <defs>
            <linearGradient id="waveGradientSignup" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5A9B7A" />
              <stop offset="50%" stopColor="#87A96B" />
              <stop offset="100%" stopColor="#5A9B7A" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Top wave pattern */}
        <svg 
          className="absolute top-0 left-0 w-full h-48 opacity-8" 
          viewBox="0 0 1200 150" 
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 Q400,0 800,50 T1200,50 L1200,0 L0,0 Z"
            fill="url(#topWaveGradientSignup)"
            animate={{
              d: [
                "M0,50 Q400,0 800,50 T1200,50 L1200,0 L0,0 Z",
                "M0,50 Q400,100 800,50 T1200,50 L1200,0 L0,0 Z",
                "M0,50 Q400,0 800,50 T1200,50 L1200,0 L0,0 Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <defs>
            <linearGradient id="topWaveGradientSignup" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#87A96B" />
              <stop offset="100%" stopColor="#5A9B7A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="container mx-auto px-6 py-6">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:text-primary-600 hover:bg-white/80 hover:border-primary-300/50 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:text-primary-600 transition-colors" />
            </motion.div>
            <span className="text-sm font-semibold">Back</span>
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center items-center mb-6"
                >
                  <img 
                    src={brainwave} 
                    width={180} 
                    height={180} 
                    alt="MindSpace" 
                    className="logo-no-bg object-contain block" 
                  />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </h1>
                <p className="text-gray-600">
                  Start your mental wellness journey today
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignUp} className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      {passwordRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.met ? "bg-green-500" : "bg-gray-300"
                          }`}>
                            {req.met && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={req.met ? "text-green-700" : "text-gray-500"}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsOpen(true)}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyOpen(true)}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant="primary"
                  disabled={loading || !agreedToTerms || !formData.name || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
                >
                  {loading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <Button
                onClick={signUpWithGoogle}
                disabled={loading || !agreedToTerms}
                className="w-full mb-4"
                variant="outline"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {loading ? "Signing up..." : "Sign up with Google"}
              </Button>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <MarkdownModal
        title="Terms and Conditions"
        content={termsContent}
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <MarkdownModal
        title="Privacy Policy"
        content={privacyContent}
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Toast */}
      <Toast
        message={error || "Something went wrong"}
        type="error"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default SignUpPage;

