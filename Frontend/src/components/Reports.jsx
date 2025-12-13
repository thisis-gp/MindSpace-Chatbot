import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";
import { getSessionReports, getActiveSessionReports } from "./api";
import Card from "./Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import { Modal } from "./Modal";

const Reports = ({ userId }) => {
  const [reports, setReports] = useState([]);
  const [activeReports, setActiveReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchReports();
      fetchActiveReports();
    }
  }, [userId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getSessionReports(userId);
      if (response && response.data) {
        setReports(response.data.reports || []);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveReports = async () => {
    try {
      const response = await getActiveSessionReports(userId);
      if (response && response.data) {
        setActiveReports(response.data.reports || []);
      }
    } catch (error) {
      console.error("Error fetching active reports:", error);
    }
  };

  const handleDownload = (report) => {
    const content = `
Session Report - ${new Date(report.created_at).toLocaleDateString()}

Summary:
${report.summary || "N/A"}

Mood Trends:
${report.mood_trends || "N/A"}

Recommended Actions:
${report.recommended_actions?.join("\n") || "N/A"}

Progress:
${report.progress_notes || "N/A"}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gradient">Session Reports</h2>
        <p className="text-gray-600 mt-1">View your wellness journey and progress</p>
      </div>

      {/* Active Reports */}
      {activeReports.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Active Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReports.map((report, index) => (
              <motion.div
                key={report.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 hover-lift cursor-pointer" onClick={() => setSelectedReport(report)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Session Report</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(report.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="attention" size="sm">Active</Badge>
                  </div>
                  
                  {report.summary && (
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                      {report.summary}
                    </p>
                  )}

                  {report.recommended_actions && report.recommended_actions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Recommended Actions:
                      </p>
                      <div className="space-y-1">
                        {report.recommended_actions.slice(0, 3).map((action, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.progress && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{report.progress}%</span>
                      </div>
                      <ProgressBar value={report.progress} color="primary" animated={false} showLabel={false} />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Reports */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" />
          All Reports
        </h3>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-600">Loading reports...</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report, index) => (
              <motion.div
                key={report.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="p-4 hover-lift cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Session Report</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(report.created_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(report);
                        }}
                        className="p-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reports available yet</p>
          </Card>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Session Report - ${new Date(selectedReport.created_at || Date.now()).toLocaleDateString()}`}
          size="lg"
        >
          <div className="space-y-6">
            {selectedReport.summary && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  Summary
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.summary}</p>
              </div>
            )}

            {selectedReport.mood_trends && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Mood Trends
                </h4>
                <p className="text-gray-700">{selectedReport.mood_trends}</p>
              </div>
            )}

            {selectedReport.recommended_actions && selectedReport.recommended_actions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Recommended Actions</h4>
                <div className="space-y-2">
                  {selectedReport.recommended_actions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReport.progress_notes && (
              <div>
                <h4 className="font-semibold mb-2">Progress Notes</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.progress_notes}</p>
              </div>
            )}

            {selectedReport.progress !== undefined && (
              <div>
                <h4 className="font-semibold mb-2">Overall Progress</h4>
                <ProgressBar value={selectedReport.progress} max={100} color="primary" />
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => handleDownload(selectedReport)}
                className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reports;
