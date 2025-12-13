import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  CheckCircle,
  Circle,
  Trophy,
  TrendingUp,
  Award,
} from "lucide-react";
import { getActiveSessionReports, updateProgress } from "./api";
import Card from "./Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import { Modal } from "./Modal";

const Progress = ({ userId }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [progressNotes, setProgressNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchActiveReports();
    }
  }, [userId]);

  const fetchActiveReports = async () => {
    try {
      setLoading(true);
      const response = await getActiveSessionReports(userId);
      if (response && response.data) {
        setReports(response.data.reports || []);
      }
    } catch (error) {
      console.error("Error fetching active reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (reportId, actionIndex, completed) => {
    try {
      const report = reports.find((r) => r.id === reportId);
      if (!report) return;

      const updatedActions = [...(report.recommended_actions || [])];
      updatedActions[actionIndex] = {
        ...updatedActions[actionIndex],
        completed: completed,
      };

      await updateProgress(reportId, userId, {
        action_index: actionIndex,
        completed: completed,
        notes: progressNotes,
      });

      fetchActiveReports();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const calculateOverallProgress = (report) => {
    if (!report.recommended_actions || report.recommended_actions.length === 0) {
      return 0;
    }
    const completed = report.recommended_actions.filter(
      (action) => action.completed
    ).length;
    return Math.round((completed / report.recommended_actions.length) * 100);
  };

  const getMilestones = (progress) => {
    const milestones = [];
    if (progress >= 25) milestones.push({ level: 25, icon: "🎯", label: "Getting Started" });
    if (progress >= 50) milestones.push({ level: 50, icon: "🌟", label: "Halfway There" });
    if (progress >= 75) milestones.push({ level: 75, icon: "💪", label: "Almost There" });
    if (progress >= 100) milestones.push({ level: 100, icon: "🏆", label: "Completed!" });
    return milestones;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gradient">Progress Tracking</h2>
        <p className="text-gray-600 mt-1">
          Track your progress on recommended actions and celebrate milestones
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading progress...</p>
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-6">
          {reports.map((report, reportIndex) => {
            const overallProgress = calculateOverallProgress(report);
            const milestones = getMilestones(overallProgress);

            return (
              <motion.div
                key={report.id || reportIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reportIndex * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Session Report Progress
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(report.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={overallProgress === 100 ? "success" : "attention"}
                      size="sm"
                    >
                      {overallProgress}% Complete
                    </Badge>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="mb-6">
                    <ProgressBar
                      value={overallProgress}
                      max={100}
                      color="primary"
                    />
                  </div>

                  {/* Milestones */}
                  {milestones.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-pink-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-primary-600" />
                        <h4 className="font-semibold text-primary-900">Milestones Achieved</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {milestones.map((milestone, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-primary-200"
                          >
                            <span className="text-lg">{milestone.icon}</span>
                            <span className="text-sm font-medium text-primary-700">
                              {milestone.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  {report.recommended_actions && report.recommended_actions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-500" />
                        Recommended Actions
                      </h4>
                      <div className="space-y-2">
                        {report.recommended_actions.map((action, actionIndex) => {
                          const actionText =
                            typeof action === "string" ? action : action.text;
                          const isCompleted =
                            typeof action === "object" && action.completed;

                          return (
                            <motion.div
                              key={actionIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: actionIndex * 0.05 }}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                isCompleted
                                  ? "bg-green-50 border-green-200"
                                  : "bg-gray-50 border-gray-200 hover:border-primary-300"
                              }`}
                            >
                              <button
                                onClick={() =>
                                  handleUpdateProgress(
                                    report.id,
                                    actionIndex,
                                    !isCompleted
                                  )
                                }
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300 hover:border-primary-500"
                                }`}
                              >
                                {isCompleted && (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <span
                                className={`flex-1 ${
                                  isCompleted
                                    ? "line-through text-gray-500"
                                    : "text-gray-800"
                                }`}
                              >
                                {actionText}
                              </span>
                              {isCompleted && (
                                <Badge variant="success" size="sm">
                                  Done
                                </Badge>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Progress Notes */}
                  <div className="mt-4">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Add Progress Notes
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No active reports to track</p>
          <p className="text-sm text-gray-500">
            Complete a session to see recommended actions and track your progress
          </p>
        </Card>
      )}

      {/* Progress Notes Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => {
            setSelectedReport(null);
            setProgressNotes("");
          }}
          title="Add Progress Notes"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                placeholder="Share your progress, challenges, or achievements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={6}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={async () => {
                  if (selectedReport.id) {
                    await updateProgress(selectedReport.id, userId, {
                      notes: progressNotes,
                    });
                    fetchActiveReports();
                  }
                  setSelectedReport(null);
                  setProgressNotes("");
                }}
                className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Save Notes
              </button>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setProgressNotes("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Progress;
