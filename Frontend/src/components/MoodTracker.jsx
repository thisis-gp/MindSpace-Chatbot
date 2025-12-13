import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Smile, Frown, Meh } from "lucide-react";
import { getMoodHistory, storeMoodEntry } from "./api";
import { AreaChart, LineChart } from "./ui/Chart";
import { Modal } from "./Modal";
import Badge from "./ui/Badge";
import Card from "./Card";

const MOOD_EMOJIS = [
  { value: 5, emoji: "😄", label: "Excellent", color: "bg-mood-excellent" },
  { value: 4, emoji: "😊", label: "Good", color: "bg-mood-good" },
  { value: 3, emoji: "😐", label: "Okay", color: "bg-mood-okay" },
  { value: 2, emoji: "😔", label: "Poor", color: "bg-mood-poor" },
  { value: 1, emoji: "😢", label: "Bad", color: "bg-mood-bad" },
];

const MoodTracker = ({ userId }) => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(7); // days

  useEffect(() => {
    if (userId) {
      fetchMoodHistory();
    }
  }, [userId, timeRange]);

  const fetchMoodHistory = async () => {
    try {
      setLoading(true);
      const response = await getMoodHistory(userId, timeRange);
      if (response && response.data) {
        setMoodHistory(response.data.mood_entries || []);
      }
    } catch (error) {
      console.error("Error fetching mood history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;

    try {
      const moodData = {
        moodScore: selectedMood.value,
        moodLabel: selectedMood.label,
        journalText: journalText,
      };

      await storeMoodEntry(userId, moodData);
      setShowEntryModal(false);
      setSelectedMood(null);
      setJournalText("");
      fetchMoodHistory();
    } catch (error) {
      console.error("Error storing mood entry:", error);
    }
  };

  const getMoodDataForChart = () => {
    return moodHistory.map((entry) => ({
      label: new Date(entry.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: entry.mood_score,
    }));
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood_score, 0);
    return (sum / moodHistory.length).toFixed(1);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return "stable";
    const recent = moodHistory.slice(-3).reduce((a, b) => a + b.mood_score, 0) / 3;
    const older = moodHistory.slice(0, 3).reduce((a, b) => a + b.mood_score, 0) / 3;
    if (recent > older + 0.5) return "improving";
    if (recent < older - 0.5) return "declining";
    return "stable";
  };

  const trend = getMoodTrend();
  const averageMood = getAverageMood();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Mood Tracker</h2>
          <p className="text-gray-600 mt-1">Track your emotional well-being</p>
        </div>
        <button
          onClick={() => setShowEntryModal(true)}
          className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Smile className="w-5 h-5" />
          Log Mood
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-gradient mt-1">
                {averageMood}/5
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gradient mt-1">
                {moodHistory.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trend</p>
              <p className="text-2xl font-bold text-gradient mt-1 capitalize">
                {trend}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-energetic rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 14, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === days
                ? "bg-gradient-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {days} days
          </button>
        ))}
      </div>

      {/* Chart */}
      {moodHistory.length > 0 ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mood Trend</h3>
          <div className="h-64">
            <AreaChart
              data={getMoodDataForChart()}
              color="#5A9B7A"
              height={256}
            />
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Smile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No mood entries yet</p>
          <button
            onClick={() => setShowEntryModal(true)}
            className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Log Your First Mood
          </button>
        </Card>
      )}

      {/* Recent Entries */}
      {moodHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {moodHistory.slice(0, 5).map((entry, index) => {
              const mood = MOOD_EMOJIS.find((m) => m.value === entry.mood_score);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mood?.emoji}</span>
                    <div>
                      <p className="font-medium">{mood?.label}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">
                    {entry.mood_score}/5
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Mood Entry Modal */}
      <Modal
        isOpen={showEntryModal}
        onClose={() => {
          setShowEntryModal(false);
          setSelectedMood(null);
          setJournalText("");
        }}
        title="Log Your Mood"
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-3">How are you feeling today?</p>
            <div className="grid grid-cols-5 gap-3">
              {MOOD_EMOJIS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedMood?.value === mood.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optional: Add a note
            </label>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="How are you feeling? What's on your mind?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleMoodSubmit}
              disabled={!selectedMood}
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Mood
            </button>
            <button
              onClick={() => {
                setShowEntryModal(false);
                setSelectedMood(null);
                setJournalText("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MoodTracker;
