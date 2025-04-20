import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap as Graduate, BarChart2, Settings, HelpCircle, LogOut, Menu, X, User, Home, School, Calculator } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { AITutorProvider } from '../context/AITutorContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const AppLayout: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };
  
  const navLinks = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app/dashboard' },
    { icon: <BookOpen size={20} />, label: 'Question Bank', path: '/app/questions/browse' },
    { icon: <School size={20} />, label: 'Practice Tests', path: '/app/practice-tests' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/app/analytics' },
    { icon: <Calculator size={20} />, label: 'Study Plan', path: '/app/study-plan' },
  ];
  
  const secondaryLinks = [
    { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
    { icon: <HelpCircle size={20} />, label: 'Help & Resources', path: '/app/help' },
  ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const NavItem = ({ icon, label, path }: { icon: React.ReactNode; label: string; path: string }) => (
    <NavLink
      to={path}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-100 text-blue-800' 
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
      onClick={() => setSidebarOpen(false)}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
  
  return (
    <AITutorProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="p-2 mr-2 rounded-full hover:bg-gray-100 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center">
              <Graduate className="text-blue-600 mr-2" size={26} />
              <h1 className="text-xl font-bold text-gray-900">OpenPrep</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                  onClick={toggleSidebar}
                />
                
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 overflow-y-auto lg:hidden"
                >
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Graduate className="text-blue-600" size={22} />
                      <span className="font-bold ml-2">OpenPrep</span>
                    </div>
                    <button 
                      onClick={toggleSidebar}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="py-4 px-3">
                    <div className="mb-6 space-y-1">
                      {navLinks.map((link, i) => (
                        <NavItem key={i} {...link} />
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 space-y-1">
                      {secondaryLinks.map((link, i) => (
                        <NavItem key={i} {...link} />
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-gray-700"
                        leftIcon={<LogOut size={18} />}
                        onClick={handleLogout}
                      >
                        Log out
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 bg-white border-r overflow-y-auto">
            <div className="py-6 px-3">
              <div className="mb-6 space-y-1">
                {navLinks.map((link, i) => (
                  <NavItem key={i} {...link} />
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-1">
                {secondaryLinks.map((link, i) => (
                  <NavItem key={i} {...link} />
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-700"
                  leftIcon={<LogOut size={18} />}
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AITutorProvider>
  );
};

export default AppLayout;