import { motion } from "framer-motion";
import Section from "./Section";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import {
  UserPlus,
  Users,
  FileSearch,
  Heart,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "Step 1",
    title: "Sign up online",
    description: "Signing up is simple and takes just a few minutes. We get to know you, assess your needs, understand your goals, and get your availability.",
    icon: UserPlus,
    color: "from-primary-500 to-primary-600",
  },
  {
    number: "Step 2",
    title: "Get matched with support",
    description: "Our AI companion is ready to help you immediately. For additional support, we can connect you with licensed mental health professionals tailored to your needs.",
    icon: Users,
    color: "from-accent-sage to-primary-500",
  },
  {
    number: "Step 3",
    title: "Access tailored resources",
    description: "Whether you're looking for AI chat support, mood tracking, journaling, or professional counseling—we've got it all. Move through options at your own pace.",
    icon: FileSearch,
    color: "from-accent-sky to-accent-sage",
  },
  {
    number: "Step 4",
    title: "Ongoing support",
    description: "Mental healthcare isn't a one-and-done. Our system works with you regularly—daily or weekly, based on need—to make sure you get the care you need.",
    icon: Heart,
    color: "from-accent-terracotta to-accent-sky",
  },
  {
    number: "Step 5",
    title: "Track your progress",
    description: "Get real-time insights about your mental health journey. Our dashboard allows you to track key metrics and see your progress over time.",
    icon: BarChart3,
    color: "from-primary-600 to-accent-terracotta",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <Section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative z-10">
      <div className="container">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-sm font-semibold text-primary-700 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            How it works
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Supercharge your mental wellness, in an inclusive and safe community.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our evidence-based, AI-powered system gives you the tools you need to become more resilient, productive, and empowered—at work and beyond.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                {/* Connector Line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent z-0" style={{ width: 'calc(100% - 4rem)' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full"></div>
                  </div>
                )}

                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all h-full">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-primary-600 mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={() => navigate("/signup")}
            size="lg"
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};

export default HowItWorks;
