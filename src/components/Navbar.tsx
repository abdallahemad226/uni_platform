import React from 'react';
import {
  Sun,
  Moon,
  GraduationCap,
  ShieldCheck,
  Lock,
  User,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { StudentRecord } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
  loggedStudent: StudentRecord | null;
  onOpenStudentAuth: () => void;
  onOpenStudentProfile: () => void;
  onOpenStudentChat: () => void;
  onLogoutStudent: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDark,
  toggleTheme,
  onOpenPortal,
  onOpenAdmin,
  loggedStudent,
  onOpenStudentAuth,
  onOpenStudentProfile,
  onOpenStudentChat,
  onLogoutStudent,
  unreadCount
}) => {
  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    // Departments, Specialization, Schedules & Registration: only shown when student is logged in
    ...(loggedStudent ? [
      { id: 'departments', label: 'الأقسام العلمية' },
      { id: 'specialization', label: 'التشعيب الأكاديمي' },
      { id: 'schedules', label: 'الجداول الدراسية' },
      { id: 'registration', label: 'التسجيل الدراسي' },
    ] : []),
    { id: 'services', label: 'الخدمات والنتائج' },
    { id: 'projects', label: 'مشاريع التخرج' },
    { id: 'staff', label: 'هيئة التدريس' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-right focus:outline-none group text-neutral-900 dark:text-white"
          >
            <div className="w-9 h-9 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-neutral-800 dark:group-hover:bg-neutral-200 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight whitespace-nowrap leading-tight">
                حاسبات ومعلومات قنا
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal whitespace-nowrap">
                جامعة جنوب الوادي · FCI SVU
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`whitespace-nowrap transition-colors relative py-1 ${
                  isActive
                    ? 'text-neutral-950 dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Auth Hub */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="تبديل المظهر"
            className="p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Student Logged In vs Log In Button */}
          {loggedStudent ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 sm:p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
              
              {/* Chat Messages Pill */}
              <button
                onClick={onOpenStudentChat}
                className="relative p-1.5 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="الرسائل والمحادثات الداخلية"
              >
                <MessageSquare className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-mono font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Avatar & Info Button */}
              <button
                onClick={onOpenStudentProfile}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-right"
                title="الملف الشخصي وتغيير الصورة"
              >
                <img
                  src={loggedStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={loggedStudent.name}
                  className="w-7 h-7 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-neutral-950 dark:text-white truncate max-w-[110px]">
                    {loggedStudent.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {loggedStudent.seatNumber}
                  </span>
                </div>
              </button>

              {/* Student Logout */}
              <button
                onClick={onLogoutStudent}
                className="p-1.5 rounded text-neutral-400 hover:text-red-500 transition-colors"
                title="تسجيل خروج الطالب"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenStudentAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold text-white bg-neutral-950 dark:text-neutral-950 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>دخول طالب</span>
            </button>
          )}

          {/* Admin Dashboard Entry */}
          <button
            onClick={onOpenAdmin}
            title="لوحة تحكم المسؤول (كلمة المرور: 1234)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-md transition-colors whitespace-nowrap"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">داش أدمن</span>
          </button>

          {/* Quick Portal Jump */}
          <button
            onClick={onOpenPortal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>شؤون الطلاب</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/50 scrollbar-none text-xs">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setCurrentTab(link.id)}
            className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
              currentTab === link.id
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
