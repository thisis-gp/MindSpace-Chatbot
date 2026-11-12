import { motion } from "framer-motion";
import Section from "./Section";
import Heading from "./Heading";
import { conversation } from "../assets";
import {
  MessageCircle,
  Clock,
  Heart,
  Brain,
  Sparkles,
} from "lucide-react";

const offerings = [
  {
    title: "For You",
    items: [
      {
        icon: MessageCircle,
        title: "AI-powered emotional support",
        description: "24/7 access to our empathetic AI companion that understands your feelings and provides instant, personalized support whenever you need it.",
      },
      {
        icon: Brain,
        title: "Mood tracking & insights",
        description: "Track your emotional well-being with visual analytics and get AI-powered insights to understand your patterns over time.",
      },
    ],
  },
];

const WhatWeOffer = () => {
  return (
    <Section id="what-we-offer" className="py-20 lg:py-28 bg-white relative z-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            What we offer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MindSpace is an AI companion for emotional support, built by students in India.
            It does not replace a doctor, therapist or counsellor.
          </p>
        </motion.div>

        {/* Conversation Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex justify-center"
        >
          <div className="relative w-full max-w-5xl px-4">
            <img
              src={conversation}
              alt="Mental health support conversation illustration"
              className="w-full h-auto object-contain rounded-2xl shadow-xl"
              style={{ imageRendering: 'crisp-edges' }}
              loading="lazy"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 max-w-3xl mx-auto">
          {offerings.map((offering, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.2, duration: 0.8 }}
              className="space-y-8"
            >
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {offering.title}
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-sage rounded-full"></div>
              </div>

              <div className="space-y-6">
                {offering.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: sectionIndex * 0.2 + index * 0.1, duration: 0.6 }}
                      className="flex gap-4 group"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default WhatWeOffer;
