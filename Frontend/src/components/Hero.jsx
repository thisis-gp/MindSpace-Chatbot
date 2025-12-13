import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Button from "./Button";
import Section from "./Section";
import { person1, person2, person3 } from "../assets";
import {
  Brain,
  Heart,
  MessageCircle,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const features = [
    { icon: Brain, text: "AI-Powered Support" },
    { icon: Heart, text: "24/7 Available" },
    { icon: Shield, text: "100% Anonymous" },
    { icon: Sparkles, text: "Personalized Care" },
  ];

  return (
    <Section className="pt-[12rem] md:pt-[14rem] lg:pt-[16rem] -mt-[5.25rem] overflow-hidden relative z-10" id="hero">
      <div className="container relative">
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-12 pt-8 md:pt-12 lg:pt-16">
            {/* Small Tag */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-4 uppercase tracking-wider"
            >
              Mental Health Support
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900"
              style={{ fontFamily: 'serif' }}
            >
              Mental health is wealth
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              To live your life to the fullest, we're continuing to find ways to prevent mental health problems.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-center mb-10"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-gray-400"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                onClick={() => navigate("/signup")}
                size="lg"
                variant="primary"
                className="text-lg px-8 py-4"
              >
                Join now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => {
                  document.getElementById("what-we-offer")?.scrollIntoView({ behavior: "smooth" });
                }}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4"
              >
                Learn more
              </Button>
            </motion.div>
          </div>

          {/* Hero Faces Collage with Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-16 flex justify-center"
          >
            <div className="relative w-full max-w-6xl px-4">
              {/* Decorative Squiggles and Stars */}
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                style={{ zIndex: 0 }}
              >
                {/* Squiggle 1 - Top Left */}
                <motion.path
                  d="M 80 100 Q 120 70, 160 100 T 240 100"
                  stroke="#C97D60"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                />
                {/* Squiggle 2 - Top Right */}
                <motion.path
                  d="M 500 120 Q 540 90, 580 120 T 660 120"
                  stroke="#87A96B"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.3, duration: 1.5, ease: "easeInOut" }}
                />
                {/* Squiggle 3 - Bottom Left */}
                <motion.path
                  d="M 150 320 Q 200 290, 250 320 T 350 320"
                  stroke="#7FB3D3"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.4, duration: 1.5, ease: "easeInOut" }}
                />
                {/* Squiggle 4 - Bottom Right */}
                <motion.path
                  d="M 450 340 Q 500 310, 550 340 T 650 340"
                  stroke="#F4D03F"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                />
              </motion.svg>

              {/* Decorative Stars and Shapes */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute top-8 left-16 w-3 h-3 bg-accent-mustard rounded-full opacity-70 blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute top-28 right-20 w-2.5 h-2.5 bg-purple-300 rounded-full opacity-60"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="absolute bottom-16 left-28 w-4 h-4 bg-accent-warmOrange rounded-full opacity-50 blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute bottom-12 right-16 w-3 h-3 bg-accent-sage rounded-full opacity-60"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute top-1/2 left-12 w-2 h-2 bg-accent-peach rounded-full opacity-50"
              />

              {/* Heart Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="absolute bottom-20 right-28 text-pink-400 opacity-70"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </motion.div>

              {/* Faces Collage Container - Images already have labels and borders */}
              <div className="relative flex items-end justify-center gap-3 md:gap-4 lg:gap-6 flex-wrap">
                {/* Person 1 - Left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="relative group flex-shrink-0"
                >
                  <div className="relative transition-all duration-300 transform hover:scale-[1.03] hover:-rotate-1">
                    <img
                      src={person1}
                      alt="Person 1 - Mental health support"
                      className="w-40 h-auto sm:w-48 md:w-56 lg:w-64 object-contain drop-shadow-lg"
                      style={{ imageRendering: 'crisp-edges' }}
                      loading="eager"
                    />
                  </div>
                </motion.div>

                {/* Person 2 - Center (Larger and Elevated) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -30 }}
                  animate={{ opacity: 1, scale: 1, y: -24 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="relative group z-10 flex-shrink-0"
                  whileHover={{ scale: 1.03, y: -26 }}
                >
                  <div className="relative transition-all duration-300">
                    <img
                      src={person2}
                      alt="Person 2 - Mental health support"
                      className="w-52 h-auto sm:w-60 md:w-72 lg:w-80 object-contain drop-shadow-2xl"
                      style={{ imageRendering: 'crisp-edges' }}
                      loading="eager"
                    />
                  </div>
                </motion.div>

                {/* Person 3 - Right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="relative group flex-shrink-0"
                >
                  <div className="relative transition-all duration-300 transform hover:scale-[1.03] hover:rotate-1">
                    <img
                      src={person3}
                      alt="Person 3 - Mental health support"
                      className="w-40 h-auto sm:w-48 md:w-56 lg:w-64 object-contain drop-shadow-lg"
                      style={{ imageRendering: 'crisp-edges' }}
                      loading="eager"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.text}</h3>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
