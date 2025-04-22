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

const navLinks = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app/dashboard' },
  { icon: <BookOpen size={20} />, label: 'Question Bank', path: '/app/questions/browse' },
  { icon: <School size={20} />, label: 'Practice Tests', path: '/app/practice-tests' },
  { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/app/analytics' },
  { icon: <Calculator size={20} />, label: 'Study Plan', path: '/app/study-plan' },
]
const secondaryLinks = [
  { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
  { icon: <HelpCircle size={20} />, label: 'Help & Resources', path: '/app/help' },
]

interface NavItemProps {
  icon: React.ReactNode
  label: string
  path: string
}
const NavItem: React.FC<NavItemProps> = ({ icon, label, path }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {icon}
    <span className="ml-3">{label}</span>
  </NavLink>
)

const AppLayout: React.FC = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [leftWidth, setLeftWidth] = useState(240)
  const [rightWidth, setRightWidth] = useState(540) // Updated initial chat width

  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'left' | 'right' | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      if (draggingRef.current === 'left') {
        const newLeft = e.clientX - rect.left
        const maxLeft = rect.width - rightWidth - 100
        setLeftWidth(Math.max(100, Math.min(newLeft, maxLeft)))
      } else {
        const newRight = rect.right - e.clientX
        const maxRight = rect.width - leftWidth - 100
        setRightWidth(Math.max(100, Math.min(newRight, maxRight)))
      }
    }
    const onMouseUp = () => { draggingRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [leftWidth, rightWidth])

  return (
    <AITutorProvider>
      <div ref={containerRef} className="flex h-screen bg-gray-50">
        {/* Sidebar toggle button when collapsed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 p-2 bg-white rounded shadow-md z-20"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Left sidebar */}
        {sidebarOpen && (
          <aside
            className="flex-shrink-0 flex flex-col bg-white border-r overflow-auto"
            style={{ width: leftWidth }}
          >
            <div className="p-4 flex items-center border-b">
              <Graduate size={26} className="text-blue-600 mr-2" />
              <h1 className="text-xl font-bold flex-1">OpenPrep</h1>
              <button onClick={() => setSidebarOpen(false)} className="p-1">
                <ChevronLeft size={20} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navLinks.map((link, i) => <NavItem key={i} {...link} />)}
              <hr className="my-4" />
              {secondaryLinks.map((link, i) => <NavItem key={i} {...link} />)}
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

        {/* Resizer between sidebar and main */}
        {sidebarOpen && (
          <div
            className="cursor-col-resize hover:bg-gray-200"
            style={{ width: 4 }}
            onMouseDown={() => (draggingRef.current = 'left')}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 h-screen overflow-auto">
          <Outlet />
        </main>

        {/* Resizer between main and chat */}
        <div
          className="cursor-col-resize hover:bg-gray-200"
          style={{ width: 4 }}
          onMouseDown={() => (draggingRef.current = 'right')}
        />

        {/* Right chat panel */}
        <aside
          className="flex-shrink-0 flex flex-col bg-white border-l overflow-auto"
          style={{ width: rightWidth }}
        >
          <ChatSidebar />
        </aside>
      </div>
    </AITutorProvider>
  )
}

export default AppLayout
