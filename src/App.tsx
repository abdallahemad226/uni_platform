import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StudentPortalSection } from './components/StudentPortalSection';
import { DepartmentsSection } from './components/DepartmentsSection';
import { SchedulesSection } from './components/SchedulesSection';
import { CourseRegistrationSection } from './components/CourseRegistrationSection';
import { StudentSpecializationSection } from './components/StudentSpecializationSection';
import { GraduationProjectsSection } from './components/GraduationProjectsSection';
import { FacultyStaffSection } from './components/FacultyStaffSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { StudentChatModal } from './components/StudentChatModal';
import { Department, FacultyStats, StudentRecord, ChatMessage } from './types';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [stats, setStats] = useState<FacultyStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Student Authentication & Chat States
  const [loggedStudent, setLoggedStudent] = useState<StudentRecord | null>(() => {
    try {
      const saved = localStorage.getItem('fci_logged_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState<boolean>(false);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState<boolean>(false);
  const [isStudentChatOpen, setIsStudentChatOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // Fetch unread messages if student is logged in
  useEffect(() => {
    if (!loggedStudent) {
      setUnreadCount(0);
      return;
    }

    const checkUnread = async () => {
      try {
        const res = await fetch(`/api/messages?seatNumber=${loggedStudent.seatNumber}`);
        if (res.ok) {
          const msgs: ChatMessage[] = await res.json();
          const unread = msgs.filter(m => m.receiverSeat === loggedStudent.seatNumber && !m.read).length;
          setUnreadCount(unread);
        }
      } catch {}
    };

    checkUnread();
    const interval = setInterval(checkUnread, 4000);
    return () => clearInterval(interval);
  }, [loggedStudent]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    fetch('/api/faculty/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});

    fetch('/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleOpenPortal = () => {
    setCurrentTab('services');
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (tab: string) => {
    if ((tab === 'departments' || tab === 'schedules' || tab === 'registration') && !loggedStudent) {
      setIsStudentAuthOpen(true);
      return;
    }
    setCurrentTab(tab);
    const el = document.getElementById(tab);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoutStudent = () => {
    localStorage.removeItem('fci_logged_student');
    setLoggedStudent(null);
    setUnreadCount(0);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 dark:bg-black dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200 selection:bg-neutral-800 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenPortal={handleOpenPortal}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        loggedStudent={loggedStudent}
        onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
        onOpenStudentProfile={() => setIsStudentProfileOpen(true)}
        onOpenStudentChat={() => setIsStudentChatOpen(true)}
        onLogoutStudent={handleLogoutStudent}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          stats={stats}
          onNavigate={handleNavigate}
          onOpenSearch={() => {
            if (loggedStudent) {
              handleOpenPortal();
            } else {
              setIsStudentAuthOpen(true);
            }
          }}
          loggedStudent={loggedStudent}
        />

        {/* Announcements & Official Circulars */}
        <AnnouncementsSection key={`ann-${refreshKey}`} />

        {/* Student Portal: Grades, Seating, Services Request, CGPA Calculator */}
        <StudentPortalSection
          key={`portal-${refreshKey}-${loggedStudent?.seatNumber || 'guest'}`}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          loggedStudent={loggedStudent}
          onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
        />

        {/* Academic Departments & Programs - Only visible after student logs in */}
        {loggedStudent && (
          <DepartmentsSection departments={departments} />
        )}

        {/* Lectures & Lab Schedules - Only visible after student logs in */}
        {loggedStudent && (
          <SchedulesSection key={`sched-${refreshKey}`} />
        )}

        {/* Academic Specialization & Branching System (التشعيب الأكاديمي طبقاً للمادة 5 باللائحة) */}
        {loggedStudent && (
          <StudentSpecializationSection
            key={`spec-${refreshKey}-${loggedStudent.seatNumber}`}
            loggedStudent={loggedStudent}
            onSpecializationUpdated={triggerRefresh}
          />
        )}

        {/* Course Registration System - Only for logged-in students */}
        {loggedStudent && (
          <CourseRegistrationSection loggedStudent={loggedStudent} />
        )}

        {/* Graduation Projects & Research Gallery */}
        <GraduationProjectsSection key={`proj-${refreshKey}`} />

        {/* Faculty Leadership & Teaching Staff Directory */}
        <FacultyStaffSection />
      </main>

      {/* Institutional Monochrome Footer */}
      <Footer />

      {/* Full Admin Dashboard Modal (Central Command Center - Password: 1234) */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onStudentUpdated={triggerRefresh}
        onAnnouncementUpdated={triggerRefresh}
        onDataUpdated={triggerRefresh}
      />

      {/* Student Authentication Modal */}
      <StudentAuthModal
        isOpen={isStudentAuthOpen}
        onClose={() => setIsStudentAuthOpen(false)}
        onLoginSuccess={(student) => {
          setLoggedStudent(student);
          triggerRefresh();
        }}
      />

      {/* Student Profile & Avatar Customizer Modal */}
      {loggedStudent && (
        <StudentProfileModal
          isOpen={isStudentProfileOpen}
          onClose={() => setIsStudentProfileOpen(false)}
          student={loggedStudent}
          onAvatarUpdated={(updated) => {
            setLoggedStudent(updated);
            triggerRefresh();
          }}
        />
      )}

      {/* Student Internal Chat & Messaging Modal */}
      {loggedStudent && (
        <StudentChatModal
          isOpen={isStudentChatOpen}
          onClose={() => setIsStudentChatOpen(false)}
          currentUser={loggedStudent}
          onUnreadCountChanged={(cnt) => setUnreadCount(cnt)}
        />
      )}
    </div>
  );
}
