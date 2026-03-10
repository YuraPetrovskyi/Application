import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppStore";
import { logout } from "../store/slices/authSlice";
import { openAssistant } from "../store/slices/uiSlice";
import { Calendar, LogOut, Plus, User, List, Menu, X, Bot } from "lucide-react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-2 text-xl font-bold text-indigo-600"
        >
          <Calendar size={22} />
          EventHub
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <List size={16} />
            Events
          </Link>
          {user ? (
            <>
              <Link
                to="/my-events"
                className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <Calendar size={16} />
                My Events
              </Link>
              <button
                onClick={() => dispatch(openAssistant())}
                className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <Bot size={16} />
                AI Assistant
              </button>
              <Link
                to="/events/create"
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                Create Event
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  <User size={16} />
                </div>
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Burger button (mobile) */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col px-6 py-6 gap-2 overflow-y-auto">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            <List size={16} className="text-gray-400" />
            Events
          </Link>
          {user ? (
            <>
              <Link
                to="/my-events"
                onClick={close}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                <Calendar size={16} className="text-gray-400" />
                My Events
              </Link>
              <button
                onClick={() => {
                  dispatch(openAssistant());
                  close();
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
              >
                <Bot size={16} className="text-gray-400" />
                AI Assistant
              </button>
              <Link
                to="/events/create"
                onClick={close}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
              >
                <Plus size={16} />
                Create Event
              </Link>
              <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 mt-1">
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <User size={14} />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-colors text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex h-full w-full justify-center flex-col gap-4 mt-2">
              <Link
                to="/login"
                onClick={close}
                className="flex w-50 items-center mx-auto justify-center gap-2 px-3 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Login
              </Link>
              <p className="text-center">or</p>
              <Link
                to="/register"
                onClick={close}
                className="flex w-50 items-center mx-auto justify-center gap-2 px-3 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
