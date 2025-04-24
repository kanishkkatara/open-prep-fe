// src/layouts/AppLayout.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
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
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { AITutorProvider } from '../context/AITutorContext'
import Button from '../components/ui/Button'
import ChatSidebar from '../components/chat/ChatSidebar'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  path?: string
  comingSoon?: boolean
}

const navLinks: NavItemProps[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app/dashboard' },
  { icon: <BookOpen size={20} />, label: 'Question Bank', path: '/app/questions' },
  { icon: <School size={20} />, label: 'Practice Tests', comingSoon: true },
  { icon: <BarChart2 size={20} />, label: 'Analytics', comingSoon: true },
  { icon: <Calculator size={20} />, label: 'Study Plan', comingSoon: true },
]

const secondaryLinks: NavItemProps[] = [
  { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
  { icon: <HelpCircle size={20} />, label: 'Help & Resources', path: '/app/help' },
]

const AppLayout: React.FC = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  // collapse states
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)

  // percentage widths
  const [leftPct, setLeftPct] = useState(18)   // 20% default
  const [rightPct, setRightPct] = useState(30) // 30% default

  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'left' | 'right' | null>(null)

  // drag-to-resize logic
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      if (draggingRef.current === 'left') {
        const pct = ((e.clientX - rect.left) / rect.width) * 100
        const max = 100 - rightPct - 5
        setLeftPct(Math.max(10, Math.min(pct, max)))
      } else {
        const pct = ((rect.right - e.clientX) / rect.width) * 100
        const max = 100 - leftPct - 5
        setRightPct(Math.max(10, Math.min(pct, max)))
      }
    }
    const onMouseUp = () => { draggingRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [leftPct, rightPct])

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <AITutorProvider>
      <div ref={containerRef} className="flex h-screen bg-gray-50 relative">
        {/* Left toggle button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 p-2 bg-white rounded shadow-md z-20"
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
              <Graduate size={26} className="text-blue-600 mr-2" />
              <h1 className="text-xl font-bold flex-1">OpenPrep</h1>
              <button onClick={() => setSidebarOpen(false)} className="p-1">
                <ChevronLeft size={20} />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {navLinks.map(({ icon, label, path, comingSoon }, idx) =>
                comingSoon ? (
                  <div
                    key={idx}
                    className="group relative flex items-center px-4 py-3 rounded-lg 
                               text-gray-400 bg-gray-50 cursor-not-allowed 
                               hover:bg-gray-100 transition-colors"
                  >
                    {icon}
                    <span className="ml-3 flex-1">{label}</span>
                    <div
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                 whitespace-nowrap rounded bg-gray-200 px-2 py-0.5 text-xs 
                                 text-gray-600 opacity-0 group-hover:opacity-100 
                                 transition-opacity"
                    >
                      Coming Soon
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={idx}
                    to={path!}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {icon}
                    <span className="ml-3">{label}</span>
                  </NavLink>
                )
              )}

              <hr className="my-4" />

              {secondaryLinks.map(({ icon, label, path }, idx) => (
                <NavLink
                  key={`sec-${idx}`}
                  to={path!}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {icon}
                  <span className="ml-3">{label}</span>
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
            style={{ width: '4px' }}
            onMouseDown={() => (draggingRef.current = 'left')}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-auto">
          <Outlet />
        </main>

        {/* Right Resizer */}
        {chatOpen && (
          <div
            className="cursor-col-resize hover:bg-gray-200"
            style={{ width: '4px' }}
            onMouseDown={() => (draggingRef.current = 'right')}
          />
        )}

        {/* Chat Toggle Button */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="absolute top-4 right-4 p-2 bg-white rounded shadow-md z-20"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Chat Sidebar */}
        {chatOpen && (
          <aside
            className="flex-shrink-0 flex flex-col bg-white border-l overflow-auto"
            style={{ width: `${rightPct}%` }}
          >
            {/* Unified header with arrow */}
            <div className="flex items-center justify-between bg-gray-50 p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">AI Tutor Assistant</h2>
                <p className="text-sm text-gray-500">Ask for hints or explanations</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-1">
                <ChevronRight size={20} />
              </button>
            </div>
            <ChatSidebar />
          </aside>
        )}
      </div>
    </AITutorProvider>
  )
}

export default AppLayout
