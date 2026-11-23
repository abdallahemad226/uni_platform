import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  UserPlus,
  Users,
  Bell,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Plus,
  GraduationCap,
  Search,
  BookOpen,
  LogOut,
  Save,
  ShieldCheck,
  FileText,
  MessageSquare,
  FolderGit2,
  Calendar,
  Layers,
  Send,
  Printer,
  Download,
  Clock,
  Eye,
  Check,
  Building2,
  Award,
  GitFork,
  Sparkles,
  ArrowUpDown,
  CheckCheck
} from 'lucide-react';
import {
  StudentRecord,
  CourseGrade,
  Announcement,
  StudentServiceRequest,
  FacultyInquiry,
  ProjectRecord,
  ScheduleDay
} from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentUpdated?: () => void;
  onAnnouncementUpdated?: () => void;
  onDataUpdated?: () => void;
}

type AdminTab = 'overview' | 'students' | 'specialization' | 'registration' | 'requests' | 'inquiries' | 'announcements' | 'projects' | 'schedules';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onStudentUpdated,
  onAnnouncementUpdated,
  onDataUpdated
}) => {
  // Auth state (Password: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active admin tab
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Flash message
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  // Overview stats
  const [overviewStats, setOverviewStats] = useState({
    totalStudents: 0,
    totalAnnouncements: 0,
    totalProjects: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalInquiries: 0,
    unansweredInquiries: 0
  });

  // --- Students Management States ---
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [studentLevelFilter, setStudentLevelFilter] = useState<string>('الكل');
  const [isStudentFormOpen, setIsStudentFormOpen] = useState<boolean>(false);
  const [editingSeatNumber, setEditingSeatNumber] = useState<string | null>(null);

  // Student Form Fields
  const [stuName, setStuName] = useState('');
  const [stuSeatNumber, setStuSeatNumber] = useState('');
  const [stuNationalId, setStuNationalId] = useState('');
  const [stuLevel, setStuLevel] = useState('الفرقة الثالثة');
  const [stuDepartment, setStuDepartment] = useState('علوم الحاسب (CS)');
  const [stuAdvisor, setStuAdvisor] = useState('أ.د. عصام الدين فؤاد');
  const [stuCgpa, setStuCgpa] = useState('3.85');
  const [stuTotalCredits, setStuTotalCredits] = useState('96');
  const [stuStatus, setStuStatus] = useState('مقيد - منتظم (ممتاز مع مرتبة الشرف)');
  const [stuExamHall, setStuExamHall] = useState('مدرج 2 - الدور الثالث');
  const [stuSeatLocation, setStuSeatLocation] = useState('الصف B - مقعد 14');
  const [coursesList, setCoursesList] = useState<CourseGrade[]>([
    { code: 'CS411', name: 'التعلم العميق والرؤية الحاسوبية', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
    { code: 'CS412', name: 'الحوسبة الموزعة والسحابية', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
    { code: 'IT415', name: 'أمن الشبكات والتشفير المتقدم', credits: 3, grade: 'A-', points: 3.5, score: 87, status: 'ناجح' }
  ]);

  // --- Announcements Management States ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('شؤون التعليم والطلاب');
  const [annDate, setAnnDate] = useState('12 نوفمبر 2026');
  const [annSummary, setAnnSummary] = useState('');
  const [annImportant, setAnnImportant] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  // --- Requests Management States ---
  const [requests, setRequests] = useState<StudentServiceRequest[]>([]);
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('الكل');

  // --- Inquiries Management States ---
  const [inquiries, setInquiries] = useState<FacultyInquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [activeReplyingInquiry, setActiveReplyingInquiry] = useState<FacultyInquiry | null>(null);
  const [replyResponderName, setReplyResponderName] = useState('أ.د. عصام الدين فؤاد محمد');
  const [replyResponderRole, setReplyResponderRole] = useState('عميد الكلية');
  const [replyResponseText, setReplyResponseText] = useState('');

  // --- Projects Management States ---
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projTitleEn, setProjTitleEn] = useState('');
  const [projDepartment, setProjDepartment] = useState('علوم الحاسب والذكاء الاصطناعي');
  const [projYear, setProjYear] = useState('2025/2026');
  const [projSupervisor, setProjSupervisor] = useState('أ.د. عصام الدين فؤاد & د. خالد الدندراوي');
  const [projTeamMembers, setProjTeamMembers] = useState('أحمد محمود، مصطفى كمال، آية محمود');
  const [projDescription, setProjDescription] = useState('');
  const [projTech, setProjTech] = useState('PyTorch, FastAPI, React');
  const [projAwards, setProjAwards] = useState('');
  const [projStatus, setProjStatus] = useState<'مكتمل' | 'قيد التنفيذ'>('مكتمل');

  // --- Schedules Management States ---
  const [schedules, setSchedules] = useState<ScheduleDay[]>([]);
  const [schedLevel, setSchedLevel] = useState('الفرقة الأولى');
  const [schedDay, setSchedDay] = useState('الأحد');
  const [isSchedFormOpen, setIsSchedFormOpen] = useState(false);
  const [schedTime, setSchedTime] = useState('08:30 - 10:15');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedType, setSchedType] = useState('محاضرة');
  const [schedInstructor, setSchedInstructor] = useState('د. أحمد رشوان');
  const [schedHall, setSchedHall] = useState('مدرج 1 الرئيسي');

  // --- Course Registration System States ---
  const [regStatus, setRegStatus] = useState<Record<string, boolean>>({
    'الفرقة الأولى': false,
    'الفرقة الثانية': false,
    'الفرقة الثالثة': false,
    'الفرقة الرابعة': false
  });
  const [courseSlots, setCourseSlots] = useState<any[]>([]);
  const [curriculumCourses, setCurriculumCourses] = useState<any[]>([]);
  const [activeSlotDeptModal, setActiveSlotDeptModal] = useState<string | null>(null);
  const [regLevelFilter, setRegLevelFilter] = useState('الفرقة الأولى');
  const [isSlotFormOpen, setIsSlotFormOpen] = useState(false);
  const [slotCourseCode, setSlotCourseCode] = useState('CS101');
  const [slotCourseName, setSlotCourseName] = useState('');
  const [slotType, setSlotType] = useState<'محاضرة' | 'سكشن عملي'>('محاضرة');
  const [slotInstructor, setSlotInstructor] = useState('د. أحمد رشوان');
  const [slotHall, setSlotHall] = useState('مدرج 1 الرئيسي');
  const [slotCapacity, setSlotCapacity] = useState('30');
  const [slotDay, setSlotDay] = useState('الأحد');
  const [slotTime, setSlotTime] = useState('08:30 - 10:15');
  const [slotLevel, setSlotLevel] = useState<string>('الفرقة الأولى');
  const [slotSemester, setSlotSemester] = useState('الفصل الدراسي الأول 2026/2027');
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotDepartment, setSlotDepartment] = useState<string>('المرحلة العامة');
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);

  // --- Academic Specialization (التشعيب الأكاديمي) States ---
  const [specializationApplicants, setSpecializationApplicants] = useState<any[]>([]);
  const [specializationOpen, setSpecializationOpen] = useState<boolean>(true);
  const [specializationCapacities, setSpecializationCapacities] = useState<{ CS: number; IT: number; IS: number; AI: number }>({ CS: 40, IT: 40, IS: 40, AI: 40 });
  const [specializationRunning, setSpecializationRunning] = useState<boolean>(false);
  const [specializationFilter, setSpecializationFilter] = useState<'all' | 'CS' | 'IT' | 'IS' | 'AI'>('all');

  // --- Student Override States ---
  const [overrideSearch, setOverrideSearch] = useState('');
  const [overrideStudentData, setOverrideStudentData] = useState<any>(null);
  const [overrideSemPart, setOverrideSemPart] = useState<1 | 2>(1);
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [overrideReason, setOverrideReason] = useState<Record<string, string>>({});
  const [overrideActioning, setOverrideActioning] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('fci_admin_token') === 'fci-qena-admin-session-active') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const showFlash = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 3500);
  };

  const fetchAllData = async () => {
    fetchStats();
    fetchStudents();
    fetchAnnouncements();
    fetchRequests();
    fetchInquiries();
    fetchProjects();
    fetchSchedules();
    fetchRegistrationData();
    fetchSpecializationData();
  };

  const fetchSpecializationData = async () => {
    try {
      const res = await fetch('/api/admin/specialization/applicants');
      if (res.ok) {
        const data = await res.json();
        setSpecializationApplicants(data.applicants || []);
        if (data.status) {
          setSpecializationOpen(data.status.isOpen);
          if (data.status.capacities) {
            setSpecializationCapacities(data.status.capacities);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch specialization applicants:', e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats/overview');
      if (res.ok) {
        const data = await res.json();
        setOverviewStats(data);
      }
    } catch {
      // quiet
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students');
      if (res.ok) setStudents(await res.json());
    } catch {}
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) setAnnouncements(await res.json());
    } catch {}
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests');
      if (res.ok) setRequests(await res.json());
    } catch {}
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) setInquiries(await res.json());
    } catch {}
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
    } catch {}
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules');
      if (res.ok) setSchedules(await res.json());
    } catch {}
  };

  const fetchRegistrationData = async () => {
    try {
      const [statusRes, slotsRes, regsRes, currRes] = await Promise.all([
        fetch('/api/registration/status'),
        fetch('/api/admin/course-slots'),
        fetch('/api/admin/registrations'),
        fetch('/api/curriculum')
      ]);
      if (currRes && currRes.ok) {
        const currData = await currRes.json();
        setCurriculumCourses(Array.isArray(currData) ? currData : []);
      }
      if (statusRes.ok) setRegStatus(await statusRes.json());
      if (slotsRes.ok) setCourseSlots(await slotsRes.json());
      if (regsRes.ok) setAllRegistrations(await regsRes.json());
    } catch {}
  };

  const fetchOverrideStudent = async (seat: string, sem: number) => {
    if (!seat.trim()) return;
    setOverrideLoading(true);
    try {
      const res = await fetch(`/api/admin/student-eligibility/${encodeURIComponent(seat.trim())}?semester=${sem}`);
      if (res.ok) {
        const data = await res.json();
        setOverrideStudentData(data);
      } else {
        const err = await res.json();
        alert(err.error || 'لم يتم العثور على الطالب');
        setOverrideStudentData(null);
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setOverrideLoading(false);
    }
  };

  const handleStudentOverride = async (studentSeat: string, courseCode: string, action: 'lock' | 'unlock' | 'remove', reason?: string) => {
    setOverrideActioning(courseCode);
    try {
      const res = await fetch('/api/admin/student-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentSeat, courseCode, action, reason })
      });
      const data = await res.json();
      if (res.ok) {
        showFlash(data.message);
        // Re-fetch student eligibility to update the table
        await fetchOverrideStudent(studentSeat, overrideSemPart);
      } else {
        alert(data.error || 'فشل الإجراء');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setOverrideActioning(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('fci_admin_token', data.token);
        setPasswordInput('');
        showFlash('تم تسجيل الدخول إلى لوحة إدارة الكلية بنجاح');
      } else {
        setAuthError(data.error || 'كلمة المرور غير صحيحة');
      }
    } catch {
      setAuthError('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fci_admin_token');
    setPasswordInput('');
  };

  // --- Student Actions ---
  const handleAddCourseRow = () => {
    setCoursesList([
      ...coursesList,
      { code: 'CS102', name: 'مقرر دراسي جديد', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' }
    ]);
  };

  const handleRemoveCourseRow = (idx: number) => {
    setCoursesList(coursesList.filter((_, i) => i !== idx));
  };

  const handleCourseFieldChange = (idx: number, field: keyof CourseGrade, val: any) => {
    const copy = [...coursesList];
    copy[idx] = { ...copy[idx], [field]: val };
    setCoursesList(copy);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuName || !stuSeatNumber) {
      alert('يرجى إدخال اسم الطالب ورقم الجلوس');
      return;
    }

    const payload = {
      name: stuName,
      seatNumber: stuSeatNumber,
      nationalId: stuNationalId,
      level: stuLevel,
      department: stuDepartment,
      academicAdvisor: stuAdvisor,
      cgpa: parseFloat(stuCgpa) || 3.0,
      totalCredits: parseInt(stuTotalCredits, 10) || 30,
      status: stuStatus,
      examHall: stuExamHall,
      seatLocation: stuSeatLocation,
      courses: coursesList
    };

    try {
      if (editingSeatNumber) {
        const res = await fetch(`/api/admin/students/${encodeURIComponent(editingSeatNumber)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          showFlash(data.message || 'تم تحديث بيانات الطالب بنجاح');
          setEditingSeatNumber(null);
          setIsStudentFormOpen(false);
        } else {
          alert(data.error || 'فشل التحديث');
        }
      } else {
        const res = await fetch('/api/admin/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          showFlash(data.message || 'تمت إضافة الطالب بنجاح');
          setIsStudentFormOpen(false);
          setStuName('');
          setStuSeatNumber('');
          setStuNationalId('');
        } else {
          alert(data.error || 'فشلت إضافة الطالب');
        }
      }

      fetchStudents();
      fetchStats();
      if (onStudentUpdated) onStudentUpdated();
      if (onDataUpdated) onDataUpdated();
    } catch {
      alert('تعذر حفظ بيانات الطالب');
    }
  };

  const handleEditStudent = (student: StudentRecord) => {
    setEditingSeatNumber(student.seatNumber);
    setStuName(student.name);
    setStuSeatNumber(student.seatNumber);
    setStuNationalId(student.nationalId);
    setStuLevel(student.level);
    setStuDepartment(student.department);
    setStuAdvisor(student.academicAdvisor);
    setStuCgpa(student.cgpa.toString());
    setStuTotalCredits(student.totalCredits.toString());
    setStuStatus(student.status);
    setStuExamHall(student.examHall);
    setStuSeatLocation(student.seatLocation);
    setCoursesList(student.courses && student.courses.length > 0 ? student.courses : []);
    setIsStudentFormOpen(true);
  };

  const handleDeleteStudent = async (seatNumber: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الطالب ${name} (رقم جلوس: ${seatNumber})؟`)) return;

    try {
      const res = await fetch(`/api/admin/students/${encodeURIComponent(seatNumber)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showFlash(data.message || 'تم حذف الطالب بنجاح');
        fetchStudents();
        fetchStats();
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'فشل الحذف');
      }
    } catch {
      alert('تعذر الاتصال بالخادم');
    }
  };

  const exportStudentsCSV = () => {
    if (students.length === 0) return;
    const headers = ['رقم الجلوس', 'الاسم', 'الرقم القومي', 'الفرقة', 'القسم', 'المعدل التراكمي', 'الحالة'];
    const rows = students.map(s => [
      s.seatNumber,
      `"${s.name}"`,
      `"${s.nationalId}"`,
      `"${s.level}"`,
      `"${s.department}"`,
      s.cgpa.toFixed(2),
      `"${s.status}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `طلاب_حاسبات_قنا_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Announcements Actions ---
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annSummary) return;

    try {
      if (editingAnnId) {
        const res = await fetch(`/api/announcements/${editingAnnId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: annTitle,
            category: annCategory,
            date: annDate,
            summary: annSummary,
            important: annImportant
          })
        });
        if (res.ok) {
          showFlash('تم تحديث الخبر بنجاح');
          setEditingAnnId(null);
        }
      } else {
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: annTitle,
            category: annCategory,
            date: annDate,
            summary: annSummary,
            important: annImportant
          })
        });
        if (res.ok) {
          showFlash('تم نشر الخبر بنجاح');
        }
      }

      setAnnTitle('');
      setAnnSummary('');
      setAnnImportant(false);
      fetchAnnouncements();
      fetchStats();
      if (onAnnouncementUpdated) onAnnouncementUpdated();
    } catch {
      alert('حدث خطأ أثناء حفظ الإعلان');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFlash('تم حذف الخبر بنجاح');
        fetchAnnouncements();
        fetchStats();
        if (onAnnouncementUpdated) onAnnouncementUpdated();
      }
    } catch {}
  };

  // --- Requests Actions ---
  const handleUpdateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showFlash(`تم تغيير حالة الطلب إلى "${newStatus}" بنجاح`);
        fetchRequests();
        fetchStats();
        if (onDataUpdated) onDataUpdated();
      }
    } catch {
      alert('تعذر تحديث حالة الطلب');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await fetch(`/api/admin/requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFlash('تم حذف طلب الوثيقة بنجاح');
        fetchRequests();
        fetchStats();
      }
    } catch {}
  };

  // --- Inquiries Actions ---
  const handleOpenReplyModal = (inq: FacultyInquiry) => {
    setActiveReplyingInquiry(inq);
    setReplyResponseText(inq.officialResponse?.responseText || '');
    if (inq.officialResponse?.responderName) setReplyResponderName(inq.officialResponse.responderName);
    if (inq.officialResponse?.responderRole) setReplyResponderRole(inq.officialResponse.responderRole);
  };

  const handleSubmitOfficialReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReplyingInquiry || !replyResponseText.trim()) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${activeReplyingInquiry.id}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responderName: replyResponderName,
          responderRole: replyResponderRole,
          responseText: replyResponseText
        })
      });
      if (res.ok) {
        showFlash('تم اعتماد الرد الرسمي بنجاح وإرساله لسجل متابعة الطالب');
        setActiveReplyingInquiry(null);
        setReplyResponseText('');
        fetchInquiries();
        fetchStats();
        if (onDataUpdated) onDataUpdated();
      }
    } catch {
      alert('تعذر إرسال الرد الرسمي');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFlash('تم حذف الرسالة بنجاح');
        fetchInquiries();
        fetchStats();
      }
    } catch {}
  };

  // --- Projects Actions ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDepartment || !projSupervisor) return;

    const payload = {
      title: projTitle,
      titleEn: projTitleEn,
      department: projDepartment,
      year: projYear,
      supervisor: projSupervisor,
      teamMembers: projTeamMembers.split('،').map(s => s.trim()).filter(Boolean),
      description: projDescription,
      technologies: projTech.split(',').map(s => s.trim()).filter(Boolean),
      awards: projAwards,
      status: projStatus
    };

    try {
      if (editingProjectId) {
        const res = await fetch(`/api/admin/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showFlash('تم تحديث مشروع التخرج بنجاح');
          setEditingProjectId(null);
          setIsProjectFormOpen(false);
        }
      } else {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showFlash('تمت إضافة مشروع التخرج بنجاح للملتقى الأكاديمي');
          setIsProjectFormOpen(false);
          setProjTitle('');
          setProjTitleEn('');
          setProjDescription('');
        }
      }

      fetchProjects();
      fetchStats();
      if (onDataUpdated) onDataUpdated();
    } catch {
      alert('تعذر حفظ مشروع التخرج');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFlash('تم حذف مشروع التخرج بنجاح');
        fetchProjects();
        fetchStats();
        if (onDataUpdated) onDataUpdated();
      }
    } catch {}
  };

  // --- Schedules Actions ---
  const handleAddScheduleItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle || !schedTime) return;

    try {
      const res = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: schedLevel,
          day: schedDay,
          time: schedTime,
          title: schedTitle,
          type: schedType,
          instructor: schedInstructor,
          hall: schedHall
        })
      });
      if (res.ok) {
        showFlash('تمت إضافة المحاضرة/السكشن إلى الجدول الدراسي بنجاح');
        setIsSchedFormOpen(false);
        setSchedTitle('');
        fetchSchedules();
        if (onDataUpdated) onDataUpdated();
      }
    } catch {
      alert('تعذر حفظ المحاضرة');
    }
  };

  const handleDeleteScheduleItem = async (level: string, day: string, itemIdx: number) => {
    if (!window.confirm('هل تريد حذف هذه المحاضرة من الجدول؟')) return;
    try {
      const res = await fetch(`/api/admin/schedules?level=${encodeURIComponent(level)}&day=${encodeURIComponent(day)}&itemIndex=${itemIdx}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showFlash('تم حذف المحاضرة من الجدول بنجاح');
        fetchSchedules();
        if (onDataUpdated) onDataUpdated();
      }
    } catch {}
  };

  if (!isOpen) return null;

  // Filtered lists
  const filteredStudents = students.filter(s => {
    const matchLevel = studentLevelFilter === 'الكل' || s.level.includes(studentLevelFilter);
    if (!matchLevel) return false;
    if (!studentSearch) return true;
    const q = studentSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.seatNumber.includes(q) || s.nationalId.includes(q);
  });

  const filteredRequests = requests.filter(r => {
    if (requestStatusFilter === 'الكل') return true;
    return r.status === requestStatusFilter;
  });

  const filteredInquiries = inquiries.filter(i => {
    if (inquiryFilter === 'unanswered') return i.status !== 'تم الرد والاعتماد';
    if (inquiryFilter === 'answered') return i.status === 'تم الرد والاعتماد';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl text-neutral-900 dark:text-neutral-100 flex flex-col max-h-[94vh] overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold leading-tight">
                  لوحة الإدارة المركزية والتحكم الأكاديمي الشامل
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                  FCI-QENA 2026/2027
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                كلية الحاسبات والمعلومات والذكاء الاصطناعي · جامعة جنوب الوادي بقنا
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                title="تسجيل خروج"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flash Message */}
        {flashMessage && (
          <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 text-xs font-semibold flex items-center gap-2 text-neutral-950 dark:text-white shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{flashMessage}</span>
          </div>
        )}

        {/* If Not Authenticated: Password Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center space-y-6 my-auto">
            <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center">
              <Lock className="w-7 h-7 text-neutral-900 dark:text-white" />
            </div>

            <div className="text-center space-y-2 max-w-sm">
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                تسجيل الدخول للوحة تحكم إدارة الكلية
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                الوصول محمي بكلمة مرور مسؤولي الكلية وعمادة الحاسبات وشؤون الطلاب.
              </p>
              <div className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900 py-1.5 px-3 rounded border border-neutral-300 dark:border-neutral-800 inline-block">
                كلمة المرور: 1234
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <input
                type="password"
                autoFocus
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="ادخل 1234"
                className="w-full px-4 py-2 text-center text-lg font-mono tracking-widest bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-950 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-neutral-950 dark:text-neutral-950 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded transition-colors"
              >
                دخول لوحة التحكم
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs Bar */}
            <div className="px-3 sm:px-6 pt-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1 sm:gap-2 bg-neutral-50/70 dark:bg-neutral-900/40 shrink-0 overflow-x-auto text-xs font-bold">
              {[
                { id: 'overview', label: 'لوحة القيادة والمؤشرات', icon: Layers },
                { id: 'students', label: `الطلاب والنتائج (${students.length})`, icon: Users },
                { id: 'specialization', label: `التشعيب وتوزيع الأقسام (${specializationApplicants.length})`, icon: GitFork },
                { id: 'registration', label: 'التسجيل الدراسي بالأقسام', icon: BookOpen },
                { id: 'requests', label: `طلبات الوثائق (${requests.length})`, icon: FileText, badge: requests.filter(r => r.status === 'قيد المراجعة').length },
                { id: 'inquiries', label: `استفسارات وشكاوى (${inquiries.length})`, icon: MessageSquare, badge: inquiries.filter(i => i.status !== 'تم الرد والاعتماد').length },
                { id: 'announcements', label: `الأخبار والتعاميم (${announcements.length})`, icon: Bell },
                { id: 'projects', label: `مشاريع التخرج (${projects.length})`, icon: FolderGit2 },
                { id: 'schedules', label: 'الجداول الدراسية', icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as AdminTab)}
                    className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white bg-white dark:bg-neutral-950 rounded-t-md'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 ? (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-mono">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-neutral-950">
              
              {/* TAB 1: OVERVIEW */}
              {adminTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div
                      onClick={() => setAdminTab('students')}
                      className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-neutral-500 text-xs">
                        <span>إجمالي الطلاب بالسجلات</span>
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-neutral-950 dark:text-white mt-2">
                        {students.length}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">4 أقسام تخصصية</div>
                    </div>

                    <div
                      onClick={() => setAdminTab('requests')}
                      className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-neutral-500 text-xs">
                        <span>طلبات الوثائق الإلكترونية</span>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-neutral-950 dark:text-white mt-2 flex items-center gap-2">
                        <span>{requests.length}</span>
                        {overviewStats.pendingRequests > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-sans">
                            {overviewStats.pendingRequests} قيد المراجعة
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">شؤون الطلاب والامتحانات</div>
                    </div>

                    <div
                      onClick={() => setAdminTab('inquiries')}
                      className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-neutral-500 text-xs">
                        <span>استفسارات ومقترحات واردة</span>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-neutral-950 dark:text-white mt-2 flex items-center gap-2">
                        <span>{inquiries.length}</span>
                        {overviewStats.unansweredInquiries > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-sans">
                            {overviewStats.unansweredInquiries} تحتاج رداً
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">قناة تواصل العمادة</div>
                    </div>

                    <div
                      onClick={() => setAdminTab('projects')}
                      className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-neutral-500 text-xs">
                        <span>مشاريع التخرج والابتكارات</span>
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-neutral-950 dark:text-white mt-2">
                        {projects.length}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">معرض بحوث التخرج</div>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 space-y-3">
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                      إجراءات سريعة ومباشرة
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          setAdminTab('students');
                          setIsStudentFormOpen(true);
                          setEditingSeatNumber(null);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-850 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>إضافة طالب ودرجات جديدة</span>
                      </button>

                      <button
                        onClick={() => {
                          setAdminTab('announcements');
                          setEditingAnnId(null);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>نشر تعميم أو إعلان رسمي</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('requests')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>مراجعة طلبات شؤون الطلاب ({overviewStats.pendingRequests})</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('inquiries')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>الرد على استفسارات الطلاب ({overviewStats.unansweredInquiries})</span>
                      </button>

                      <button
                        onClick={exportStudentsCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تصدير سجل الطلاب CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Two Column Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Requests Box */}
                    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs font-bold text-neutral-950 dark:text-white">
                          أحدث طلبات الوثائق الإلكترونية:
                        </span>
                        <button
                          onClick={() => setAdminTab('requests')}
                          className="text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                        >
                          عرض الكل
                        </button>
                      </div>
                      <div className="space-y-2">
                        {requests.slice(0, 3).map((r) => (
                          <div key={r.id} className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-neutral-950 dark:text-white">{r.studentName}</div>
                              <div className="text-[10px] text-neutral-500 font-mono">{r.requestType} · {r.referenceNumber}</div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 dark:bg-neutral-800">
                              {r.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Unanswered Inquiries Box */}
                    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs font-bold text-neutral-950 dark:text-white">
                          رسائل ومقترحات تنتظر الرد:
                        </span>
                        <button
                          onClick={() => setAdminTab('inquiries')}
                          className="text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                        >
                          عرض الكل
                        </button>
                      </div>
                      <div className="space-y-2">
                        {inquiries.slice(0, 3).map((inq) => (
                          <div key={inq.id} className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex items-center justify-between">
                            <div className="max-w-[70%]">
                              <div className="font-semibold text-neutral-950 dark:text-white truncate">{inq.subject}</div>
                              <div className="text-[10px] text-neutral-500 font-mono">{inq.studentName} · {inq.recipientDepartment}</div>
                            </div>
                            <button
                              onClick={() => {
                                setAdminTab('inquiries');
                                handleOpenReplyModal(inq);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                            >
                              رد رسمي
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STUDENTS & RESULTS */}
              {adminTab === 'students' && (
                <div className="space-y-5">
                  {/* Search, Filter & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-1 items-center gap-2 max-w-lg">
                      <div className="relative flex-1">
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          placeholder="ابحث بالاسم أو رقم الجلوس أو الرقم القومي..."
                          className="w-full pr-9 pl-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none"
                        />
                      </div>
                      <select
                        value={studentLevelFilter}
                        onChange={(e) => setStudentLevelFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white"
                      >
                        <option value="الكل">كل الفرق</option>
                        <option value="الفرقة الأولى">الفرقة الأولى</option>
                        <option value="الفرقة الثانية">الفرقة الثانية</option>
                        <option value="الفرقة الثالثة">الفرقة الثالثة</option>
                        <option value="الفرقة الرابعة">الفرقة الرابعة</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={exportStudentsCSV}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                        title="تصدير كملف إكسيل CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تصدير CSV</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingSeatNumber(null);
                          setStuName('');
                          setStuSeatNumber('');
                          setStuNationalId('');
                          setCoursesList([
                            { code: 'CS101', name: 'أساسيات الحوسبة والبرمجة', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
                            { code: 'MATH101', name: 'الرياضيات المتقدمة', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' }
                          ]);
                          setIsStudentFormOpen(!isStudentFormOpen);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 transition-colors shadow-sm shrink-0"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isStudentFormOpen ? 'إغلاق النموذج' : 'إضافة طالب جديد'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Student Drawer Form */}
                  {isStudentFormOpen && (
                    <div className="p-5 rounded-lg border border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900/60 shadow-lg space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-neutral-950 dark:text-white" />
                          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                            {editingSeatNumber ? `تعديل سجل الطالب: ${stuName}` : 'إضافة طالب جديد بكامل البيانات والدرجات الأكاديمية'}
                          </h3>
                        </div>
                        <button onClick={() => setIsStudentFormOpen(false)} className="p-1 rounded text-neutral-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveStudent} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">اسم الطالب رباعي *</label>
                            <input
                              type="text"
                              required
                              value={stuName}
                              onChange={(e) => setStuName(e.target.value)}
                              placeholder="مثال: محمد حسام الدين علي"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">رقم الجلوس (فريد) *</label>
                            <input
                              type="text"
                              required
                              disabled={Boolean(editingSeatNumber)}
                              value={stuSeatNumber}
                              onChange={(e) => setStuSeatNumber(e.target.value)}
                              placeholder="مثال: 5020"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">الرقم القومي (14 رقم)</label>
                            <input
                              type="text"
                              value={stuNationalId}
                              onChange={(e) => setStuNationalId(e.target.value)}
                              placeholder="30301012701122"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">الفرقة الدراسية</label>
                            <select
                              value={stuLevel}
                              onChange={(e) => setStuLevel(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            >
                              <option>الفرقة الأولى</option>
                              <option>الفرقة الثانية</option>
                              <option>الفرقة الثالثة</option>
                              <option>الفرقة الرابعة</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">القسم الأكاديمي</label>
                            <select
                              value={stuDepartment}
                              onChange={(e) => setStuDepartment(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            >
                              <option>المرحلة العامة (General)</option>
                              <option>علوم الحاسب (CS)</option>
                              <option>نظم المعلومات (IS)</option>
                              <option>تكنولوجيا المعلومات (IT)</option>
                              <option>الذكاء الاصطناعي (AI)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">المرشد الأكاديمي</label>
                            <input
                              type="text"
                              value={stuAdvisor}
                              onChange={(e) => setStuAdvisor(e.target.value)}
                              placeholder="أ.د. عصام الدين فؤاد"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">المعدل CGPA (من 4.00)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="4"
                              value={stuCgpa}
                              onChange={(e) => setStuCgpa(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">الساعات المعتمدة المجتازة</label>
                            <input
                              type="number"
                              min="0"
                              max="160"
                              value={stuTotalCredits}
                              onChange={(e) => setStuTotalCredits(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">الحالة الأكاديمية والتقدير</label>
                            <input
                              type="text"
                              value={stuStatus}
                              onChange={(e) => setStuStatus(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">لجنة وقاعة الامتحان</label>
                            <input
                              type="text"
                              value={stuExamHall}
                              onChange={(e) => setStuExamHall(e.target.value)}
                              placeholder="مدرج 2 - الدور الثالث"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">مكان المقعد في اللجنة</label>
                            <input
                              type="text"
                              value={stuSeatLocation}
                              onChange={(e) => setStuSeatLocation(e.target.value)}
                              placeholder="الصف B - مقعد 14"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                        </div>

                        {/* Courses List */}
                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-950 dark:text-white">
                              سجل مقررات ودرجات النتيجة الأكاديمية:
                            </span>
                            <button
                              type="button"
                              onClick={handleAddCourseRow}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>إضافة مادة</span>
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {coursesList.map((course, idx) => (
                              <div key={idx} className="p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded grid grid-cols-12 gap-2 items-center text-xs">
                                <input
                                  type="text"
                                  placeholder="كود المقرر"
                                  value={course.code}
                                  onChange={(e) => handleCourseFieldChange(idx, 'code', e.target.value)}
                                  className="col-span-2 px-2 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded font-mono"
                                />
                                <input
                                  type="text"
                                  placeholder="اسم المقرر"
                                  value={course.name}
                                  onChange={(e) => handleCourseFieldChange(idx, 'name', e.target.value)}
                                  className="col-span-4 px-2 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded"
                                />
                                <input
                                  type="number"
                                  placeholder="ساعات"
                                  value={course.credits}
                                  onChange={(e) => handleCourseFieldChange(idx, 'credits', parseInt(e.target.value, 10))}
                                  className="col-span-1 px-1 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded font-mono text-center"
                                />
                                <input
                                  type="text"
                                  placeholder="A+"
                                  value={course.grade}
                                  onChange={(e) => handleCourseFieldChange(idx, 'grade', e.target.value)}
                                  className="col-span-1 px-1 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded font-mono text-center font-bold"
                                />
                                <input
                                  type="number"
                                  placeholder="درجة %"
                                  value={course.score}
                                  onChange={(e) => handleCourseFieldChange(idx, 'score', parseInt(e.target.value, 10))}
                                  className="col-span-1 px-1 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded font-mono text-center"
                                />
                                <select
                                  value={course.status}
                                  onChange={(e) => handleCourseFieldChange(idx, 'status', e.target.value)}
                                  className="col-span-2 px-1 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded"
                                >
                                  <option value="ناجح">ناجح</option>
                                  <option value="راسب">راسب</option>
                                  <option value="مستمر">مستمر</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCourseRow(idx)}
                                  className="col-span-1 p-1 text-neutral-400 hover:text-red-500 rounded flex justify-center"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setIsStudentFormOpen(false)}
                            className="px-4 py-1.5 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 px-5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingSeatNumber ? 'تحديث بيانات الطالب' : 'حفظ الطالب بالسجلات'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Students Table */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                            <th className="py-3 px-4">رقم الجلوس</th>
                            <th className="py-3 px-4">اسم الطالب</th>
                            <th className="py-3 px-4">الفرقة</th>
                            <th className="py-3 px-4">القسم</th>
                            <th className="py-3 px-4 text-center">المعدل CGPA</th>
                            <th className="py-3 px-4 text-center">المقررات</th>
                            <th className="py-3 px-4 text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850">
                          {filteredStudents.map((st) => (
                            <tr key={st.seatNumber} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                              <td className="py-3 px-4 font-mono font-bold text-neutral-950 dark:text-white">
                                {st.seatNumber}
                              </td>
                              <td className="py-3 px-4 font-medium">
                                <div>{st.name}</div>
                                <div className="text-[10px] text-neutral-500 font-mono">الرقم القومي: {st.nationalId}</div>
                              </td>
                              <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">{st.level}</td>
                              <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">{st.department}</td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-neutral-950 dark:text-white">
                                {st.cgpa.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-neutral-500">
                                {st.courses ? st.courses.length : 0} مواد
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleEditStudent(st)}
                                    className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    title="تعديل السجل"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(st.seatNumber, st.name)}
                                    className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-red-500"
                                    title="حذف الطالب"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredStudents.length === 0 && (
                      <div className="p-8 text-center text-xs text-neutral-500">
                        لم يتم العثور على طالب مطابق. يمكنك إضافة طالب جديد من الزر أعلاه.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: REQUESTS MANAGEMENT */}
              {adminTab === 'requests' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                        إدارة وتدقيق طلبات الوثائق الإلكترونية لشؤون الطلاب
                      </h3>
                      <p className="text-xs text-neutral-500">
                        مراجعة طلبات استخراج بيان الدرجات وإفادات القيد وتعديل حالتها للطلبة
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-md">
                      {['الكل', 'قيد المراجعة', 'تم التدقيق', 'جاهز للاستلام', 'مرفوض'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setRequestStatusFilter(st)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded ${
                            requestStatusFilter === st
                              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                              : 'text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-950 dark:text-white">{req.referenceNumber}</span>
                            <span className="text-neutral-400">·</span>
                            <span>{req.requestType}</span>
                            <span className="text-neutral-400">·</span>
                            <span className="text-neutral-500 font-mono">تاريخ: {req.submittedAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500 text-[11px]">تغيير الحالة:</span>
                            <select
                              value={req.status}
                              onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value)}
                              className="px-2 py-1 text-xs font-bold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded"
                            >
                              <option value="قيد المراجعة">قيد المراجعة</option>
                              <option value="تم التدقيق">تم التدقيق</option>
                              <option value="جاهز للاستلام">جاهز للاستلام بالمبنى الإداري</option>
                              <option value="مرفوض">مرفوض</option>
                            </select>

                            <button
                              onClick={() => handleDeleteRequest(req.id)}
                              className="p-1 rounded text-neutral-400 hover:text-red-500"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 text-xs grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <div>
                            <span className="text-neutral-500 block">اسم الطالب:</span>
                            <strong className="text-neutral-950 dark:text-white">{req.studentName}</strong>
                          </div>
                          <div>
                            <span className="text-neutral-500 block">رقم الجلوس:</span>
                            <span className="font-mono">{req.seatNumber}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block">الفرقة والقسم:</span>
                            <span>{req.level} · {req.department}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block">ملاحظات الطالب:</span>
                            <span className="text-neutral-700 dark:text-neutral-300">{req.details || 'لا توجد'}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredRequests.length === 0 && (
                      <div className="p-10 text-center text-xs text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-800 rounded">
                        لا توجد طلبات تطابق الفلتر المحدد.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: INQUIRIES & OFFICIAL REPLIES */}
              {adminTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                        استفسارات ومقترحات وشكاوى الطلاب (الرد الإداري الرسمي)
                      </h3>
                      <p className="text-xs text-neutral-500">
                        اعتماد الردود الرسمية لعمادة الكلية ووكلاء شؤون الطلاب لظهورها مباشرة للطلبة بكود المتابعة
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-md">
                      <button
                        onClick={() => setInquiryFilter('all')}
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          inquiryFilter === 'all' ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-500'
                        }`}
                      >
                        الكل ({inquiries.length})
                      </button>
                      <button
                        onClick={() => setInquiryFilter('unanswered')}
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          inquiryFilter === 'unanswered' ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-500'
                        }`}
                      >
                        تحتاج رداً ({inquiries.filter(i => i.status !== 'تم الرد والاعتماد').length})
                      </button>
                      <button
                        onClick={() => setInquiryFilter('answered')}
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          inquiryFilter === 'answered' ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-500'
                        }`}
                      >
                        تم الرد والاعتماد
                      </button>
                    </div>
                  </div>

                  {/* Active Reply Drawer / Box */}
                  {activeReplyingInquiry && (
                    <div className="p-5 rounded-lg border border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-md space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-neutral-950 dark:text-white" />
                          <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                            كتابة واعتماد الرد الرسمي على الرسالة: ({activeReplyingInquiry.subject})
                          </h4>
                        </div>
                        <button onClick={() => setActiveReplyingInquiry(null)} className="p-1 rounded text-neutral-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                        <div className="text-neutral-500 font-mono">المرسل: {activeReplyingInquiry.studentName} ({activeReplyingInquiry.email}) · كود المتابعة: {activeReplyingInquiry.trackingCode}</div>
                        <p className="text-neutral-800 dark:text-neutral-200 font-medium">"{activeReplyingInquiry.content}"</p>
                      </div>

                      <form onSubmit={handleSubmitOfficialReply} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">اسم المسؤول المعتمد للرد</label>
                            <input
                              type="text"
                              required
                              value={replyResponderName}
                              onChange={(e) => setReplyResponderName(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">الصفة الإدارية</label>
                            <input
                              type="text"
                              required
                              value={replyResponderRole}
                              onChange={(e) => setReplyResponderRole(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1">نص الرد الرسمي والتوجيه الأكاديمي *</label>
                          <textarea
                            rows={3}
                            required
                            value={replyResponseText}
                            onChange={(e) => setReplyResponseText(e.target.value)}
                            placeholder="اكتب رد إدارة الكلية الرسمي والتوجيهات الصادرة للطالب..."
                            className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyingInquiry(null)}
                            className="px-4 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 px-5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>اعتماد الرد ونشره للطالب فوراً</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Inquiries List */}
                  <div className="space-y-3">
                    {filteredInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-950 dark:text-white">{inq.trackingCode}</span>
                            <span className="text-neutral-400">·</span>
                            <span>{inq.recipientDepartment}</span>
                            <span className="text-neutral-400">·</span>
                            <span className="text-neutral-500 font-mono">تاريخ: {inq.submittedAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                              {inq.messageType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inq.status === 'تم الرد والاعتماد'
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            }`}>
                              {inq.status}
                            </span>

                            <button
                              onClick={() => handleOpenReplyModal(inq)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 transition-colors"
                            >
                              {inq.officialResponse ? 'تعديل الرد' : 'كتابة الرد'}
                            </button>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1 text-neutral-400 hover:text-red-500"
                              title="حذف الرسالة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-neutral-950 dark:text-white">{inq.subject}</h4>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                            {inq.content}
                          </p>
                        </div>

                        <div className="text-[11px] text-neutral-500 font-mono flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-150 dark:border-neutral-850">
                          <span>المرسل: {inq.studentName}</span>
                          <span>رقم الجلوس: {inq.seatNumber}</span>
                          <span>البريد: {inq.email}</span>
                          {inq.phone && <span>الهاتف: {inq.phone}</span>}
                          {inq.documentLink && (
                            <a href={inq.documentLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                              مستند مرفق
                            </a>
                          )}
                        </div>

                        {inq.officialResponse && (
                          <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                            <div className="font-bold text-neutral-950 dark:text-white flex items-center justify-between">
                              <span>الرد المعتمد:</span>
                              <span className="font-mono text-[10px] text-neutral-500">{inq.officialResponse.respondedAt}</span>
                            </div>
                            <p className="text-neutral-800 dark:text-neutral-200">{inq.officialResponse.responseText}</p>
                            <div className="text-[10px] text-neutral-500 font-semibold">
                              — {inq.officialResponse.responderName} ({inq.officialResponse.responderRole})
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: ANNOUNCEMENTS MANAGEMENT */}
              {adminTab === 'announcements' && (
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
                    <h3 className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wider">
                      {editingAnnId ? 'تعديل الإعلان الأكاديمي الرسمي' : 'نشر إعلان أكاديمي رسمي جديد'}
                    </h3>

                    <form onSubmit={handleSaveAnnouncement} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold mb-1">عنوان الإعلان *</label>
                          <input
                            type="text"
                            required
                            value={annTitle}
                            onChange={(e) => setAnnTitle(e.target.value)}
                            placeholder="مثال: إعلان جداول الامتحانات العملية للفصل الدراسي الأول..."
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1">التصنيف</label>
                          <select
                            value={annCategory}
                            onChange={(e) => setAnnCategory(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                          >
                            <option>شؤون التعليم والطلاب</option>
                            <option>الجداول والامتحانات</option>
                            <option>الأنشطة والمسابقات</option>
                            <option>التدريب والتطوير</option>
                            <option>عمادة الكلية</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">ملخص وتفاصيل الإعلان *</label>
                        <textarea
                          rows={3}
                          required
                          value={annSummary}
                          onChange={(e) => setAnnSummary(e.target.value)}
                          placeholder="اكتب تفاصيل الإعلان والتعليمات الصادرة..."
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                          <input
                            type="checkbox"
                            checked={annImportant}
                            onChange={(e) => setAnnImportant(e.target.checked)}
                            className="rounded border-neutral-400 text-neutral-900 w-4 h-4"
                          />
                          <span>تمييز كإعلان عاجل</span>
                        </label>

                        <div className="flex items-center gap-2">
                          {editingAnnId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAnnId(null);
                                setAnnTitle('');
                                setAnnSummary('');
                              }}
                              className="px-3 py-1.5 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700"
                            >
                              إلغاء التعديل
                            </button>
                          )}
                          <button
                            type="submit"
                            className="px-5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 transition-colors"
                          >
                            {editingAnnId ? 'تأكيد التعديل' : 'نشر الخبر فوراً'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Table */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                            <th className="py-3 px-4">عنوان الإعلان</th>
                            <th className="py-3 px-4">التصنيف</th>
                            <th className="py-3 px-4">التاريخ</th>
                            <th className="py-3 px-4 text-center">عاجل</th>
                            <th className="py-3 px-4 text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850">
                          {announcements.map((ann) => (
                            <tr key={ann.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                              <td className="py-3 px-4 font-bold max-w-xs truncate">{ann.title}</td>
                              <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">{ann.category}</td>
                              <td className="py-3 px-4 font-mono text-neutral-500">{ann.date}</td>
                              <td className="py-3 px-4 text-center font-bold">{ann.important ? 'نعم' : '—'}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingAnnId(ann.id);
                                      setAnnTitle(ann.title);
                                      setAnnCategory(ann.category);
                                      setAnnDate(ann.date);
                                      setAnnSummary(ann.summary);
                                      setAnnImportant(ann.important);
                                    }}
                                    className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    title="تعديل"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAnnouncement(ann.id)}
                                    className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 hover:text-red-500"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: GRADUATION PROJECTS MANAGEMENT */}
              {adminTab === 'projects' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                        إدارة معرض مشاريع التخرج والابتكارات البحثية
                      </h3>
                      <p className="text-xs text-neutral-500">
                        إضافة مشاريع التخرج وتحديث بيانات المشرفين وفرق العمل والجوائز
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjTitle('');
                        setProjTitleEn('');
                        setProjDescription('');
                        setProjAwards('');
                        setIsProjectFormOpen(!isProjectFormOpen);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isProjectFormOpen ? 'إغلاق النموذج' : 'إضافة مشروع جديد'}</span>
                    </button>
                  </div>

                  {isProjectFormOpen && (
                    <div className="p-5 rounded-lg border border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900/60 shadow-lg space-y-4">
                      <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                        {editingProjectId ? 'تعديل مشروع التخرج' : 'تسجيل مشروع تخرج جديد بالملتقى'}
                      </h4>

                      <form onSubmit={handleSaveProject} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">عنوان المشروع بالعربية *</label>
                            <input
                              type="text"
                              required
                              value={projTitle}
                              onChange={(e) => setProjTitle(e.target.value)}
                              placeholder="مثال: نظام إدارة الطاقة الذكي لمحافظة قنا"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">العنوان بالإنجليزية</label>
                            <input
                              type="text"
                              value={projTitleEn}
                              onChange={(e) => setProjTitleEn(e.target.value)}
                              placeholder="Smart Energy Grid System"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">القسم الأكاديمي *</label>
                            <select
                              value={projDepartment}
                              onChange={(e) => setProjDepartment(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            >
                              <option>علوم الحاسب والذكاء الاصطناعي</option>
                              <option>نظم المعلومات وتنقيب البيانات</option>
                              <option>تكنولوجيا المعلومات والشبكات</option>
                              <option>الذكاء الاصطناعي التطبيقي</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">السنة الأكاديمية</label>
                            <input
                              type="text"
                              value={projYear}
                              onChange={(e) => setProjYear(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">حالة المشروع</label>
                            <select
                              value={projStatus}
                              onChange={(e) => setProjStatus(e.target.value as any)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            >
                              <option value="مكتمل">مكتمل</option>
                              <option value="قيد التنفيذ">قيد التنفيذ</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">المشرف الأكاديمي *</label>
                            <input
                              type="text"
                              required
                              value={projSupervisor}
                              onChange={(e) => setProjSupervisor(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">فريق العمل (مفصولين بفاصلة)</label>
                            <input
                              type="text"
                              value={projTeamMembers}
                              onChange={(e) => setProjTeamMembers(e.target.value)}
                              placeholder="أحمد علي، سارة محمد، كريم حسن"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1">وصف ملخص للمشروع</label>
                          <textarea
                            rows={2}
                            value={projDescription}
                            onChange={(e) => setProjDescription(e.target.value)}
                            placeholder="اشرح الهدف التطبيقي والتقني للمشروع..."
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">التقنيات (مفصولة بفاصلة)</label>
                            <input
                              type="text"
                              value={projTech}
                              onChange={(e) => setProjTech(e.target.value)}
                              placeholder="PyTorch, Docker, FastAPI"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">الجوائز أو التكريم (اختياري)</label>
                            <input
                              type="text"
                              value={projAwards}
                              onChange={(e) => setProjAwards(e.target.value)}
                              placeholder="المركز الأول في هاكاثون الصعيد للابتكار"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsProjectFormOpen(false)}
                            className="px-4 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                          >
                            {editingProjectId ? 'حفظ التعديلات' : 'إضافة المشروع'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Projects List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                            <span>{proj.department}</span>
                            <span>{proj.year}</span>
                          </div>
                          <h4 className="text-sm font-bold text-neutral-950 dark:text-white leading-snug">{proj.title}</h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{proj.description}</p>
                          <div className="text-[11px] text-neutral-500">
                            <div>الإشراف: {proj.supervisor}</div>
                            <div>الفريق: {proj.teamMembers.join(' · ')}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-neutral-150 dark:border-neutral-850">
                          <span className="text-[11px] font-mono text-neutral-500">دعم: {proj.likes} إعجاب</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProjectId(proj.id);
                                setProjTitle(proj.title);
                                setProjTitleEn(proj.titleEn);
                                setProjDepartment(proj.department);
                                setProjYear(proj.year);
                                setProjSupervisor(proj.supervisor);
                                setProjTeamMembers(proj.teamMembers.join('، '));
                                setProjDescription(proj.description);
                                setProjTech(proj.technologies.join(', '));
                                setProjAwards(proj.awards || '');
                                setProjStatus(proj.status);
                                setIsProjectFormOpen(true);
                              }}
                              className="p-1 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1 rounded border border-neutral-200 dark:border-neutral-800 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SCHEDULES MANAGEMENT */}
              {adminTab === 'schedules' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                        إدارة الجداول الدراسية والمحاضرات والسكاشن
                      </h3>
                      <p className="text-xs text-neutral-500">
                        تخصيص مواعيد المحاضرات والمعامل وقاعات التدريس بمدرجات الكلية
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSchedFormOpen(!isSchedFormOpen)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isSchedFormOpen ? 'إغلاق النموذج' : 'إضافة حصة/محاضرة'}</span>
                    </button>
                  </div>

                  {isSchedFormOpen && (
                    <div className="p-5 rounded-lg border border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900/60 shadow-lg space-y-3">
                      <h4 className="text-xs font-bold text-neutral-950 dark:text-white">إضافة فترة دراسية للجدول</h4>
                      <form onSubmit={handleAddScheduleItem} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">الفرقة الدراسية</label>
                            <select
                              value={schedLevel}
                              onChange={(e) => setSchedLevel(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            >
                              <option>الفرقة الأولى</option>
                              <option>الفرقة الثانية</option>
                              <option>الفرقة الثالثة</option>
                              <option>الفرقة الرابعة</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">اليوم</label>
                            <select
                              value={schedDay}
                              onChange={(e) => setSchedDay(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            >
                              <option>الأحد</option>
                              <option>الاثنين</option>
                              <option>الثلاثاء</option>
                              <option>الأربعاء</option>
                              <option>الخميس</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">الوقت</label>
                            <input
                              type="text"
                              required
                              value={schedTime}
                              onChange={(e) => setSchedTime(e.target.value)}
                              placeholder="08:30 - 10:15"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">النوع</label>
                            <select
                              value={schedType}
                              onChange={(e) => setSchedType(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            >
                              <option value="محاضرة">محاضرة</option>
                              <option value="سكشن عملي">سكشن عملي</option>
                              <option value="حلقة نقاشية">حلقة نقاشية</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">اسم المادة / المقرر *</label>
                            <input
                              type="text"
                              required
                              value={schedTitle}
                              onChange={(e) => setSchedTitle(e.target.value)}
                              placeholder="مثال: هندسة البرمجيات المتقدمة"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">المحاضر / المعيد</label>
                            <input
                              type="text"
                              value={schedInstructor}
                              onChange={(e) => setSchedInstructor(e.target.value)}
                              placeholder="أ.د. عصام الدين فؤاد"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">المكان / القاعة / المعمل</label>
                            <input
                              type="text"
                              value={schedHall}
                              onChange={(e) => setSchedHall(e.target.value)}
                              placeholder="مدرج 1 الرئيسي"
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsSchedFormOpen(false)}
                            className="px-4 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                          >
                            إضافة للجدول
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Schedules Display */}
                  <div className="space-y-4">
                    {schedules.map((group, gIdx) => (
                      <div key={gIdx} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-950 dark:text-white">
                          <span>{group.level} — {group.department} ({group.day})</span>
                          <span className="text-neutral-500 font-mono">{group.items.length} فترات</span>
                        </div>

                        <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                          {group.items.map((item, iIdx) => (
                            <div key={iIdx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                              <div>
                                <span className="font-semibold text-neutral-950 dark:text-white">{item.title}</span>
                                <span className="text-neutral-500 font-mono mr-2">[{item.type}] · {item.time}</span>
                                <div className="text-[11px] text-neutral-500">
                                  <span>المحاضر: {item.instructor}</span>
                                  <span className="mr-2">المكان: {item.hall}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteScheduleItem(group.level, group.day, iIdx)}
                                className="p-1 rounded text-neutral-400 hover:text-red-500"
                                title="حذف الحصة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                            {/* TAB: ACADEMIC SPECIALIZATION & BRANCHING SYSTEM (التشعيب الأكاديمي) */}
              {adminTab === 'specialization' && (
                <div className="p-4 sm:p-6 space-y-6">

                  {/* Header & Main Controls */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="text-xs font-mono uppercase text-neutral-400 mb-1 flex items-center gap-1.5">
                          <GitFork className="w-3.5 h-3.5" />
                          ARTICLE (5) OF FACULTY BYLAWS &bull; التنسيق والتشعيب الأكاديمي
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                          إدارة رغبات التشعيب والتوزيع على الأقسام الأكاديمية
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          توزيع طلاب الفرقة الثانية على الأقسام الأربعة (CS, IT, IS, AI) استناداً إلى الرغبات، المعدل التراكمي CGPA، والسعات المعتمدة
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Open/Close toggle */}
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/admin/specialization/toggle', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ open: !specializationOpen })
                            });
                            if (res.ok) {
                              const data = await res.json();
                              setSpecializationOpen(data.status.isOpen);
                              showFlash(data.message);
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                            specializationOpen
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                          }`}
                        >
                          {specializationOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          {specializationOpen ? 'إغلاق باب التقديم' : 'فتح باب التقديم للطلاب'}
                        </button>

                        {/* Run Auto-Allocation Button */}
                        <button
                          disabled={specializationRunning || specializationApplicants.length === 0}
                          onClick={async () => {
                            if (!confirm('هل تريد تشغيل التنسيق الإلكتروني الذكي لتوزيع الطلاب حسب المعدل التراكمي ورغباتهم؟')) return;
                            setSpecializationRunning(true);
                            try {
                              const res = await fetch('/api/admin/specialization/run-allocation', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' }
                              });
                              const data = await res.json();
                              if (res.ok) {
                                showFlash(data.message);
                                setSpecializationApplicants(data.applicants || []);
                                fetchSpecializationData();
                              } else {
                                alert(data.error || 'حدث خطأ أثناء تشغيل التنسيق');
                              }
                            } catch {
                              alert('فشل الاتصال بالسيرفر');
                            } finally {
                              setSpecializationRunning(false);
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
                            specializationRunning || specializationApplicants.length === 0
                              ? 'opacity-40 cursor-not-allowed bg-neutral-400 text-white'
                              : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800'
                          }`}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${specializationRunning ? 'animate-spin' : ''}`} />
                          {specializationRunning ? 'جاري تشغيل التنسيق...' : 'تشغيل التنسيق الإلكتروني للتشعيب'}
                        </button>

                        <button
                          onClick={fetchSpecializationData}
                          title="تحديث البيانات"
                          className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Department Capacities Configuration */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        السعة الاستيعابية المعتمدة للأقسام وتوزيع الطلاب
                      </h4>
                      <button
                        onClick={async () => {
                          const res = await fetch('/api/admin/specialization/capacities', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(specializationCapacities)
                          });
                          if (res.ok) {
                            showFlash('تم حفظ السعات الاستيعابية للأقسام بنجاح');
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800"
                      >
                        حفظ السعات
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { code: 'CS', name: 'علوم الحاسب (CS)', color: 'blue' },
                        { code: 'AI', name: 'الذكاء الاصطناعي (AI)', color: 'purple' },
                        { code: 'IT', name: 'تكنولوجيا المعلومات (IT)', color: 'emerald' },
                        { code: 'IS', name: 'نظم المعلومات (IS)', color: 'amber' },
                      ].map(dept => {
                        const count = specializationApplicants.filter(a => a.assignedDepartment && a.assignedDepartment.includes(dept.code)).length;
                        const cap = (specializationCapacities as any)[dept.code] || 40;
                        return (
                          <div key={dept.code} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-neutral-900 dark:text-white">{dept.name}</span>
                              <span className="font-mono text-xs font-bold text-neutral-500">{dept.code}</span>
                            </div>
                            <div className="text-2xl font-black text-neutral-900 dark:text-white mb-2">
                              {count} <span className="text-xs font-normal text-neutral-400">/ {cap} طالب</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] text-neutral-500 whitespace-nowrap">السعة القصوى:</label>
                              <input
                                type="number"
                                min="1"
                                max="200"
                                value={cap}
                                onChange={e => {
                                  const val = parseInt(e.target.value, 10) || 1;
                                  setSpecializationCapacities(prev => ({ ...prev, [dept.code]: val }));
                                }}
                                className="w-16 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Applicants List & Merit Allocation Table */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          كشف الطلاب المتقدمين للتشعيب ({specializationApplicants.length} طالب)
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          مرتبين حسب المعدل التراكمي CGPA ويمكن تعديل الترشيح واعتماد الترقية للفرقة الثالثة
                        </p>
                      </div>

                      {/* Filter by Department */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(['all', 'CS', 'AI', 'IT', 'IS'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setSpecializationFilter(f)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              specializationFilter === f
                                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                                : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                          >
                            {f === 'all' ? 'جميع المتقدمين' : f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table */}
                    {specializationApplicants.length === 0 ? (
                      <div className="text-center py-12 text-sm text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                        لم يقم أي طالب بتقديم رغبات التشعيب بعد
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-right">
                          <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold">
                            <tr>
                              <th className="p-3">م</th>
                              <th className="p-3">رقم الجلوس</th>
                              <th className="p-3">اسم الطالب</th>
                              <th className="p-3">المعدل CGPA</th>
                              <th className="p-3">ترتيب الرغبات (1 &larr; 4)</th>
                              <th className="p-3">القسم المرشح له</th>
                              <th className="p-3">الحالة</th>
                              <th className="p-3 text-center">الاعتماد والترقية</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {specializationApplicants
                              .filter(a => {
                                if (specializationFilter === 'all') return true;
                                return a.assignedDepartment && a.assignedDepartment.includes(specializationFilter);
                              })
                              .sort((a, b) => b.cgpa - a.cgpa)
                              .map((app, idx) => (
                                <tr key={app.id || app.studentSeat} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                                  <td className="p-3 font-mono font-bold text-neutral-400">{idx + 1}</td>
                                  <td className="p-3 font-mono font-bold text-neutral-900 dark:text-white">{app.studentSeat}</td>
                                  <td className="p-3 font-semibold text-neutral-900 dark:text-white">{app.studentName}</td>
                                  <td className="p-3">
                                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                      app.cgpa >= 3.5 ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300' :
                                      app.cgpa >= 3.0 ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' :
                                      'bg-neutral-100 dark:bg-neutral-800 text-neutral-700'
                                    }`}>
                                      {app.cgpa.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1">
                                      {Array.isArray(app.preferences) && app.preferences.map((p: string, pIdx: number) => (
                                        <span key={p} className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                          pIdx === 0
                                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                        }`}>
                                          {pIdx + 1}:{p}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <select
                                      value={app.assignedDepartment || ''}
                                      onChange={async (e) => {
                                        const newDept = e.target.value;
                                        const res = await fetch('/api/admin/specialization/assign', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            studentSeat: app.studentSeat,
                                            department: newDept,
                                            status: 'تم الترشيح'
                                          })
                                        });
                                        if (res.ok) {
                                          showFlash(`تم تغيير ترشيح الطالب ${app.studentName} إلى ${newDept}`);
                                          fetchSpecializationData();
                                        }
                                      }}
                                      className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                                    >
                                      <option value="">لم يُحدد</option>
                                      <option value="علوم الحاسب (CS)">علوم الحاسب (CS)</option>
                                      <option value="الذكاء الاصطناعي (AI)">الذكاء الاصطناعي (AI)</option>
                                      <option value="تكنولوجيا المعلومات (IT)">تكنولوجيا المعلومات (IT)</option>
                                      <option value="نظم المعلومات (IS)">نظم المعلومات (IS)</option>
                                    </select>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      app.status === 'معتمد' ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300' :
                                      app.status === 'تم الترشيح' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' :
                                      'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                                    }`}>
                                      {app.status || 'قيد المراجعة'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      disabled={!app.assignedDepartment || app.status === 'معتمد'}
                                      onClick={async () => {
                                        if (!confirm(`هل أنت متأكد من اعتماد ترشيح الطالب ${app.studentName} نهائياً وترقيته للفرقة الثالثة قسم ${app.assignedDepartment}؟`)) return;
                                        const res = await fetch('/api/admin/specialization/assign', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            studentSeat: app.studentSeat,
                                            department: app.assignedDepartment,
                                            status: 'معتمد',
                                            applyToStudent: true
                                          })
                                        });
                                        if (res.ok) {
                                          showFlash(`تم اعتماد وترقية الطالب ${app.studentName} بنجاح`);
                                          fetchSpecializationData();
                                          fetchStudents();
                                        }
                                      }}
                                      className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                                        app.status === 'معتمد'
                                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-default'
                                          : !app.assignedDepartment
                                          ? 'opacity-30 cursor-not-allowed bg-neutral-200 text-neutral-500'
                                          : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                      }`}
                                    >
                                      {app.status === 'معتمد' ? '✓ معتمد نهائياً' : 'اعتماد وترقية'}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}

{/* TAB 8: COURSE REGISTRATION SYSTEM */}
              {adminTab === 'registration' && (
                <div className="p-4 sm:p-6 space-y-6">

                  {/* Registration Status Control By Level & Department */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-6">
                    <div>
                      <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-1">
                        <Unlock className="w-4 h-4" />
                        التحكم المركزي في فتح وإغلاق التسجيل الأكاديمي وإضافة المقررات والدكاترة
                      </h3>
                      <p className="text-xs text-neutral-500">
                        يمكنك فتح أو إغلاق التسجيل لكل قسم، وإضافة المواد وأسماء الدكاترة والفصل الدراسي مباشرة لكل قسم بالكلية.
                      </p>
                    </div>

                    {/* Section 1: Common Levels */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>المرحلة العامة (مشترك لجميع الطلاب)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'الفرقة الأولى', label: 'الفرقة الأولى — المرحلة العامة', level: 'الفرقة الأولى', dept: 'المرحلة العامة' },
                          { key: 'الفرقة الثانية', label: 'الفرقة الثانية — المرحلة العامة', level: 'الفرقة الثانية', dept: 'المرحلة العامة' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          const slotsForDept = courseSlots.filter(s => s.level === item.level && (!s.department || s.department === 'عام' || s.department === 'المرحلة العامة'));
                          return (
                            <div key={item.key} className={`p-4 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/40 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white">{item.label}</span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  isOpen ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                }`}>
                                  {isOpen ? '🟢 مفتوح للتسجيل' : '🔴 مغلق'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{slotsForDept.length} مواد وشعب مضافة حالياً</span>
                              </div>

                              {/* Action Buttons: Add Course + Toggle Status */}
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSlotLevel(item.level);
                                    setSlotDepartment(item.dept);
                                    setEditingSlotId(null);
                                    setSlotCourseCode('');
                                    setSlotCourseName('');
                                    setIsSlotFormOpen(true);
                                  }}
                                  className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-lg font-bold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ إضافة مادة ودكتور</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await fetch('/api/admin/registration/toggle', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ level: item.key, open: !isOpen })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setRegStatus(data.status);
                                      showFlash(data.message);
                                    }
                                  }}
                                  className={`text-xs py-2 px-3 rounded-lg font-bold transition-colors ${
                                    isOpen
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                  }`}
                                >
                                  {isOpen ? 'إغلاق التسجيل' : 'فتح التسجيل'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Level 3 By Department */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>الفرقة الثالثة — فتح وإغلاق التسجيل وإضافة المقررات حسب القسم</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الثالثة - علوم الحاسب (CS)', 'الفرقة الثالثة - تكنولوجيا المعلومات (IT)', 'الفرقة الثالثة - نظم المعلومات (IS)', 'الفرقة الثالثة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: true }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم فتح التسجيل لجميع أقسام الفرقة الثالثة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/40">
                            فتح لجميع الأقسام
                          </button>
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الثالثة - علوم الحاسب (CS)', 'الفرقة الثالثة - تكنولوجيا المعلومات (IT)', 'الفرقة الثالثة - نظم المعلومات (IS)', 'الفرقة الثالثة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: false }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم إغلاق التسجيل لجميع أقسام الفرقة الثالثة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40">
                            إغلاق الكل
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { key: 'الفرقة الثالثة - علوم الحاسب (CS)', dept: 'علوم الحاسب (CS)', nameOnly: 'علوم الحاسب', code: 'CS' },
                          { key: 'الفرقة الثالثة - الذكاء الاصطناعي (AI)', dept: 'الذكاء الاصطناعي (AI)', nameOnly: 'الذكاء الاصطناعي', code: 'AI' },
                          { key: 'الفرقة الثالثة - تكنولوجيا المعلومات (IT)', dept: 'تكنولوجيا المعلومات (IT)', nameOnly: 'تكنولوجيا المعلومات', code: 'IT' },
                          { key: 'الفرقة الثالثة - نظم المعلومات (IS)', dept: 'نظم المعلومات (IS)', nameOnly: 'نظم المعلومات', code: 'IS' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          const slotsForDept = courseSlots.filter(s => s.level === 'الفرقة الثالثة' && (s.department && (s.department.includes(item.code) || item.dept.includes(s.department))));
                          return (
                            <div key={item.key} className={`p-3.5 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/40 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1 flex items-center justify-between">
                                <span>{item.nameOnly}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">{item.code}</span>
                              </div>
                              <div className={`text-[11px] font-semibold mb-2 ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                                {isOpen ? '🟢 التسجيل متاح' : '🔴 التسجيل مغلق'}
                              </div>

                              <div className="text-[11px] text-neutral-500 mb-2.5 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{slotsForDept.length} شعب ومقررات مضافة</span>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSlotLevel('الفرقة الثالثة');
                                    setSlotDepartment(item.dept);
                                    setEditingSlotId(null);
                                    setSlotCourseCode('');
                                    setSlotCourseName('');
                                    setIsSlotFormOpen(true);
                                  }}
                                  className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-lg font-bold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ إضافة مادة ودكتور</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await fetch('/api/admin/registration/toggle', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ level: item.key, open: !isOpen })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setRegStatus(data.status);
                                      showFlash(data.message);
                                    }
                                  }}
                                  className={`w-full text-[11px] py-1.5 rounded-lg font-bold transition-colors ${
                                    isOpen
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                >
                                  {isOpen ? 'إغلاق تسجيل القسم' : 'فتح تسجيل القسم'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3: Level 4 By Department */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>الفرقة الرابعة — فتح وإغلاق التسجيل وإضافة المقررات ومشاريع التخرج</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الرابعة - علوم الحاسب (CS)', 'الفرقة الرابعة - تكنولوجيا المعلومات (IT)', 'الفرقة الرابعة - نظم المعلومات (IS)', 'الفرقة الرابعة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: true }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم فتح التسجيل لجميع أقسام الفرقة الرابعة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/40">
                            فتح لجميع الأقسام
                          </button>
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الرابعة - علوم الحاسب (CS)', 'الفرقة الرابعة - تكنولوجيا المعلومات (IT)', 'الفرقة الرابعة - نظم المعلومات (IS)', 'الفرقة الرابعة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: false }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم إغلاق التسجيل لجميع أقسام الفرقة الرابعة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40">
                            إغلاق الكل
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { key: 'الفرقة الرابعة - علوم الحاسب (CS)', dept: 'علوم الحاسب (CS)', nameOnly: 'علوم الحاسب', code: 'CS' },
                          { key: 'الفرقة الرابعة - الذكاء الاصطناعي (AI)', dept: 'الذكاء الاصطناعي (AI)', nameOnly: 'الذكاء الاصطناعي', code: 'AI' },
                          { key: 'الفرقة الرابعة - تكنولوجيا المعلومات (IT)', dept: 'تكنولوجيا المعلومات (IT)', nameOnly: 'تكنولوجيا المعلومات', code: 'IT' },
                          { key: 'الفرقة الرابعة - نظم المعلومات (IS)', dept: 'نظم المعلومات (IS)', nameOnly: 'نظم المعلومات', code: 'IS' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          const slotsForDept = courseSlots.filter(s => s.level === 'الفرقة الرابعة' && (s.department && (s.department.includes(item.code) || item.dept.includes(s.department))));
                          return (
                            <div key={item.key} className={`p-3.5 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/40 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1 flex items-center justify-between">
                                <span>{item.nameOnly}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">{item.code}</span>
                              </div>
                              <div className={`text-[11px] font-semibold mb-2 ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                                {isOpen ? '🟢 التسجيل متاح' : '🔴 التسجيل مغلق'}
                              </div>

                              <div className="text-[11px] text-neutral-500 mb-2.5 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{slotsForDept.length} شعب ومقررات مضافة</span>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSlotLevel('الفرقة الرابعة');
                                    setSlotDepartment(item.dept);
                                    setEditingSlotId(null);
                                    setSlotCourseCode('');
                                    setSlotCourseName('');
                                    setIsSlotFormOpen(true);
                                  }}
                                  className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-lg font-bold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ إضافة مادة ودكتور</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await fetch('/api/admin/registration/toggle', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ level: item.key, open: !isOpen })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setRegStatus(data.status);
                                      showFlash(data.message);
                                    }
                                  }}
                                  className={`w-full text-[11px] py-1.5 rounded-lg font-bold transition-colors ${
                                    isOpen
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                >
                                  {isOpen ? 'إغلاق تسجيل القسم' : 'فتح تسجيل القسم'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Add Slot Form Modal / Inline Box */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          إدارة شعب المقررات وأسماء الدكاترة ({courseSlots.length} شعبة مسجلة)
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          حدد الفرقة والقسم الأكاديمي، اختر المقرر من اللائحة وحدد اسم الدكتور والموعد والقاعة
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSlotFormOpen(!isSlotFormOpen);
                          setEditingSlotId(null);
                          if (!isSlotFormOpen) {
                            setSlotCourseName('');
                            setSlotCourseCode('');
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isSlotFormOpen ? 'إغلاق النموذج' : 'إضافة شعبة ومادة جديدة'}
                      </button>
                    </div>

                    {isSlotFormOpen && (
                      <form
                        className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-5 mb-5 border-2 border-neutral-900 dark:border-white shadow-lg space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const url = editingSlotId
                            ? `/api/admin/course-slots/${editingSlotId}`
                            : '/api/admin/course-slots';
                          const method = editingSlotId ? 'PUT' : 'POST';
                          const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              courseCode: slotCourseCode,
                              courseName: slotCourseName,
                              type: slotType,
                              instructor: slotInstructor,
                              hallNumber: slotHall,
                              capacity: parseInt(slotCapacity, 10),
                              day: slotDay,
                              time: slotTime,
                              level: slotLevel,
                              department: slotDepartment,
                              semester: slotSemester
                            })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            showFlash(data.message);
                            setIsSlotFormOpen(false);
                            setEditingSlotId(null);
                            fetchRegistrationData();
                          } else {
                            alert(data.error);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                            <Plus className="w-4 h-4 text-green-600" />
                            {editingSlotId ? 'تعديل بيانات الشعبة والمحاضر' : 'إضافة مادة وشعبة دراسية ومحاضر للقسم'}
                          </h4>
                          <span className="text-xs text-neutral-400">
                            القسم المستهدف: <strong className="text-neutral-900 dark:text-white">{slotLevel} — {slotDepartment}</strong>
                          </span>
                        </div>

                        {/* Smart Course Selector from Bylaws Curriculum */}
                        <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            اختيار مقرر رسمي من لائحة الكلية (يملأ الكود واسم المادة تلقائياً):
                          </label>
                          <select
                            onChange={(e) => {
                              const found = curriculumCourses.find(c => c.code === e.target.value);
                              if (found) {
                                setSlotCourseCode(found.code);
                                setSlotCourseName(found.nameAr);
                              }
                            }}
                            className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                          >
                            <option value="">-- اضغط هنا لاختيار مادة من اللائحة مباشرة --</option>
                            {curriculumCourses
                              .filter(c => {
                                const lvlNum = slotLevel.includes('الأولى') ? 1 : slotLevel.includes('الثانية') ? 2 : slotLevel.includes('الثالثة') ? 3 : 4;
                                if (c.level !== lvlNum) return false;
                                if (lvlNum >= 3) {
                                  const dCode = slotDepartment.includes('CS') ? 'CS' : slotDepartment.includes('AI') ? 'AI' : slotDepartment.includes('IT') ? 'IT' : slotDepartment.includes('IS') ? 'IS' : null;
                                  if (dCode && !c.departments.includes(dCode)) return false;
                                }
                                return true;
                              })
                              .map(c => (
                                <option key={c.code} value={c.code}>
                                  {c.code} &mdash; {c.nameAr} ({c.nameEn}) &bull; [{c.type} - {c.credits} ساعات]
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الفرقة الدراسية</label>
                            <select value={slotLevel} onChange={e => setSlotLevel(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              {['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة'].map(l => <option key={l}>{l}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">القسم الأكاديمي</label>
                            <select value={slotDepartment} onChange={e => setSlotDepartment(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              {['المرحلة العامة', 'علوم الحاسب (CS)', 'تكنولوجيا المعلومات (IT)', 'نظم المعلومات (IS)', 'الذكاء الاصطناعي (AI)'].map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">نوع الشعبة</label>
                            <select value={slotType} onChange={e => setSlotType(e.target.value as any)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              <option value="محاضرة">محاضرة نظري</option>
                              <option value="سكشن عملي">سكشن عملي</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">كود المقرر</label>
                            <input value={slotCourseCode} onChange={e => setSlotCourseCode(e.target.value)} required className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono" placeholder="AI413" />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">اسم المقرر بالعربية</label>
                            <input value={slotCourseName} onChange={e => setSlotCourseName(e.target.value)} required className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white" placeholder="تعلم الآلة" />
                          </div>

                          {/* Doctor / Instructor with Quick Autocomplete */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">اسم الدكتور / المعيد</label>
                            <div className="flex gap-2">
                              <input
                                value={slotInstructor}
                                onChange={e => setSlotInstructor(e.target.value)}
                                required
                                className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                placeholder="أ.د. عصام الدين فؤاد"
                              />
                              <select
                                onChange={e => { if (e.target.value) setSlotInstructor(e.target.value); }}
                                className="w-44 text-xs px-2 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                              >
                                <option value="">-- أساتذة الكلية --</option>
                                <option value="أ.د. عصام الدين فؤاد">أ.د. عصام الدين فؤاد (عميد الكلية)</option>
                                <option value="د. خالد الدندراوي">د. خالد الدندراوي (وكيل الكلية)</option>
                                <option value="أ.د. منال عبد الستار">أ.د. منال عبد الستار (رئيس قسم IS)</option>
                                <option value="د. أحمد رشوان">د. أحمد رشوان (قسم CS)</option>
                                <option value="د. وليد البصيلي">د. وليد البصيلي (قسم IT)</option>
                                <option value="د. مصطفى عبد اللطيف">د. مصطفى عبد اللطيف (قسم AI)</option>
                                <option value="د. منى عبد الفتاح">د. منى عبد الفتاح</option>
                                <option value="د. محمود عثمان">د. محمود عثمان</option>
                                <option value="د. سمير كمال">د. سمير كمال</option>
                                <option value="م. إسلام محمد">م. إسلام محمد (معيد عملي)</option>
                                <option value="م. سارة أحمد">م. سارة أحمد (معيدة عملي)</option>
                                <option value="م. نورهان علي">م. نورهان علي (معيدة عملي)</option>
                                <option value="م. مروة محمود">م. مروة محمود (معيدة عملي)</option>
                                <option value="م. أحمد عبد الرحيم">م. أحمد عبد الرحيم (معيد عملي)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">مكان القاعة أو المعمل</label>
                            <div className="flex gap-1.5">
                              <input value={slotHall} onChange={e => setSlotHall(e.target.value)} required className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white" placeholder="مدرج 2 الرئيسي" />
                              <select
                                onChange={e => { if (e.target.value) setSlotHall(e.target.value); }}
                                className="w-28 text-xs px-1.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                              >
                                <option value="">-- القاعات --</option>
                                <option value="مدرج 1 الرئيسي">مدرج 1</option>
                                <option value="مدرج 2 الرئيسي">مدرج 2</option>
                                <option value="مدرج 3">مدرج 3</option>
                                <option value="معمل الذكاء الاصطناعي">معمل AI</option>
                                <option value="معمل نظم المعلومات">معمل IS</option>
                                <option value="معمل شبكات الحاسب">معمل IT</option>
                                <option value="معمل البرمجيات 1">معمل برمجيات</option>
                                <option value="معمل الإلكترونيات">معمل إلكترونيات</option>
                                <option value="قاعة المؤتمرات">المؤتمرات</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الطاقة الاستيعابية (المقاعد)</label>
                            <input type="number" min="1" value={slotCapacity} onChange={e => setSlotCapacity(e.target.value)} required className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono" placeholder="50" />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">يوم المحاضرة / السكشن</label>
                            <select value={slotDay} onChange={e => setSlotDay(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              {['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الموعد والتوقيت</label>
                            <select value={slotTime} onChange={e => setSlotTime(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono">
                              {['08:30 - 10:15', '10:30 - 12:15', '12:30 - 02:15', '02:30 - 04:15'].map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>

                          <div className="sm:col-span-2 md:col-span-3">
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الفصل الدراسي</label>
                            <select value={slotSemester} onChange={e => setSlotSemester(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              <option value="الفصل الدراسي الأول 2026/2027">الفصل الدراسي الأول 2026/2027</option>
                              <option value="الفصل الدراسي الثاني 2026/2027">الفصل الدراسي الثاني 2026/2027</option>
                              <option value="الفصل الصيفي 2026/2027">الفصل الصيفي 2026/2027</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t border-neutral-200 dark:border-neutral-800">
                          <button
                            type="button"
                            onClick={() => { setIsSlotFormOpen(false); setEditingSlotId(null); }}
                            className="px-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 text-xs rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold hover:bg-neutral-800 shadow-md"
                          >
                            {editingSlotId ? 'تحديث وحفظ التعديلات' : 'حفظ وإضافة الشعبة والمقرر'}
                          </button>
                        </div>
                      </form>
                    )}

{/* Filter by level */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة'].map(lvl => (
                        <button key={lvl} onClick={() => setRegLevelFilter(lvl)}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors ${regLevelFilter === lvl ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white' : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'}`}>
                          {lvl}
                        </button>
                      ))}
                    </div>

                    {/* Slots table */}
                    {courseSlots.filter(s => s.level === regLevelFilter).length === 0 ? (
                      <div className="text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                        لا توجد شعب مضافة لـ {regLevelFilter}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                              <th className="text-right px-3 py-2 text-neutral-500 font-semibold">المقرر</th>
                              <th className="text-right px-3 py-2 text-neutral-500 font-semibold">النوع</th>
                              <th className="text-right px-3 py-2 text-neutral-500 font-semibold">المحاضر</th>
                              <th className="text-right px-3 py-2 text-neutral-500 font-semibold">القاعة</th>
                              <th className="text-right px-3 py-2 text-neutral-500 font-semibold">اليوم/الوقت</th>
                              <th className="text-center px-3 py-2 text-neutral-500 font-semibold">الإشغال</th>
                              <th className="text-center px-3 py-2 text-neutral-500 font-semibold">إجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                            {courseSlots.filter(s => s.level === regLevelFilter).map((slot: any) => {
                              const fillPct = Math.round((slot.enrolledCount / slot.capacity) * 100);
                              return (
                                <tr key={slot.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                                  <td className="px-3 py-2">
                                    <div className="font-semibold text-neutral-900 dark:text-white">{slot.courseName}</div>
                                    <div className="font-mono text-neutral-400">{slot.courseCode}</div>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${slot.type === 'محاضرة' ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'}`}>
                                      {slot.type}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{slot.instructor}</td>
                                  <td className="px-3 py-2 font-mono text-neutral-600 dark:text-neutral-400">{slot.hallNumber}</td>
                                  <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{slot.day}<br/>{slot.time}</td>
                                  <td className="px-3 py-2 text-center">
                                    <div className="text-neutral-700 dark:text-neutral-300 mb-1">{slot.enrolledCount}/{slot.capacity}</div>
                                    <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mx-auto">
                                      <div className={`h-full rounded-full ${fillPct >= 100 ? 'bg-red-500' : fillPct >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(fillPct, 100)}%` }} />
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        onClick={() => {
                                          setEditingSlotId(slot.id);
                                          setSlotCourseCode(slot.courseCode);
                                          setSlotCourseName(slot.courseName);
                                          setSlotType(slot.type);
                                          setSlotInstructor(slot.instructor);
                                          setSlotHall(slot.hallNumber);
                                          setSlotCapacity(String(slot.capacity));
                                          setSlotDay(slot.day);
                                          setSlotTime(slot.time);
                                          setSlotLevel(slot.level);
                                          setSlotSemester(slot.semester);
                                          setIsSlotFormOpen(true);
                                        }}
                                        className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                                        title="تعديل"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (!confirm('حذف الشعبة وجميع تسجيلاتها؟')) return;
                                          const res = await fetch(`/api/admin/course-slots/${slot.id}`, { method: 'DELETE' });
                                          const data = await res.json();
                                          if (res.ok) { showFlash(data.message); fetchRegistrationData(); }
                                          else alert(data.error);
                                        }}
                                        className="p-1 rounded text-neutral-400 hover:text-red-500"
                                        title="حذف"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* All Student Registrations */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      تسجيلات الطلاب ({allRegistrations.filter(r => r.studentLevel.includes(regLevelFilter)).length} تسجيل)
                    </h3>
                    {allRegistrations.filter(r => r.studentLevel.includes(regLevelFilter)).length === 0 ? (
                      <div className="text-center py-6 text-neutral-400 text-sm border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                        لا توجد تسجيلات لـ {regLevelFilter} بعد
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                              <th className="text-right px-3 py-2 text-neutral-500">الطالب</th>
                              <th className="text-right px-3 py-2 text-neutral-500">المقرر</th>
                              <th className="text-right px-3 py-2 text-neutral-500">النوع</th>
                              <th className="text-right px-3 py-2 text-neutral-500">القاعة</th>
                              <th className="text-right px-3 py-2 text-neutral-500">اليوم/الوقت</th>
                              <th className="text-right px-3 py-2 text-neutral-500">وقت التسجيل</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                            {allRegistrations.filter(r => r.studentLevel.includes(regLevelFilter)).map((reg: any) => (
                              <tr key={reg.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                                <td className="px-3 py-2">
                                  <div className="font-semibold text-neutral-900 dark:text-white">{reg.studentName}</div>
                                  <div className="text-neutral-400 font-mono">#{reg.studentSeat}</div>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="text-neutral-700 dark:text-neutral-300">{reg.courseName}</div>
                                  <div className="font-mono text-neutral-400">{reg.courseCode}</div>
                                </td>
                                <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{reg.type}</td>
                                <td className="px-3 py-2 font-mono text-neutral-600 dark:text-neutral-400">{reg.hallNumber}</td>
                                <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{reg.day} · {reg.time}</td>
                                <td className="px-3 py-2 text-neutral-400">{reg.registeredAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* ===== STUDENT ELIGIBILITY OVERRIDE PANEL ===== */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      إدارة أهلية الطلاب — فتح / قفل المواد يدوياً
                    </h3>
                    <p className="text-xs text-neutral-400 mb-4">ابحث عن طالب برقم جلوسه، شاهد المواد المتاحة ومحظورة، وعدّل الأهلية يدوياً مع إمكانية التراجع.</p>

                    {/* Search Row */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <input
                        type="text"
                        value={overrideSearch}
                        onChange={e => setOverrideSearch(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') fetchOverrideStudent(overrideSearch, overrideSemPart); }}
                        placeholder="رقم جلوس الطالب..."
                        className="flex-1 min-w-[140px] text-sm px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                      />
                      <div className="flex gap-1">
                        {([1, 2] as const).map(s => (
                          <button key={s} onClick={() => { setOverrideSemPart(s); if (overrideStudentData) fetchOverrideStudent(overrideSearch, s); }}
                            className={`px-3 py-2 text-xs rounded-lg border font-semibold transition-colors ${overrideSemPart === s ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white' : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'}`}>
                            فصل {s}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => fetchOverrideStudent(overrideSearch, overrideSemPart)}
                        disabled={overrideLoading}
                        className="px-4 py-2 text-xs rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Search className="w-3.5 h-3.5" />
                        {overrideLoading ? 'جاري البحث...' : 'بحث'}
                      </button>
                    </div>

                    {/* Student Info + Courses Table */}
                    {overrideStudentData && (
                      <div>
                        {/* Student Header */}
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 mb-4 flex flex-wrap gap-4 items-center border border-neutral-200 dark:border-neutral-800">
                          <div>
                            <div className="text-xs text-neutral-400">الطالب</div>
                            <div className="font-bold text-neutral-900 dark:text-white text-sm">{overrideStudentData.student?.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-400">رقم الجلوس</div>
                            <div className="font-mono text-neutral-700 dark:text-neutral-300 text-sm">#{overrideStudentData.student?.seatNumber}</div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-400">الفرقة</div>
                            <div className="text-neutral-700 dark:text-neutral-300 text-sm">{overrideStudentData.student?.level}</div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-400">القسم</div>
                            <div className="text-neutral-700 dark:text-neutral-300 text-sm">{overrideStudentData.student?.department}</div>
                          </div>
                          <div className="mr-auto text-xs text-neutral-400">
                            {overrideStudentData.courses?.length || 0} مقرر في الفصل {overrideSemPart}
                          </div>
                        </div>

                        {/* Courses Table */}
                        {(!overrideStudentData.courses || overrideStudentData.courses.length === 0) ? (
                          <div className="text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                            لا توجد مقررات لهذا الطالب في الفصل {overrideSemPart}
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                                  <th className="text-right px-3 py-2 text-neutral-500 font-semibold">المقرر</th>
                                  <th className="text-center px-3 py-2 text-neutral-500 font-semibold">الأهلية التلقائية</th>
                                  <th className="text-center px-3 py-2 text-neutral-500 font-semibold">الحالة الحالية</th>
                                  <th className="text-right px-3 py-2 text-neutral-500 font-semibold">المتطلبات الناقصة</th>
                                  <th className="text-right px-3 py-2 text-neutral-500 font-semibold">سبب التجاوز</th>
                                  <th className="text-center px-3 py-2 text-neutral-500 font-semibold">إجراء</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                                {overrideStudentData.courses.map((course: any) => {
                                  const isActioning = overrideActioning === course.code;
                                  const hasOverride = course.override !== null && course.override !== undefined;
                                  const overrideIsLock = hasOverride && course.override?.action === 'lock';
                                  const overrideIsUnlock = hasOverride && course.override?.action === 'unlock';
                                  const autoEligible = course.eligible && !overrideIsLock;
                                  const finalEligible = course.finalEligible ?? (overrideIsUnlock ? true : overrideIsLock ? false : course.eligible);
                                  return (
                                    <tr key={course.code} className={`hover:bg-neutral-50 dark:hover:bg-neutral-900/40 ${!finalEligible ? 'opacity-75' : ''}`}>
                                      <td className="px-3 py-2">
                                        <div className="font-semibold text-neutral-900 dark:text-white">{course.nameAr}</div>
                                        <div className="font-mono text-neutral-400 text-[11px]">{course.code}</div>
                                        <div className="text-neutral-400 text-[10px]">{course.credits} ساعة</div>
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {course.eligible
                                          ? <span className="text-green-600 dark:text-green-400 font-bold">✓ مؤهل</span>
                                          : <span className="text-red-500 font-bold">✗ غير مؤهل</span>}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {hasOverride ? (
                                          overrideIsLock
                                            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[11px] font-semibold">🔒 مقفول يدوي</span>
                                            : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">🔓 مفتوح يدوي</span>
                                        ) : finalEligible
                                          ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 text-[11px]">✓ تلقائي</span>
                                          : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[11px]">— محجوب</span>
                                        }
                                      </td>
                                      <td className="px-3 py-2">
                                        {course.missingPrereqs && course.missingPrereqs.length > 0 ? (
                                          <div className="text-red-500 text-[11px]">{course.missingPrereqs.join('، ')}</div>
                                        ) : (
                                          <div className="text-neutral-400 text-[11px]">—</div>
                                        )}
                                      </td>
                                      <td className="px-3 py-2">
                                        <input
                                          type="text"
                                          value={overrideReason[course.code] || ''}
                                          onChange={e => setOverrideReason(prev => ({ ...prev, [course.code]: e.target.value }))}
                                          placeholder="سبب (اختياري)"
                                          className="w-full text-[11px] px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white min-w-[90px]"
                                        />
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        <div className="flex items-center justify-center gap-1 flex-wrap">
                                          {/* Lock button */}
                                          {!overrideIsLock && (
                                            <button
                                              disabled={isActioning}
                                              onClick={() => handleStudentOverride(overrideStudentData.student.seatNumber, course.code, 'lock', overrideReason[course.code])}
                                              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/60 disabled:opacity-50 font-semibold"
                                              title="قفل المادة لهذا الطالب"
                                            >
                                              <Lock className="w-3 h-3" /> قفل
                                            </button>
                                          )}
                                          {/* Unlock button */}
                                          {!overrideIsUnlock && (
                                            <button
                                              disabled={isActioning}
                                              onClick={() => handleStudentOverride(overrideStudentData.student.seatNumber, course.code, 'unlock', overrideReason[course.code])}
                                              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/60 disabled:opacity-50 font-semibold"
                                              title="فتح المادة استثناءً حتى لو ناقصه متطلبات"
                                            >
                                              <Unlock className="w-3 h-3" /> فتح استثناء
                                            </button>
                                          )}
                                          {/* Remove override button */}
                                          {hasOverride && (
                                            <button
                                              disabled={isActioning}
                                              onClick={() => handleStudentOverride(overrideStudentData.student.seatNumber, course.code, 'remove')}
                                              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50"
                                              title="إزالة التجاوز اليدوي والرجوع للتقييم التلقائي"
                                            >
                                              ↩ تراجع
                                            </button>
                                          )}
                                          {isActioning && <span className="text-[10px] text-neutral-400 animate-pulse">...</span>}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Empty State */}
                    {!overrideStudentData && !overrideLoading && (
                      <div className="text-center py-10 text-neutral-400 text-sm border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                        أدخل رقم جلوس الطالب واضغط <strong>بحث</strong> لعرض المقررات وإدارة الأهلية
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
