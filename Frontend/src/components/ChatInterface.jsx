import React, { useState, useRef, useEffect } from "react";
import CrisisNotice from "./CrisisNotice";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Mic,
  Square,
  Smile,
  BookOpen,
  AlertCircle,
  Loader2,
  Sparkles,
  Bot,
  User,
  X,
  MessageSquare,
  Heart,
  Lightbulb,
} from "lucide-react";
import { sendChatMessage, sendAudioMessage } from "./api";
import DistressIndicator from "./DistressIndicator";
import Input from "./Input";
import Button from "./Button";

const ChatInterface = ({
  userId,
  messages = [],
  onNewMessage,
  onEscalate,
  onMoodCheck,
  onJournal,
}) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(new Audio());
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() && !audioUrl) return;

    const currentInput = input;
    const currentAudioUrl = audioUrl;

    // Add user message
    if (currentInput.trim()) {
      onNewMessage({ text: currentInput, sender: "user" });
      setInput("");
    }

    if (currentAudioUrl) {
      onNewMessage({ text: "Audio message sent", sender: "user" });
    }

    setIsTyping(true);

    try {
      let response;
      if (currentAudioUrl) {
        const audioBlob = await fetch(currentAudioUrl).then((r) => r.blob());
        response = await sendAudioMessage(userId, audioBlob);
        setAudioUrl(null);
        deleteAudio();
      } else {
        response = await sendChatMessage(userId, currentInput);
      }

      if (response && response.response) {
        onNewMessage({
          text: response.response,
          sender: "ai",
          audioUrl: response.audio
            ? URL.createObjectURL(
                new Blob(
                  [
                    Uint8Array.from(
                      atob(response.audio),
                      (c) => c.charCodeAt(0)
                    ),
                  ],
                  { type: "audio/mpeg" }
                )
              )
            : null,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      onNewMessage({
        text: "Sorry, the chat service is not available right now. If you need support now, please call Tele-MANAS on 14416 (free, 24x7) or 112 in an emergency.",
        sender: "ai",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = 1.25;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const deleteAudio = () => {
    setAudioUrl(null);
    audioRef.current.src = "";
    setIsPlaying(false);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col h-full relative bg-transparent">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 space-y-3 sm:space-y-4 scrollbar-thin relative">
        {/* Empty state - Redesigned */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full px-4"
          >
            {/* Animated Bot Icon */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mb-6 sm:mb-8 relative"
            >
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-6 sm:p-8 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl sm:rounded-3xl shadow-2xl">
                <Bot className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
              </div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 sm:mb-8 px-4"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Welcome to MindSpace
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
                I'm your AI companion, here to support you on your mental wellness journey. 
                Share what's on your mind, and let's work through it together.
              </p>
            </motion.div>
            
            {/* Quick Actions - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mb-6 sm:mb-8 px-2"
            >
              <motion.button
                onClick={onMoodCheck}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col sm:flex-row lg:flex-col items-center gap-3 p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl sm:rounded-2xl hover:border-yellow-300 hover:shadow-xl transition-all"
              >
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left lg:text-center">
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Check Mood</p>
                  <p className="text-xs text-gray-600 mt-1">Track your emotions</p>
                </div>
              </motion.button>

              <motion.button
                onClick={onJournal}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col sm:flex-row lg:flex-col items-center gap-3 p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all"
              >
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left lg:text-center">
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Journal</p>
                  <p className="text-xs text-gray-600 mt-1">Write your thoughts</p>
                </div>
              </motion.button>

              <motion.button
                onClick={onEscalate}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col sm:flex-row lg:flex-col items-center gap-3 p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl sm:rounded-2xl hover:border-red-300 hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1"
              >
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left lg:text-center">
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Get Help</p>
                  <p className="text-xs text-gray-600 mt-1">Find support</p>
                </div>
              </motion.button>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-2xl px-2"
            >
              <p className="text-xs sm:text-sm text-gray-500 text-center mb-2 sm:mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "How are you feeling today?",
                  "I need someone to talk to",
                  "Help me manage stress",
                ].map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setInput(suggestion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-all whitespace-nowrap"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Messages - Redesigned */}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 lg:gap-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-200"
                >
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, x: message.sender === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`max-w-[90%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 lg:py-4 shadow-lg ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-md"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-primary-600 prose-a:underline prose-ul:text-gray-700 prose-li:text-gray-700">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-white leading-relaxed">{message.text}</p>
                )}
                {message.audioUrl && (
                  <div className="mt-3">
                    <audio
                      controls
                      src={message.audioUrl}
                      ref={(el) => el && (el.playbackRate = 1.25)}
                      autoPlay
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </motion.div>
              
              {message.sender === "user" && (
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg ring-2 ring-gray-200"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator - Redesigned */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start gap-3 lg:gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-200">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-5 py-4 shadow-lg border border-gray-100">
              <div className="flex gap-2 items-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary-500 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium ml-2">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Distress Indicator */}
      {messages.length > 0 && (
        <div className="px-3 sm:px-4 lg:px-8 pb-2">
          <DistressIndicator
            userId={userId}
            currentMessage={messages[messages.length - 1]}
            onEscalate={onEscalate}
          />
        </div>
      )}

      {/* Input Area - Improved Design */}
      <div className="border-t border-gray-200/50 p-4 sm:p-5 lg:p-6 bg-white/90 backdrop-blur-xl shadow-lg">
        {audioUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <motion.button
              onClick={isPlaying ? pauseAudio : playAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {isPlaying ? (
                <Square className="w-5 h-5 text-primary-500" />
              ) : (
                <Send className="w-5 h-5 text-primary-500" />
              )}
            </motion.button>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "50%" }}
              />
            </div>
            <motion.button
              onClick={deleteAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Send
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex items-end gap-0 bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-primary-500 focus-within:shadow-md transition-all">
            {/* Text Input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 py-3.5 sm:py-4 px-4 sm:px-5 text-sm sm:text-base bg-transparent border-0 focus:outline-none resize-none min-h-[52px] max-h-32 overflow-y-auto scrollbar-thin placeholder:text-gray-400 text-gray-900 leading-relaxed"
              style={{
                minHeight: '52px',
                maxHeight: '128px',
              }}
            />
            
            {/* Vertical Divider */}
            <div className="w-px h-10 bg-gray-300 my-2"></div>
            
            {/* Voice Recorder Button */}
            <motion.button
              onClick={handleVoiceInput}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 sm:p-3.5 transition-all rounded-lg mx-1 ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                  : "text-gray-500 hover:text-primary-600 hover:bg-gray-100/80"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? (
                <Square className="w-5 h-5 sm:w-5 sm:h-5" />
              ) : (
                <Mic className="w-5 h-5 sm:w-5 sm:h-5" />
              )}
            </motion.button>
            
            {/* Send Button */}
            <motion.button
              onClick={handleSend}
              disabled={!input.trim()}
              whileHover={{ scale: input.trim() ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 sm:p-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg m-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm hover:shadow-md"
              title="Send message"
            >
              <Send className="w-5 h-5 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        )}
        <CrisisNotice className="mt-2" />
      </div>
    </div>
  );
};

export default ChatInterface;
