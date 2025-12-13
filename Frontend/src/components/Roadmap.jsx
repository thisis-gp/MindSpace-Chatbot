import { motion } from "framer-motion";
import Section from "./Section";
import { roadmap } from "../constants";
import { CheckCircle, Clock, Sparkles, Calendar } from "lucide-react";
import Card from "./Card";

const Roadmap = () => (
  <Section className="overflow-hidden py-20 bg-white relative z-10" id="roadmap">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 rounded-full text-sm font-semibold text-primary-700 mb-4">
          <Sparkles className="w-4 h-4" />
          Roadmap
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">Our Development Journey</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See what we've built and what's coming next
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmap.map((item, index) => {
            const isDone = item.status === "done";
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="h-full"
              >
                <Card className="h-full p-6 hover-lift relative overflow-hidden">
                  {/* Status indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isDone ? "bg-status-well" : "bg-status-moderate"
                  }`} />
                  
                  {/* Content */}
                  <div className="pt-2">
                    {/* Header with date and status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{item.date}</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isDone
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{isDone ? "Completed" : "In Progress"}</span>
                      </div>
                    </div>

                    {/* Image */}
                    {item.imageUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {item.text}
                    </p>

                    {/* Progress indicator for in-progress items */}
                    {!isDone && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-primary rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "65%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">65%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-accent-sage/30 border-2 border-primary-200 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <h3 className="text-2xl font-bold text-gray-900">More Features Coming Soon</h3>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're constantly working on new features to improve your mental wellness journey. 
              Stay tuned for updates!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {["Mobile App", "Group Sessions", "AI Insights", "Wellness Challenges"].map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/60 rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  </Section>
);

export default Roadmap;
