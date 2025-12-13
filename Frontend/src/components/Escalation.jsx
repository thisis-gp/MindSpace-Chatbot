import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Clock,
  Mail,
  Phone,
  Star,
  CheckCircle,
  Search,
} from "lucide-react";
import { getAvailablePsychologists, bookPsychologistSession } from "./api";
import Card from "./Card";
import Badge from "./ui/Badge";
import Input from "./Input";
import { Modal } from "./Modal";
import Toast from "./ui/Toast";

const Escalation = ({ userId }) => {
  const [psychologists, setPsychologists] = useState([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [bookingData, setBookingData] = useState({
    timeSlot: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    fetchPsychologists();
  }, []);

  useEffect(() => {
    filterPsychologists();
  }, [psychologists, searchQuery, selectedSpecialty]);

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      const response = await getAvailablePsychologists(selectedSpecialty || null);
      if (response && response.data) {
        const psychList = response.data.psychologists || response.data || [];
        setPsychologists(psychList);
        setFilteredPsychologists(psychList);
      }
    } catch (error) {
      console.error("Error fetching psychologists:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPsychologists = () => {
    let filtered = psychologists;

    if (searchQuery) {
      filtered = filtered.filter(
        (psych) =>
          psych.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          psych.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(
        (psych) => psych.specialty === selectedSpecialty
      );
    }

    setFilteredPsychologists(filtered);
  };

  const handleBookSession = async () => {
    if (!selectedPsychologist || !bookingData.timeSlot || !bookingData.date) {
      return;
    }

    try {
      await bookPsychologistSession({
        user_id: userId,
        psychologist_id: selectedPsychologist.id,
        time_slot_id: bookingData.timeSlot,
        date: bookingData.date,
        notes: bookingData.notes,
      });

      setShowBookingModal(false);
      setShowSuccessToast(true);
      setSelectedPsychologist(null);
      setBookingData({ timeSlot: "", date: "", notes: "" });
    } catch (error) {
      console.error("Error booking session:", error);
    }
  };

  const specialties = [
    ...new Set(psychologists.map((p) => p.specialty).filter(Boolean)),
  ];

  const timeSlots = selectedPsychologist?.available_slots || [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gradient">Professional Help</h2>
        <p className="text-gray-600 mt-1">
          Connect with licensed psychologists when you need support
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search psychologists..."
            className="pl-10"
          />
        </div>
        <select
          value={selectedSpecialty}
          onChange={(e) => {
            setSelectedSpecialty(e.target.value);
            fetchPsychologists();
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Psychologists List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading psychologists...</p>
        </div>
      ) : filteredPsychologists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPsychologists.map((psych, index) => (
            <motion.div
              key={psych.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{psych.name}</h3>
                    {psych.specialty && (
                      <Badge variant="outline" size="sm" className="mt-1">
                        {psych.specialty}
                      </Badge>
                    )}
                  </div>
                  {psych.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{psych.rating}</span>
                    </div>
                  )}
                </div>

                {psych.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {psych.bio}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {psych.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{psych.email}</span>
                    </div>
                  )}
                  {psych.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{psych.phone}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedPsychologist(psych);
                    setShowBookingModal(true);
                  }}
                  className="w-full px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Book Session
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery || selectedSpecialty
              ? "No psychologists found"
              : "No psychologists available"}
          </p>
        </Card>
      )}

      {/* Booking Modal */}
      {selectedPsychologist && (
        <Modal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedPsychologist(null);
            setBookingData({ timeSlot: "", date: "", notes: "" });
          }}
          title={`Book Session with ${selectedPsychologist.name}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() =>
                      setBookingData({ ...bookingData, timeSlot: slot })
                    }
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      bookingData.timeSlot === slot
                        ? "bg-gradient-primary text-white border-primary-500"
                        : "border-gray-300 hover:border-primary-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (optional)
              </label>
              <textarea
                value={bookingData.notes}
                onChange={(e) =>
                  setBookingData({ ...bookingData, notes: e.target.value })
                }
                placeholder="Any specific concerns or topics you'd like to discuss..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBookSession}
                disabled={!bookingData.date || !bookingData.timeSlot}
                className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedPsychologist(null);
                  setBookingData({ timeSlot: "", date: "", notes: "" });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Toast */}
      <Toast
        message="Session booked successfully! You'll receive a confirmation email shortly."
        type="success"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
};

export default Escalation;
