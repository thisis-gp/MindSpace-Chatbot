import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Heart, TrendingUp } from "lucide-react";
import { getDistressScore } from "./api";
import Badge from "./ui/Badge";
import { Modal } from "./Modal";

const DistressIndicator = ({ userId, currentMessage, onEscalate }) => {
  const [distressLevel, setDistressLevel] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentMessage && userId) {
      checkDistressLevel();
    }
  }, [currentMessage, userId]);

  const checkDistressLevel = async () => {
    setIsLoading(true);
    try {
      const response = await getDistressScore(userId);
      if (response && response.distress_score !== undefined) {
        setDistressLevel(response.distress_score);
        if (response.distress_score >= 7) {
          setShowAlert(true);
        }
      }
    } catch (error) {
      console.error("Error fetching distress score:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDistressColor = (score) => {
    if (score >= 8) return "urgent";
    if (score >= 6) return "attention";
    if (score >= 4) return "warning";
    return "success";
  };

  const getDistressLabel = (score) => {
    if (score >= 8) return "High Distress";
    if (score >= 6) return "Moderate Distress";
    if (score >= 4) return "Mild Distress";
    return "Low Distress";
  };

  if (!distressLevel && !isLoading) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <div className="relative">
          <Heart
            className={`w-5 h-5 ${
              distressLevel >= 7
                ? "text-status-urgent animate-pulse"
                : distressLevel >= 5
                ? "text-status-attention"
                : "text-status-well"
            }`}
          />
          {distressLevel >= 7 && (
            <motion.div
              className="absolute inset-0 rounded-full bg-status-urgent opacity-20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <Badge
          variant={getDistressColor(distressLevel)}
          size="sm"
          className="animate-fade-in"
        >
          {getDistressLabel(distressLevel)}
        </Badge>
      </motion.div>

      <AnimatePresence>
        {showAlert && (
          <Modal
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            title="Distress Alert"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-6 h-6 text-status-urgent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    High Distress Detected
                  </h3>
                  <p className="text-sm text-red-700">
                    We've detected that you might be experiencing high levels of distress.
                    Would you like to speak with a professional?
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Recommended Actions:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Speak with a licensed psychologist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Try some breathing exercises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>Call Tele-MANAS on 14416 (free, 24x7) or emergency services on 112 if needed</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAlert(false);
                    if (onEscalate) onEscalate();
                  }}
                  className="flex-1 bg-gradient-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Book Session
                </button>
                <button
                  onClick={() => setShowAlert(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  I'm Okay
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DistressIndicator;
