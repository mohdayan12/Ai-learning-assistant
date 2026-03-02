import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Bell, User, Menu, Moon, Sun } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-6">
        <button
          onClick={toggleSidebar}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block"></div>
        <div className="flex items-center gap-3">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex items-center justify-center w-10 h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200 text-amber-500" />
            ) : (
              <Moon size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200 text-slate-700" />
            )}
          </button>

          <button className="relative inline-flex items-center justify-center w-10 h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group">
            <Bell
              size={20}
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 transition-all duration-300"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-200">
                <User size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
