import { motion } from "framer-motion";
import Header from "../components/Header";
import Hero from "../components/Hero";
import WhatWeOffer from "../components/WhatWeOffer";
import Benefits from "../components/Benefits";
import HowItWorks from "../components/HowItWorks";
import Roadmap from "../components/Roadmap";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean Animated Background with Evenly Distributed Elements */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient - Warmer cream/off-white like Healpoint */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/30 to-stone-50" />
        
        {/* Main animated blobs - evenly positioned */}
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-sage/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-accent-sky/30 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2"
          animate={{
            x: [0, 60, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Medium floating circles - evenly distributed */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary-300/15 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-24 h-24 bg-accent-sage/15 rounded-full"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-accent-sky/15 rounded-full"
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent-terracotta/15 rounded-full"
          animate={{
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Corner elements - evenly spaced */}
        <motion.div
          className="absolute top-1/2 left-0 w-20 h-20 bg-primary-400/10 rounded-full"
          animate={{
            x: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-20 h-20 bg-accent-sage/10 rounded-full"
          animate={{
            x: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Center elements - evenly distributed */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 bg-accent-sky/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Subtle decorative icons - evenly spaced */}
        <motion.div
          className="absolute top-1/5 left-1/5 text-4xl opacity-5"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          🧠
        </motion.div>
        <motion.div
          className="absolute top-1/5 right-1/5 text-4xl opacity-5"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          💚
        </motion.div>
        <motion.div
          className="absolute bottom-1/5 left-1/5 text-4xl opacity-5"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          🌱
        </motion.div>
        <motion.div
          className="absolute bottom-1/5 right-1/5 text-4xl opacity-5"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          ✨
        </motion.div>
        
        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #5A9B7A 1px, transparent 0)`,
          backgroundSize: '80px 80px'
        }} />
        
        {/* Organic wave at bottom */}
        <svg className="absolute bottom-0 left-0 w-full h-48 opacity-5" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path
            d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5A9B7A" />
              <stop offset="100%" stopColor="#87A96B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-[4.75rem] lg:pt-[5.25rem]"
        >
          <Hero />
          <WhatWeOffer />
          <Benefits />
          <HowItWorks />
          <Roadmap />
          <Pricing />
        </motion.div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
