// src/layouts/AppLayout.tsx
import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  School,
  BarChart2,
  Calculator,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap as Graduate,
  Trash2,
  Play,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { AITutorProvider, useAITutor } from "../context/AITutorContext";
import Button from "../components/ui/Button";
import ChatSidebar from "../components/chat/ChatSidebar";

// Configuration for navigation links, with optional subtitles
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path?: string;
  comingSoon?: boolean;
  subtitle?: string;
}
const navLinks: NavItemProps[] = [
  { icon: <LayoutDashboard />, label: "Dashboard", path: "/app/dashboard", subtitle: "Your performance at a glance" },
  { icon: <BookOpen />, label: "Question Bank", path: "/app/questions" },
  { icon: <School />, label: "Practice Tests", comingSoon: true },
  { icon: <BarChart2 />, label: "Analytics", comingSoon: true },
  { icon: <Calculator />, label: "Study Plan", comingSoon: true },
];
const secondaryLinks: NavItemProps[] = [
  { icon: <Settings />, label: "Settings", path: "/app/settings" },
  { icon: <HelpCircle />, label: "Resources", subtitle: "Here are some of the top GMAT prep resources to guide your study journey:", path: "/app/resources" },
];

// Provider wrapper
const AppLayout: React.FC = () => (
  <AITutorProvider>
    <AppLayoutContent />
  </AITutorProvider>
);

// Main layout content
const AppLayoutContent: React.FC = () => {
  const { user, logout } = useUser();
  const { clearMessages } = useAITutor();
  const navigate = useNavigate();
  const location = useLocation();

  // Combine nav for lookup
  const allNav = [...navLinks, ...secondaryLinks];
  const currentNav = allNav.find(item => item.path === location.pathname);
  const title = currentNav?.label;

  // Dynamic subtitle: override for dashboard with user name
  let subtitle = currentNav?.subtitle;
  if (location.pathname === "/app/dashboard" && user) {
    subtitle = `Welcome back, ${user.name}! Here’s your study progress.`;
  }

  // Sidebar & chat toggles
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [leftPct, setLeftPct] = useState(18);
  const [rightPct, setRightPct] = useState(30);

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"left" | "right" | null>(null);

  // Drag-to-resize logic
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (draggingRef.current === "left") {
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        const max = 100 - rightPct - 5;
        setLeftPct(Math.max(10, Math.min(pct, max)));
      } else {
        const pct = ((rect.right - e.clientX) / rect.width) * 100;
        const max = 100 - leftPct - 5;
        setRightPct(Math.max(10, Math.min(pct, max)));
      }
    };
    const onMouseUp = () => {
      draggingRef.current = null;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [leftPct, rightPct]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div ref={containerRef} className="flex h-screen bg-gray-50 relative">
      {/* Sidebar toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 p-2 bg-white rounded shadow z-20"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Left Sidebar */}
      {sidebarOpen && (
        <aside
          className="flex-shrink-0 flex flex-col bg-white border-r overflow-auto"
          style={{ width: `${leftPct}%` }}
        >
          <div className="p-4 flex items-center border-b">
            <Graduate size={28} className="text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold flex-1">OpenPrep</h1>
            <button onClick={() => setSidebarOpen(false)} className="p-1">
              <ChevronLeft size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navLinks.map(({ icon, label, path, comingSoon }, idx) =>
              comingSoon ? (
                <div
                  key={idx}
                  className="group flex items-center px-4 py-2 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed hover:bg-gray-100"
                >
                  <span className="mr-3">{icon}</span>
                  <span className="font-medium">{label}</span>
                </div>
              ) : (
                <NavLink
                  key={idx}
                  to={path!}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="mr-3">{icon}</span>
                  <span className="font-medium">{label}</span>
                </NavLink>
              )
            )}
            <hr className="my-2" />
            {secondaryLinks.map(({ icon, label, path }, idx) => (
              <NavLink
                key={idx}
                to={path!}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="mr-3">{icon}</span>
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon={<LogOut size={18} />}
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </aside>
      )}

      {/* Left Resizer */}
      {sidebarOpen && (
        <div
          className="cursor-col-resize hover:bg-gray-200"
          style={{ width: "4px" }}
          onMouseDown={() => (draggingRef.current = "left")}
        />
      )}

      {/* Main Content + Header with optional subtitle */}
      <main className="flex-1 flex flex-col h-screen overflow-auto">
      {title && (
        <header className="flex items-center justify-between bg-gray-50 text-gray-900 px-8 py-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
          </div>
          {location.pathname === "/app/dashboard" && (
            <Button
              leftIcon={<Play size={18} />}
              onClick={() => navigate("/app/questions")}
              className="whitespace-nowrap"
            >
              Resume Learning
            </Button>
          )}
        </header>
      )}
        {/* Removed extra padding here */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Right Resizer */}
      {chatOpen && (
        <div
          className="cursor-col-resize hover:bg-gray-200"
          style={{ width: "4px" }}
          onMouseDown={() => (draggingRef.current = "right")}
        />
      )}

      {/* Chat Toggle */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="absolute top-4 right-4 p-2 bg-white rounded shadow z-20"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Chat Sidebar */}
      {chatOpen && (
        <aside
          className="flex-shrink-0 flex flex-col bg-white border-l"
          style={{ width: `${rightPct}%` }}
        >
          <div className="flex-shrink-0 flex items-center justify-between bg-gray-50 p-4 border-b">
            <h2 className="text-lg font-semibold">Clara AI Tutor</h2>
            <div className="flex items-center">
              <button
                onClick={clearMessages}
                className="text-gray-400 hover:text-red-500 mr-3"
                title="Clear Chat"
              >
                <Trash2 size={18} />
              </button>
              <button onClick={() => setChatOpen(false)} className="p-1">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatSidebar />
          </div>
        </aside>
      )}
    </div>
  );
};

export default AppLayout;
