import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  Image as ImageIcon,
  Sparkles,
  Calendar,
} from "lucide-react";
import { getJournalEntries, createJournalEntry } from "./api";
import { Modal } from "./Modal";
import Card from "./Card";
import Badge from "./ui/Badge";
import Input from "./Input";

const Journal = ({ userId }) => {
  const [entries, setEntries] = useState([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    text: "",
    image: null,
    mood: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchEntries();
    }
  }, [userId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await getJournalEntries(userId);
      if (response && response.data) {
        setEntries(response.data.entries || []);
      }
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEntry({ ...newEntry, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!newEntry.text.trim()) return;

    try {
      await createJournalEntry(userId, newEntry);
      setShowEntryModal(false);
      setNewEntry({ text: "", image: null, mood: null });
      setImagePreview(null);
      fetchEntries();
    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Journal</h2>
          <p className="text-gray-600 mt-1">Reflect on your thoughts and feelings</p>
        </div>
        <button
          onClick={() => setShowEntryModal(true)}
          className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your journal entries..."
          className="pl-10"
        />
      </div>

      {/* Entries Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading entries...</p>
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-4 hover-lift cursor-pointer h-full flex flex-col"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.timestamp || Date.now()).toLocaleDateString()}
                  </div>
                  {entry.mood && (
                    <Badge variant="outline" size="sm">
                      {entry.mood}
                    </Badge>
                  )}
                </div>
                {entry.image && (
                  <img
                    src={entry.image}
                    alt="Journal entry"
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="text-gray-800 line-clamp-3 flex-1">
                  {entry.text}
                </p>
                {entry.ai_insights && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-xs text-primary-600">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-medium">AI Insights</span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {searchQuery ? "No entries found" : "No journal entries yet"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowEntryModal(true)}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Write Your First Entry
            </button>
          )}
        </Card>
      )}

      {/* Entry Modal */}
      <Modal
        isOpen={showEntryModal}
        onClose={() => {
          setShowEntryModal(false);
          setNewEntry({ text: "", image: null, mood: null });
          setImagePreview(null);
        }}
        title="New Journal Entry"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={newEntry.text}
              onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
              placeholder="Write about your day, thoughts, feelings..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add an image (optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <ImageIcon className="w-5 h-5" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setNewEntry({ ...newEntry, image: null });
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood (optional)
            </label>
            <select
              value={newEntry.mood || ""}
              onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select mood...</option>
              <option value="excellent">😄 Excellent</option>
              <option value="good">😊 Good</option>
              <option value="okay">😐 Okay</option>
              <option value="poor">😔 Poor</option>
              <option value="bad">😢 Bad</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!newEntry.text.trim()}
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Entry
            </button>
            <button
              onClick={() => {
                setShowEntryModal(false);
                setNewEntry({ text: "", image: null, mood: null });
                setImagePreview(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <Modal
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          title={`Entry from ${new Date(selectedEntry.timestamp || Date.now()).toLocaleDateString()}`}
        >
          <div className="space-y-4">
            {selectedEntry.image && (
              <img
                src={selectedEntry.image}
                alt="Journal entry"
                className="w-full rounded-lg"
              />
            )}
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{selectedEntry.text}</p>
            </div>
            {selectedEntry.ai_insights && (
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <h4 className="font-semibold text-primary-900">AI Insights</h4>
                </div>
                <p className="text-sm text-primary-800">{selectedEntry.ai_insights}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Journal;
