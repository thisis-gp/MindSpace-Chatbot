import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Section from "./Section";
import Card from "./Card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "University Student",
    image: "👩‍🎓",
    rating: 5,
    text: "MindSpace has been a game-changer for me. The AI companion is incredibly understanding, and tracking my mood has helped me recognize patterns I never noticed before.",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Graduate Student",
    image: "👨‍💼",
    rating: 5,
    text: "The anonymous support feature gave me the courage to seek help. The journaling feature with AI insights has been incredibly valuable for my mental wellness journey.",
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "College Student",
    image: "👩",
    rating: 5,
    text: "I love how easy it is to track my progress. The session reports are detailed and the recommendations are always helpful. This platform truly cares about my wellbeing.",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Student",
    image: "👨‍🎓",
    rating: 5,
    text: "The distress detection feature is amazing. It helped me realize when I needed professional help, and the booking system made it so easy to connect with a psychologist.",
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "University Student",
    image: "👩‍💻",
    rating: 5,
    text: "As someone who was hesitant about therapy, MindSpace's anonymous approach made me feel safe. The mood tracking and progress visualization keep me motivated.",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Graduate Student",
    image: "👨",
    rating: 5,
    text: "The 24/7 availability is perfect for my schedule. Whether it's late night stress or early morning anxiety, I always have support available. Highly recommend!",
  },
];

const Testimonials = () => {
  return (
    <Section id="testimonials" className="py-20 bg-gradient-to-br from-stone-50 to-slate-50 relative z-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 rounded-full text-sm font-semibold text-primary-700 mb-4">
            <Quote className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Trusted by</span>
            <br />
            <span className="text-gray-900">Thousands of Students</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our community has to say about their mental wellness journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 flex-1 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: "10K+", label: "Active Users" },
            { number: "4.9/5", label: "Average Rating" },
            { number: "50K+", label: "Sessions Completed" },
            { number: "98%", label: "Satisfaction Rate" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

export default Testimonials;

