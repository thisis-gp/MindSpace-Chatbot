import { useLocation, useNavigate, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { motion, AnimatePresence } from "framer-motion";
import { brainwave } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { X } from "lucide-react";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
    >
      <div className="container flex items-center justify-between px-5 lg:px-7.5 xl:px-10 py-4">
        <motion.a
          href="/"
          className="flex items-center gap-2 sm:gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <img 
            src={brainwave} 
            alt="MindSpace" 
            className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain logo-no-bg"
          />
          <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent whitespace-nowrap">
            MindSpace
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navigation
            .filter((item) => !item.onlyMobile)
            .map((item) => (
              <a
                key={item.id}
                href={item.url}
                className={`text-sm font-semibold transition-colors ${
                  item.url === pathname.hash
                    ? "text-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                {item.title}
              </a>
            ))}
        </nav>

        <div className="flex items-center gap-4">
          {!user && (
            <Link
              to="/signup"
              className="hidden lg:block text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
            >
              Sign up
            </Link>
          )}
          <Button
            className="hidden lg:flex"
            onClick={handleGetStarted}
            variant="primary"
          >
            {user ? "Dashboard" : "Sign in"}
          </Button>

          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={toggleNavigation}
          >
            {openNavigation ? (
              <X className="w-6 h-6" />
            ) : (
              <MenuSvg openNavigation={openNavigation} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {openNavigation && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="container px-5 py-4 space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={item.title === "Sign in" ? handleGetStarted : handleClick}
                  className={`block py-2 text-base font-semibold transition-colors ${
                    item.url === pathname.hash
                      ? "text-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.title}
                </a>
              ))}
              {!user && (
                <Link
                  to="/signup"
                  className="block w-full text-center py-2 text-base font-semibold text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={handleClick}
                >
                  Sign up
                </Link>
              )}
              <Button onClick={handleGetStarted} variant="primary" className="w-full mt-4">
                {user ? "Dashboard" : "Sign in"}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
