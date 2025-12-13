import { motion } from "framer-motion";
import Heading from "./Heading";
import Section from "./Section";
import Button from "./Button";
import {
  MessageCircle,
  Smile,
  BookOpen,
  FileText,
  TrendingUp,
  Users,
  Brain,
  Heart,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const benefits = [
  {
    id: 1,
    title: "AI Chat Companion",
    text: "Talk to our empathetic AI that understands your feelings and provides instant support whenever you need it.",
    icon: MessageCircle,
    gradient: "from-primary-500 to-accent-sage",
    color: "text-primary-600",
  },
  {
    id: 2,
    title: "Mood Tracking",
    text: "Track your emotional well-being with visual charts and insights to understand your patterns over time.",
    icon: Smile,
    gradient: "from-accent-sand to-accent-terracotta",
    color: "text-amber-700",
  },
  {
    id: 3,
    title: "Personal Journal",
    text: "Express yourself freely with our journaling feature. Add images, track moods, and get AI-powered insights.",
    icon: BookOpen,
    gradient: "from-accent-sky to-primary-500",
    color: "text-sky-600",
  },
  {
    id: 4,
    title: "Session Reports",
    text: "Get detailed reports of your sessions with personalized recommendations and progress tracking.",
    icon: FileText,
    gradient: "from-primary-500 to-accent-forest",
    color: "text-primary-600",
  },
  {
    id: 5,
    title: "Progress Tracking",
    text: "Visualize your journey with milestone celebrations and achievement badges as you make progress.",
    icon: TrendingUp,
    gradient: "from-accent-forest to-accent-sky",
    color: "text-green-700",
  },
  {
    id: 6,
    title: "Professional Help",
    text: "Connect with licensed psychologists when you need professional support. Book sessions seamlessly.",
    icon: Users,
    gradient: "from-accent-terracotta to-primary-500",
    color: "text-orange-700",
  },
];

const Benefits = () => {
  return (
    <Section id="features" className="py-20 relative z-10">
      <div className="container relative z-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 rounded-full text-sm font-semibold text-primary-700 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Features
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Everything You Need</span>
            <br />
            <span className="text-gray-900">For Your Mental Wellness</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform designed to support your mental health journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} p-4 mb-6 flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </div>

                {/* Decorative Element */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full -mr-16 -mb-16`} />
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="relative inline-block p-8 bg-gradient-primary rounded-3xl shadow-2xl overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                Join thousands of users who have found support and guidance
              </p>
              <Button
                onClick={() => window.location.href = "/signup"}
                size="lg"
                variant="outline"
                className="bg-white text-primary-700 border-2 border-white hover:bg-primary-50"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Benefits;
