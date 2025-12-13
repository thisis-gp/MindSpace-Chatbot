import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricing } from "../constants";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PricingList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {pricing.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -10 }}
          className={`relative p-8 rounded-2xl ${
            item.id === 2
              ? "bg-gradient-primary text-white shadow-2xl scale-105 border-4 border-primary-300"
              : "bg-white border-2 border-gray-200 shadow-lg"
          }`}
        >
          {item.id === 2 && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
              MOST POPULAR
            </div>
          )}

          <h4 className={`text-2xl font-bold mb-2 ${item.id === 2 ? "text-white" : "text-gray-900"}`}>
            {item.title}
          </h4>

          <p className={`mb-6 ${item.id === 2 ? "text-white/90" : "text-gray-600"}`}>
            {item.description}
          </p>

          <div className="mb-6">
            {item.price && item.price !== "Free" ? (
              <div className="flex items-baseline">
                <span className={`text-2xl font-bold ${item.id === 2 ? "text-white" : "text-gray-900"}`}>
                  ₹
                </span>
                <span className={`text-5xl font-bold ${item.id === 2 ? "text-white" : "text-gray-900"}`}>
                  {item.price}
                </span>
                <span className={`ml-2 ${item.id === 2 ? "text-white/70" : "text-gray-600"}`}>
                  /month
                </span>
              </div>
            ) : (
              <div className={`text-5xl font-bold ${item.id === 2 ? "text-white" : "text-gray-900"}`}>
                Free
              </div>
            )}
          </div>

          <Button
            className="w-full mb-6"
            onClick={handleGetStarted}
            href={item.price ? "/signup" : "mailto:am400718@gmail.com"}
            variant={item.id === 2 ? "outline" : "primary"}
          >
            {item.price ? "Get started" : "Contact us"}
          </Button>

          <ul className="space-y-4">
            {item.features.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                className="flex items-start gap-3"
              >
                <Check
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    item.id === 2 ? "text-white" : "text-primary-600"
                  }`}
                />
                <span className={item.id === 2 ? "text-white/90" : "text-gray-700"}>
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingList;
