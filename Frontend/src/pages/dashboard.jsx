import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Smile,
  BookOpen,
  FileText,
  Target,
  Users,
  Settings as SettingsIcon,
  Menu,
  X,
  Bell,
  LogOut,
  Sparkles,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import { sendChatMessage } from "../components/api";
import ChatInterface from "../components/ChatInterface";
import MoodTracker from "../components/MoodTracker";
import Journal from "../components/Journal";
import Reports from "../components/Reports";
import Progress from "../components/Progress";
import Escalation from "../components/Escalation";
import Settings from "../components/Settings";
import NotificationsPanel from "../components/NotificationsPanel";
import { brainwave } from "../assets";

const menuItems = [
  { id: "chat", label: "Chat", icon: MessageCircle, component: "ChatInterface", color: "from-primary-500 to-primary-600" },
  { id: "mood", label: "Mood", icon: Smile, component: "MoodTracker", color: "from-yellow-400 to-orange-500" },
  { id: "journal", label: "Journal", icon: BookOpen, component: "Journal", color: "from-blue-400 to-indigo-500" },
  { id: "reports", label: "Reports", icon: FileText, component: "Reports", color: "from-purple-400 to-pink-500" },
  { id: "progress", label: "Progress", icon: Target, component: "Progress", color: "from-green-400 to-emerald-500" },
  { id: "escalation", label: "Get Help", icon: Users, component: "Escalation", color: "from-red-400 to-rose-500" },
];

const Dashboard = () => {
  const [activeView, setActiveView] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "message",
      title: "New message from AI",
      message: "Your weekly mood report is ready to view.",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: 2,
      type: "reminder",
      title: "Daily check-in reminder",
      message: "Don't forget to track your mood today!",
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: false,
    },
    {
      id: 3,
      type: "progress",
      title: "Great progress!",
      message: "You've completed 7 days of consistent mood tracking.",
      timestamp: new Date(Date.now() - 24 * 3600000),
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "New feature available",
      message: "Check out the new journaling templates in your journal section.",
      timestamp: new Date(Date.now() - 3 * 24 * 3600000),
      read: true,
    },
  ]);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (messages.length > 0) {
        await sendChatMessage(userId, "generate report");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [messages.length, userId]);

  const fetchUserData = async (userId) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const renderActiveView = () => {
    const props = { userId };
    
    switch (activeView) {
      case "chat":
        return (
          <ChatInterface
            {...props}
            messages={messages}
            onNewMessage={handleNewMessage}
            onEscalate={() => setActiveView("escalation")}
            onMoodCheck={() => setActiveView("mood")}
            onJournal={() => setActiveView("journal")}
          />
        );
      case "mood":
        return <MoodTracker {...props} />;
      case "journal":
        return <Journal {...props} />;
      case "reports":
        return <Reports {...props} />;
      case "progress":
        return <Progress {...props} />;
      case "escalation":
        return <Escalation {...props} />;
      case "settings":
        return <Settings {...props} />;
      default:
        return <ChatInterface {...props} messages={messages} onNewMessage={handleNewMessage} />;
    }
  };

  const activeItem = menuItems.find((item) => item.id === activeView);

  return (
    <div className="flex h-screen overflow-hidden relative w-full">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-slate-50 to-neutral-50" />
        
        {/* Large animated blobs */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/25 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-sage/25 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-accent-sky/20 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-primary-300/15 rounded-3xl rotate-45"
          animate={{
            y: [0, -40, 0],
            rotate: [45, 135, 45],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-32 h-32 bg-accent-terracotta/15 rounded-full"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-accent-sage/20 rounded-xl rotate-12"
          animate={{
            rotate: [12, 372, 12],
            x: [0, -40, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Floating circles */}
        {[...Array(6)].map((_, i) => {
          const sizes = [12, 16, 20, 16, 14, 18];
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 3 === 0 ? "bg-primary-400/10" : i % 3 === 1 ? "bg-accent-sky/10" : "bg-accent-terracotta/10"
              }`}
              style={{
                width: `${sizes[i]}px`,
                height: `${sizes[i]}px`,
                top: `${15 + i * 12}%`,
                left: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -30 + i * 5, 0],
                scale: [1, 1.2 + i * 0.05, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.5,
              }}
            />
          );
        })}
        
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #5A9B7A 1px, transparent 0)`, 
            backgroundSize: '50px 50px' 
          }} 
        />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: sidebarOpen ? 0 : -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed lg:relative z-20 w-[280px] lg:w-[280px] md:w-[260px] h-screen lg:h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-2xl"
      >
        {/* Sidebar Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200/50 flex flex-col items-center justify-center bg-gradient-to-r from-primary-500/10 to-transparent relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex items-center justify-center mb-2 lg:mb-3"
          >
            <img src={brainwave} alt="MindSpace" className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 object-contain logo-no-bg" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent text-center"
          >
            MindSpace
          </motion.span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100/50 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 lg:p-4 scrollbar-thin space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 lg:py-3.5 rounded-xl mb-2 transition-all relative overflow-hidden group ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/30`
                    : "text-gray-700 hover:bg-gray-100/50 hover:shadow-md"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r opacity-100"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 lg:w-5 lg:h-5 relative z-10 ${isActive ? "text-white" : "text-gray-600 group-hover:text-primary-600"}`} />
                <span className={`font-semibold text-sm lg:text-base relative z-10 ${isActive ? "text-white" : ""}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto relative z-10"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 lg:p-4 border-t border-gray-200/50 bg-gradient-to-t from-gray-50/50 to-transparent">
          <motion.button
            onClick={() => {
              navigate("/");
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-gray-700 hover:bg-gray-100/50 transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm lg:text-base">Home</span>
          </motion.button>
          <motion.button
            onClick={() => {
              setActiveView("settings");
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-gray-700 hover:bg-gray-100/50 transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="font-medium text-sm lg:text-base">Settings</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full lg:w-auto">
        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100/50 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                {activeItem?.label || "Dashboard"}
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 mt-0.5 truncate">
                {userData ? `Welcome back, ${userData.name?.split(' ')[0] || 'User'}` : "Welcome back!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Notifications */}
            <motion.button
              onClick={() => setNotificationsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 lg:p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"
                />
              )}
            </motion.button>

            {/* User Menu */}
            <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-gray-200">
              {userData?.picture && (
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={userData.picture}
                  alt={userData.name}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full ring-2 ring-primary-200 flex-shrink-0"
                />
              )}
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{userData?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{userData?.email}</p>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 lg:p-2.5 hover:bg-red-50 rounded-xl transition-colors text-red-600 flex-shrink-0"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full overflow-y-auto scrollbar-thin"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[15]"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Button - Always visible on mobile when sidebar is closed */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </motion.button>
      )}

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default Dashboard;
