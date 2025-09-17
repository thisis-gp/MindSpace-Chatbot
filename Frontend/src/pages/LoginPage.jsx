import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import axios from "axios";
import { database, auth } from "../firebase";
import { ref, set } from "firebase/database";
import { useAuth } from "../components/AuthContext"; // Import Auth Context
import MarkdownModal from "../components/Modal";
import { termsContent, privacyContent } from "../constants";
import { brainwaveSymbol } from "../assets/index";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Get login function from Auth Context
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Add state variables for the modals
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const loginWithGoogle = async () => {
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
        // Fallback to redirect if popup blocked
        await signInWithRedirect(auth, provider);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Removed manual Google userinfo fetch; Firebase Auth provides profile

  const addUserToRealtimeDatabase = async (userData) => {
    try {
      const userRef = ref(database, `users/${userData.id}`);
      await set(userRef, {
        name: userData.name,
        email: userData.email,
        id: userData.id,
        picture: userData.picture,
      });
      console.log("User data saved to Realtime Database");
    } catch (err) {
      console.error("Error saving data to Realtime Database:");
      setError("Error saving user data. Please try again.");
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setProfile(null);
    localStorage.removeItem("userId");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-[#d1e5e4]">
        <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center space-x-2">
                <img
                  src={brainwaveSymbol}
                  alt="logo"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-2xl font-bold text-purple-600">
                  MindSpace
                </span>
              </div>
            </Link>
          </div>
          <p className="text-center text-gray-600 mb-6">
            Use your Google account to sign in or create a new account.
          </p>
          {loading ? (
            <p className="text-center text-blue-500">Logging in...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : !profile ? (
            <button
              onClick={loginWithGoogle}
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg"
            >
              Sign in with Google 🚀
            </button>
          ) : (
            <div className="text-center">
              <img
                src={profile.picture}
                alt="User"
                className="rounded-full mb-4"
              />
              <h3>User Logged In</h3>
              <p>Name: {profile.name}</p>
              <p>Email: {profile.email}</p>
              <button
                onClick={logOut}
                className="mt-4 bg-red-500 text-white font-semibold py-2 rounded-lg"
              >
                Log out
              </button>
            </div>
          )}
          {/* Your login and profile code will go here */}
          <p className="mt-6 text-center text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-purple-600 hover:underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-purple-600 hover:underline"
            >
              Privacy Policy
            </button>
            .
          </p>
        </Card>
      </div>
      <Footer />
      {/* Terms Modal */}
      <MarkdownModal
        title="Terms and Conditions"
        content={termsContent}
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Privacy Modal */}
      <MarkdownModal
        title="Privacy Policy"
        content={privacyContent}
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
