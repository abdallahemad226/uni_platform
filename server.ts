import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Core Data Interfaces
export interface CurriculumCourse {
  code: string;
  nameEn: string;
  nameAr: string;
  credits: number;
  teachingHoursLecture: number;
  teachingHoursPractical: number;
  prerequisites: string[];
  type: 'إجباري' | 'اختياري';
  departments: ('CS' | 'IS' | 'IT' | 'AI')[];
  semester: number;
  level: 1 | 2 | 3 | 4;
  category: string;
}

export interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  grade: string;
  points: number;
  score: number;
  status: 'ناجح' | 'راسب' | 'مسجل حالياً';
}

export interface StudentRecord {
  seatNumber: string;
  nationalId: string;
  name: string;
  level: string;
  department: string;
  academicAdvisor: string;
  cgpa: number;
  totalCredits: number;
  status: string;
  examHall: string;
  seatLocation: string;
  avatar?: string;
  courses: CourseGrade[];
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  important: boolean;
  views?: number;
}

export interface StudentServiceRequest {
  id: string;
  referenceNumber: string;
  studentName: string;
  seatNumber: string;
  nationalId: string;
  level: string;
  department: string;
  phone: string;
  serviceType: string;
  requestType?: string;
  urgent: boolean;
  copiesCount: number;
  destination: string;
  additionalNotes?: string;
  status: string;
  fee: number;
  submittedAt: string;
}

export interface FacultyInquiry {
  id: string;
  trackingCode: string;
  studentName: string;
  seatNumber: string;
  email: string;
  phone: string;
  level: string;
  department: string;
  recipientDepartment: string;
  messageType: 'استفسار أكاديمي' | 'مقترح تطوير' | 'شكوى / التماس' | 'طلب مقابلة رسمية';
  priority: 'عادي' | 'عاجل';
  subject: string;
  content: string;
  documentLink?: string;
  status: 'تم الاستلام' | 'قيد الدراسة لدى الإدارة' | 'تم الرد والاعتماد';
  officialResponse?: {
    responderName: string;
    responderRole: string;
    responseText: string;
    respondedAt: string;
  };
  submittedAt: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  titleEn?: string;
  department: string;
  academicYear?: string;
  year?: string;
  supervisor: string;
  teamMembers: any;
  description: string;
  techStack?: any;
  technologies?: any;
  awards?: any;
  status: 'مكتمل' | 'قيد التنفيذ';
  likes?: number;
}

export interface ScheduleDay {
  id?: string;
  level: string;
  day: string;
  items?: {
    time: string;
    title: string;
    type: 'محاضرة' | 'سكشن عملي';
    instructor: string;
    hall: string;
  }[];
  slots?: {
    time: string;
    title: string;
    type: 'محاضرة' | 'سكشن عملي';
    instructor: string;
    hall: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderSeat: string;
  senderName: string;
  senderAvatar?: string;
  receiverSeat: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read?: boolean;
}

// =====================================================================
// COURSE REGISTRATION & SPECIALIZATION INTERFACES & STORES
// =====================================================================

interface CourseSlot {
  id: string;
  courseCode: string;
  courseName: string;
  type: 'محاضرة' | 'سكشن عملي';
  instructor: string;        // Doctor or assistant name
  hallNumber: string;        // Room / hall number
  capacity: number;          // Max seats
  enrolledCount: number;     // How many registered so far
  day: string;               // e.g. الأحد
  time: string;              // e.g. 08:30 - 10:15
  level: 'الفرقة الأولى' | 'الفرقة الثانية' | 'الفرقة الثالثة' | 'الفرقة الرابعة';
  department?: string;       // e.g. 'علوم الحاسب (CS)' or 'عام'
  semester: string;          // e.g. الفصل الدراسي الأول 2026/2027
  createdAt: string;
}

interface CourseRegistration {
  id: string;
  studentSeat: string;
  studentName: string;
  studentLevel: string;
  studentDepartment: string;
  slotId: string;
  courseCode: string;
  courseName: string;
  type: string;
  instructor: string;
  hallNumber: string;
  day: string;
  time: string;
  registeredAt: string;
}

// Academic Specialization (التشعيب الأكاديمي) Interfaces
interface SpecializationPreference {
  id: string;
  studentSeat: string;
  studentName: string;
  studentLevel: string;
  cgpa: number;
  preferences: string[]; // ['CS', 'AI', 'IT', 'IS']
  submittedAt: string;
  assignedDepartment: string | null;
  status: 'قيد المراجعة' | 'تم الترشيح' | 'معتمد';
  notes?: string;
}

// Registration Open/Closed Status by Level and Department
let registrationStatus: Record<string, boolean> = {
  // Common levels
  'الفرقة الأولى': true,
  'الفرقة الثانية': true,
  'الفرقة الثالثة': true,
  'الفرقة الرابعة': true,
  
  // Level 3 per department
  'الفرقة الثالثة - علوم الحاسب (CS)': true,
  'الفرقة الثالثة - تكنولوجيا المعلومات (IT)': true,
  'الفرقة الثالثة - نظم المعلومات (IS)': true,
  'الفرقة الثالثة - الذكاء الاصطناعي (AI)': true,

  // Level 4 per department
  'الفرقة الرابعة - علوم الحاسب (CS)': true,
  'الفرقة الرابعة - تكنولوجيا المعلومات (IT)': true,
  'الفرقة الرابعة - نظم المعلومات (IS)': true,
  'الفرقة الرابعة - الذكاء الاصطناعي (AI)': true
};

// Helper: Check if registration is open for a student or slot
function isRegistrationOpen(level: string, department?: string): boolean {
  if (department && department !== 'عام' && !department.includes('المرحلة العامة') && !department.includes('General')) {
    const deptKey = `${level} - ${department}`;
    if (deptKey in registrationStatus) {
      return registrationStatus[deptKey];
    }
  }
  return registrationStatus[level] ?? true;
}

// Academic Specialization Status (التشعيب الأكاديمي)
let specializationStatus = {
  isOpen: true,
  academicYear: '2026/2027',
  targetLevel: 'الفرقة الثانية',
  startDate: '2026-10-01',
  endDate: '2026-11-30',
  description: 'فتح باب تلقي رغبات التشعيب الأكاديمي للطلاب المنقولين للفرقة الثالثة طبقاً للمادة (5) من اللائحة الداخلية لمرحلة البكالوريوس.',
  capacities: {
    'CS': 40,
    'AI': 30,
    'IT': 25,
    'IS': 25
  }
};

let specializationPreferencesStore: SpecializationPreference[] = [
  {
    id: 'spec-3120',
    studentSeat: '3120',
    studentName: 'عبد الله محمد عبد الباسط الصاوي',
    studentLevel: 'الفرقة الثانية',
    cgpa: 3.92,
    preferences: ['AI', 'CS', 'IT', 'IS'],
    submittedAt: '2026-11-15 10:30:00',
    assignedDepartment: 'الذكاء الاصطناعي (AI)',
    status: 'تم الترشيح'
  }
];

// Available course slots (Pre-seeded with official bylaws curriculum slots)
let courseSlotsStore: CourseSlot[] = [
  // --- الفرقة الأولى (مشترك عام) ---
  { id: 'slot-101', courseCode: 'HU111', courseName: 'اللغة الإنجليزية I', type: 'محاضرة', instructor: 'د. منى عبد الفتاح', hallNumber: 'مدرج 1 الرئيسي', capacity: 60, enrolledCount: 12, day: 'الأحد', time: '08:30 - 10:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-102', courseCode: 'MA111', courseName: 'رياضيات I', type: 'محاضرة', instructor: 'أ.د. محمد حسن', hallNumber: 'مدرج 1 الرئيسي', capacity: 60, enrolledCount: 20, day: 'الاثنين', time: '08:30 - 10:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-103', courseCode: 'MA111', courseName: 'رياضيات I (تمارين)', type: 'سكشن عملي', instructor: 'م. أحمد عبد الرحيم', hallNumber: 'قاعة 1A', capacity: 30, enrolledCount: 15, day: 'الاثنين', time: '10:30 - 12:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-104', courseCode: 'EE101', courseName: 'إلكترونيات', type: 'محاضرة', instructor: 'د. وليد البصيلي', hallNumber: 'مدرج 2', capacity: 55, enrolledCount: 18, day: 'الثلاثاء', time: '08:30 - 10:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-105', courseCode: 'EE101', courseName: 'إلكترونيات (معمل)', type: 'سكشن عملي', instructor: 'م. سارة أحمد', hallNumber: 'معمل الإلكترونيات', capacity: 25, enrolledCount: 14, day: 'الثلاثاء', time: '10:30 - 12:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-106', courseCode: 'CS121', courseName: 'أساسيات علوم الحاسب', type: 'محاضرة', instructor: 'د. أحمد رشوان', hallNumber: 'مدرج 1 الرئيسي', capacity: 60, enrolledCount: 22, day: 'الأربعاء', time: '08:30 - 10:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-107', courseCode: 'CS121', courseName: 'أساسيات علوم الحاسب (عملي)', type: 'سكشن عملي', instructor: 'م. إسلام محمد', hallNumber: 'معمل الحاسب 1', capacity: 30, enrolledCount: 19, day: 'الأربعاء', time: '10:30 - 12:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-108', courseCode: 'HU141', courseName: 'الحاسبات والأخلاقيات', type: 'محاضرة', instructor: 'د. محمود عثمان', hallNumber: 'مدرج 3', capacity: 50, enrolledCount: 10, day: 'الخميس', time: '08:30 - 10:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-109', courseCode: 'HU151', courseName: 'تاريخ الحوسبة', type: 'محاضرة', instructor: 'د. سمير كمال', hallNumber: 'مدرج 3', capacity: 50, enrolledCount: 8, day: 'الخميس', time: '10:30 - 12:15', level: 'الفرقة الأولى', department: 'عام', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },

  // --- الفرقة الرابعة — علوم الحاسب (CS) ---
  { id: 'slot-401', courseCode: 'AI413', courseName: 'تعلم الآلة', type: 'محاضرة', instructor: 'أ.د. عصام الدين فؤاد', hallNumber: 'مدرج 2 الرئيسي', capacity: 50, enrolledCount: 16, day: 'الأحد', time: '08:30 - 10:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-402', courseCode: 'AI413', courseName: 'تعلم الآلة (عملي)', type: 'سكشن عملي', instructor: 'م. إسلام محمد', hallNumber: 'معمل الذكاء الاصطناعي', capacity: 25, enrolledCount: 14, day: 'الأحد', time: '10:30 - 12:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-403', courseCode: 'CS401', courseName: 'نظرية الحوسبة', type: 'محاضرة', instructor: 'د. أحمد رشوان', hallNumber: 'مدرج 1 الرئيسي', capacity: 50, enrolledCount: 18, day: 'الاثنين', time: '08:30 - 10:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-404', courseCode: 'CS401', courseName: 'نظرية الحوسبة (تمارين)', type: 'سكشن عملي', instructor: 'م. مصطفى كمال', hallNumber: 'قاعة 3B', capacity: 30, enrolledCount: 12, day: 'الاثنين', time: '10:30 - 12:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-405', courseCode: 'CS442', courseName: 'برمجة الأنظمة المدمجة', type: 'محاضرة', instructor: 'د. وليد البصيلي', hallNumber: 'مدرج 3', capacity: 40, enrolledCount: 10, day: 'الثلاثاء', time: '10:30 - 12:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-406', courseCode: 'CS442', courseName: 'برمجة الأنظمة المدمجة (معمل)', type: 'سكشن عملي', instructor: 'م. سارة أحمد', hallNumber: 'معمل إنترنت الأشياء', capacity: 20, enrolledCount: 9, day: 'الثلاثاء', time: '12:30 - 02:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-407', courseCode: 'CS443', courseName: 'برمجة الهواتف المحمولة', type: 'محاضرة', instructor: 'د. خالد الدندراوي', hallNumber: 'مدرج 2 الرئيسي', capacity: 45, enrolledCount: 15, day: 'الأربعاء', time: '08:30 - 10:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-408', courseCode: 'CS443', courseName: 'برمجة الهواتف المحمولة (عملي)', type: 'سكشن عملي', instructor: 'م. نورهان علي', hallNumber: 'معمل البرمجيات 1', capacity: 25, enrolledCount: 12, day: 'الأربعاء', time: '10:30 - 12:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-409', courseCode: 'CS464', courseName: 'اكتشاف المعرفة', type: 'محاضرة', instructor: 'أ.د. منال عبد الستار', hallNumber: 'مدرج 1 الرئيسي', capacity: 40, enrolledCount: 11, day: 'الخميس', time: '08:30 - 10:15', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-410', courseCode: 'CS481', courseName: 'مشروع التخرج (الجزء الأول)', type: 'محاضرة', instructor: 'أ.د. عصام الدين فؤاد & لجنة المشاريع', hallNumber: 'قاعة المؤتمرات', capacity: 35, enrolledCount: 8, day: 'الخميس', time: '10:30 - 01:30', level: 'الفرقة الرابعة', department: 'علوم الحاسب (CS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },

  // --- الفرقة الثالثة — نظم المعلومات (IS) ---
  { id: 'slot-301', courseCode: 'IS331', courseName: 'تحليل وتصميم نظم المعلومات', type: 'محاضرة', instructor: 'أ.د. منال عبد الستار', hallNumber: 'مدرج 2', capacity: 45, enrolledCount: 15, day: 'الأحد', time: '08:30 - 10:15', level: 'الفرقة الثالثة', department: 'نظم المعلومات (IS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-302', courseCode: 'IS331', courseName: 'تحليل وتصميم نظم المعلومات (عملي)', type: 'سكشن عملي', instructor: 'م. مروة محمود', hallNumber: 'معمل نظم المعلومات', capacity: 25, enrolledCount: 12, day: 'الأحد', time: '10:30 - 12:15', level: 'الفرقة الثالثة', department: 'نظم المعلومات (IS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-303', courseCode: 'AI301', courseName: 'الذكاء الاصطناعي', type: 'محاضرة', instructor: 'أ.د. عصام الدين فؤاد', hallNumber: 'مدرج 1', capacity: 50, enrolledCount: 18, day: 'الاثنين', time: '08:30 - 10:15', level: 'الفرقة الثالثة', department: 'نظم المعلومات (IS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-304', courseCode: 'IS312', courseName: 'مستودعات البيانات', type: 'محاضرة', instructor: 'د. خالد الدندراوي', hallNumber: 'مدرج 3', capacity: 40, enrolledCount: 14, day: 'الثلاثاء', time: '08:30 - 10:15', level: 'الفرقة الثالثة', department: 'نظم المعلومات (IS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' },
  { id: 'slot-305', courseCode: 'CS311', courseName: 'تحليل وتصميم الخوارزميات', type: 'محاضرة', instructor: 'د. أحمد رشوان', hallNumber: 'مدرج 1', capacity: 45, enrolledCount: 16, day: 'الأربعاء', time: '08:30 - 10:15', level: 'الفرقة الثالثة', department: 'نظم المعلومات (IS)', semester: 'الفصل الدراسي الأول 2026/2027', createdAt: '2026-10-01' }
];

// Student registrations
let registrationsStore: CourseRegistration[] = [];

const CURRICULUM_DATABASE: CurriculumCourse[] = [
  // =========================================================
  // LEVEL 1 — SEMESTER 1 (مشترك لكل الأقسام)
  // =========================================================
  { code: 'HU111', nameEn: 'English Language I', nameAr: 'اللغة الإنجليزية I', credits: 2, teachingHoursLecture: 2, teachingHoursPractical: 0, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 1, level: 1, category: 'متطلبات عامة' },
  { code: 'HU141', nameEn: 'Computers and Ethics', nameAr: 'الحاسبات والأخلاقيات', credits: 2, teachingHoursLecture: 2, teachingHoursPractical: 0, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 1, level: 1, category: 'متطلبات عامة' },
  { code: 'MA111', nameEn: 'Math I', nameAr: 'رياضيات I', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 1, level: 1, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'EE101', nameEn: 'Electronics', nameAr: 'إلكترونيات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 1, level: 1, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'CS121', nameEn: 'Computer Science Fundamentals', nameAr: 'أساسيات علوم الحاسب', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 1, level: 1, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'HU151', nameEn: 'History of Computing', nameAr: 'تاريخ الحوسبة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 1, level: 1, category: 'متطلبات عامة' },

  // =========================================================
  // LEVEL 1 — SEMESTER 2
  // =========================================================
  { code: 'HU132', nameEn: 'Technical Writing', nameAr: 'الكتابة التقنية', credits: 2, teachingHoursLecture: 2, teachingHoursPractical: 0, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات عامة' },
  { code: 'CS141', nameEn: 'Programming Fundamentals', nameAr: 'أساسيات البرمجة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'MA112', nameEn: 'Discrete Structures', nameAr: 'الهياكل المتقطعة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'MA121', nameEn: 'Probability and Statistics I', nameAr: 'الاحتمالات والإحصاء I', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA111'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'MA113', nameEn: 'Math II', nameAr: 'رياضيات II', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA111'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'HU112', nameEn: 'English Language II', nameAr: 'اللغة الإنجليزية II', credits: 2, teachingHoursLecture: 2, teachingHoursPractical: 0, prerequisites: ['HU111'], type: 'اختياري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات عامة' },
  { code: 'HU122', nameEn: 'Marketing and Sales', nameAr: 'التسويق والمبيعات', credits: 2, teachingHoursLecture: 2, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات عامة' },
  { code: 'HU153', nameEn: 'Scientific Thinking', nameAr: 'التفكير العلمي', credits: 2, teachingHoursLecture: 2, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS','IS','IT','AI'], semester: 2, level: 1, category: 'متطلبات عامة' },

  // =========================================================
  // LEVEL 2 — SEMESTER 3 (مشترك)
  // =========================================================
  { code: 'MA222', nameEn: 'Probability and Statistics II', nameAr: 'الاحتمالات والإحصاء II', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA121'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 3, level: 2, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'CS241', nameEn: 'Object-Oriented Programming', nameAr: 'البرمجة كائنية التوجه', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS141'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 3, level: 2, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'IT231', nameEn: 'Computer Networks I', nameAr: 'شبكات الحاسب I', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS121'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 3, level: 2, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'MA231', nameEn: 'Operations Research', nameAr: 'بحوث العمليات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA113'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 3, level: 2, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'EE201', nameEn: 'Logic Design', nameAr: 'التصميم المنطقي', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['EE101'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 3, level: 2, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'IS221', nameEn: 'Project Management', nameAr: 'إدارة المشروعات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS121'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 3, level: 2, category: 'متطلبات كلية - علوم حاسب' },

  // =========================================================
  // LEVEL 2 — SEMESTER 4 (مشترك)
  // =========================================================
  { code: 'IS212', nameEn: 'Web Technology', nameAr: 'تكنولوجيا الويب', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS241'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 4, level: 2, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'CS211', nameEn: 'Data Structures I', nameAr: 'هياكل البيانات I', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS241'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 4, level: 2, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'CS291', nameEn: 'Modeling and Simulation', nameAr: 'النمذجة والمحاكاة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS141'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 4, level: 2, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'PH201', nameEn: 'Physics', nameAr: 'فيزياء', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 4, level: 2, category: 'متطلبات كلية - رياضيات وعلوم' },
  { code: 'IS211', nameEn: 'Database', nameAr: 'قواعد البيانات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 4, level: 2, category: 'متطلبات كلية - علوم حاسب' },
  { code: 'CS242', nameEn: 'Parallel Programming', nameAr: 'البرمجة المتوازية', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS241'], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 4, level: 2, category: 'متطلبات كلية - علوم حاسب' },

  // =========================================================
  // LEVEL 3 — CS — SEMESTER 5
  // =========================================================
  { code: 'CS312', nameEn: 'Data Structures II', nameAr: 'هياكل البيانات II', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: ['CS211'], type: 'إجباري', departments: ['CS'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS352', nameEn: 'Image Processing', nameAr: 'معالجة الصور', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS241'], type: 'إجباري', departments: ['CS'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS391', nameEn: 'Software Engineering', nameAr: 'هندسة البرمجيات', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'إجباري', departments: ['CS'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'AI301', nameEn: 'Artificial Intelligence', nameAr: 'الذكاء الاصطناعي', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS211'], type: 'إجباري', departments: ['CS'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS321', nameEn: 'Operating Systems I', nameAr: 'نظم التشغيل I', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS121'], type: 'إجباري', departments: ['CS'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS311', nameEn: 'Algorithms Analysis and Design', nameAr: 'تحليل وتصميم الخوارزميات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS211'], type: 'إجباري', departments: ['CS'], semester: 5, level: 3, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 3 — CS — SEMESTER 6
  // =========================================================
  { code: 'CS341', nameEn: 'Concepts of Programming Languages', nameAr: 'مفاهيم لغات البرمجة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS312'], type: 'إجباري', departments: ['CS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS351', nameEn: 'Computer Graphics I', nameAr: 'رسوميات الحاسب I', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA113'], type: 'إجباري', departments: ['CS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS331', nameEn: 'Visual Programming', nameAr: 'البرمجة المرئية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: ['CS211'], type: 'إجباري', departments: ['CS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS322', nameEn: 'Computer Architecture and Organization', nameAr: 'معمارية وتنظيم الحاسبات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['EE201'], type: 'إجباري', departments: ['CS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'IT302', nameEn: 'Cryptography', nameAr: 'التشفير', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: ['MA113'], type: 'إجباري', departments: ['CS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'TR301', nameEn: 'Field Training', nameAr: 'التدريب الميداني', credits: 3, teachingHoursLecture: 0, teachingHoursPractical: 0, prerequisites: [], type: 'إجباري', departments: ['CS','IS','IT','AI'], semester: 6, level: 3, category: 'تدريب' },

  // =========================================================
  // LEVEL 4 — CS — SEMESTER 7
  // =========================================================
  { code: 'AI413', nameEn: 'Machine Learning', nameAr: 'تعلم الآلة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA113','MA222'], type: 'إجباري', departments: ['CS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS401', nameEn: 'Computation Theory', nameAr: 'نظرية الحوسبة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: ['MA112'], type: 'إجباري', departments: ['CS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS442', nameEn: 'Embedded Systems Programming', nameAr: 'برمجة الأنظمة المدمجة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS443', nameEn: 'Mobile Programming', nameAr: 'برمجة الهواتف المحمولة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS464', nameEn: 'Knowledge Discovery', nameAr: 'اكتشاف المعرفة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS481', nameEn: 'Graduation Project (Part 1)', nameAr: 'مشروع التخرج (جزء أول)', credits: 3, teachingHoursLecture: 0, teachingHoursPractical: 3, prerequisites: [], type: 'إجباري', departments: ['CS'], semester: 7, level: 4, category: 'مشروع تخرج' },

  // =========================================================
  // LEVEL 4 — CS — SEMESTER 8
  // =========================================================
  { code: 'CS441', nameEn: 'Compiler Construction', nameAr: 'بناء المترجمات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS322'], type: 'إجباري', departments: ['CS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS453', nameEn: 'Computer Vision', nameAr: 'رؤية الحاسب', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS351','CS352'], type: 'إجباري', departments: ['CS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS431', nameEn: 'Big Data Analysis', nameAr: 'تحليل البيانات الضخمة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI401', nameEn: 'Natural Language Processing', nameAr: 'معالجة اللغات الطبيعية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI435', nameEn: 'Fuzzy Computing', nameAr: 'الحوسبة الضبابية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['CS'], semester: 8, level: 4, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 3 — IS — SEMESTER 5
  // =========================================================
  { code: 'IS331', nameEn: 'Analysis and Design of Information Systems', nameAr: 'تحليل وتصميم نظم المعلومات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS211'], type: 'إجباري', departments: ['IS'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'IS312', nameEn: 'Data Warehousing', nameAr: 'مستودعات البيانات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS211'], type: 'إجباري', departments: ['IS'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'IS313', nameEn: 'File Management and Processing', nameAr: 'إدارة الملفات ومعالجتها', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS211'], type: 'إجباري', departments: ['IS'], semester: 5, level: 3, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 3 — IS — SEMESTER 6
  // =========================================================
  { code: 'IS342', nameEn: 'Business Process Management', nameAr: 'إدارة العمليات التجارية', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS331'], type: 'إجباري', departments: ['IS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'IS341', nameEn: 'Information Retrieval', nameAr: 'استرجاع المعلومات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS211'], type: 'إجباري', departments: ['IS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'IS314', nameEn: 'Web-based Information Systems Development', nameAr: 'تطوير نظم المعلومات المبنية على الويب', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS212'], type: 'إجباري', departments: ['IS'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'IS311', nameEn: 'Database Management Systems', nameAr: 'نظم إدارة قواعد البيانات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS211'], type: 'إجباري', departments: ['IS'], semester: 6, level: 3, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 4 — IS — SEMESTER 7
  // =========================================================
  { code: 'IS411', nameEn: 'Data Mining', nameAr: 'تنقيب البيانات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS311'], type: 'إجباري', departments: ['IS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS415', nameEn: 'Mobile Computing Applications', nameAr: 'تطبيقات الحوسبة المتنقلة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS443', nameEn: 'Information Systems Security and Risk Management', nameAr: 'أمن نظم المعلومات وإدارة المخاطر', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS414', nameEn: 'Distributed Database', nameAr: 'قواعد البيانات الموزعة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IS'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS451', nameEn: 'Graduation Project (Part 1)', nameAr: 'مشروع التخرج (جزء أول)', credits: 3, teachingHoursLecture: 0, teachingHoursPractical: 3, prerequisites: [], type: 'إجباري', departments: ['IS'], semester: 7, level: 4, category: 'مشروع تخرج' },

  // =========================================================
  // LEVEL 4 — IS — SEMESTER 8
  // =========================================================
  { code: 'IS431', nameEn: 'Managing and Modeling Big Data', nameAr: 'إدارة ونمذجة البيانات الضخمة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS411'], type: 'إجباري', departments: ['IS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS412', nameEn: 'Service-Oriented Architecture', nameAr: 'المعمارية الموجهة بالخدمات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IS314'], type: 'إجباري', departments: ['IS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS442', nameEn: 'Information Systems Quality Assurance', nameAr: 'ضمان جودة نظم المعلومات', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS445', nameEn: 'Enterprise Information Systems', nameAr: 'نظم المعلومات المؤسسية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IS'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IS447', nameEn: 'E-Business', nameAr: 'الأعمال الإلكترونية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IS'], semester: 8, level: 4, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 3 — IT — SEMESTER 5
  // =========================================================
  { code: 'IT301', nameEn: 'Micro Controllers', nameAr: 'المتحكمات الدقيقة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['EE201'], type: 'إجباري', departments: ['IT'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'IT341', nameEn: 'Signals and Systems', nameAr: 'الإشارات والأنظمة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA121'], type: 'إجباري', departments: ['IT'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'CS362', nameEn: 'Pattern Recognition I', nameAr: 'التعرف على الأنماط I', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS211'], type: 'إجباري', departments: ['IT'], semester: 5, level: 3, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 3 — IT — SEMESTER 6
  // =========================================================
  { code: 'IT331', nameEn: 'Computer Networks II', nameAr: 'شبكات الحاسب II', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IT231'], type: 'إجباري', departments: ['IT'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'IT332', nameEn: 'Data Communication', nameAr: 'اتصالات البيانات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IT231'], type: 'إجباري', departments: ['IT'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'IT342', nameEn: 'Digital Signal Processing', nameAr: 'معالجة الإشارات الرقمية', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IT341'], type: 'إجباري', departments: ['IT'], semester: 6, level: 3, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 4 — IT — SEMESTER 7
  // =========================================================
  { code: 'IT411', nameEn: 'Information and Computer Networks Security', nameAr: 'أمن المعلومات وشبكات الحاسب', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IT331'], type: 'إجباري', departments: ['IT'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT421', nameEn: 'Internet Programming and Protocols', nameAr: 'برمجة الإنترنت والبروتوكولات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IT231'], type: 'إجباري', departments: ['IT'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT443', nameEn: 'Embedded Systems', nameAr: 'الأنظمة المدمجة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IT'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT472', nameEn: 'Concurrency and Parallel Computing', nameAr: 'الحوسبة المتزامنة والمتوازية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: ['CS322'], type: 'اختياري', departments: ['IT'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT461', nameEn: 'Graduation Project (Part 1)', nameAr: 'مشروع التخرج (جزء أول)', credits: 3, teachingHoursLecture: 0, teachingHoursPractical: 3, prerequisites: [], type: 'إجباري', departments: ['IT'], semester: 7, level: 4, category: 'مشروع تخرج' },

  // =========================================================
  // LEVEL 4 — IT — SEMESTER 8
  // =========================================================
  { code: 'IT431', nameEn: 'Communication Technology', nameAr: 'تكنولوجيا الاتصالات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IT332'], type: 'إجباري', departments: ['IT'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT441', nameEn: 'Multimedia Mining', nameAr: 'تنقيب الوسائط المتعددة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['IT342'], type: 'إجباري', departments: ['IT'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT442', nameEn: 'Robotics', nameAr: 'علم الروبوت', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IT'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'CS456', nameEn: 'Digital Video Processing', nameAr: 'معالجة الفيديو الرقمي', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IT'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT412', nameEn: 'Cyber Security', nameAr: 'الأمن السيبراني', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IT'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'IT433', nameEn: 'Cloud Computing Networks', nameAr: 'شبكات الحوسبة السحابية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['IT'], semester: 8, level: 4, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 3 — AI — SEMESTER 5
  // =========================================================
  { code: 'MA301', nameEn: 'Probabilistic Reasoning', nameAr: 'التفكير الاحتمالي', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA222'], type: 'إجباري', departments: ['AI'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'AI321', nameEn: 'Computational Intelligence', nameAr: 'الذكاء الحسابي', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['CS211'], type: 'إجباري', departments: ['AI'], semester: 5, level: 3, category: 'متطلبات تخصص' },
  { code: 'AI312', nameEn: 'Data Science', nameAr: 'علم البيانات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA222'], type: 'إجباري', departments: ['AI'], semester: 5, level: 3, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 3 — AI — SEMESTER 6
  // =========================================================
  { code: 'AI311', nameEn: 'Data Analytics', nameAr: 'تحليل البيانات', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['AI312'], type: 'إجباري', departments: ['AI'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'MA302', nameEn: 'Linear and Integer Programming', nameAr: 'البرمجة الخطية والصحيحة', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['MA231','MA113'], type: 'إجباري', departments: ['AI'], semester: 6, level: 3, category: 'متطلبات تخصص' },
  { code: 'AI313', nameEn: 'Neural Networks', nameAr: 'الشبكات العصبية', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['AI301'], type: 'إجباري', departments: ['AI'], semester: 6, level: 3, category: 'متطلبات تخصص' },

  // =========================================================
  // LEVEL 4 — AI — SEMESTER 7
  // =========================================================
  { code: 'AI421', nameEn: 'Semantic Web and Ontology', nameAr: 'الويب الدلالي والأونطولوجيا', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['AI301','IS212'], type: 'إجباري', departments: ['AI'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI425', nameEn: 'Expert Systems', nameAr: 'الأنظمة الخبيرة', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['AI'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI412', nameEn: 'Data Visualization', nameAr: 'تصور البيانات', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: ['MA222','MA112'], type: 'اختياري', departments: ['AI'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI431', nameEn: 'AI Project Management', nameAr: 'إدارة مشروعات الذكاء الاصطناعي', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['AI'], semester: 7, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI434', nameEn: 'Graduation Project (Part 1)', nameAr: 'مشروع التخرج (جزء أول)', credits: 3, teachingHoursLecture: 0, teachingHoursPractical: 3, prerequisites: [], type: 'إجباري', departments: ['AI'], semester: 7, level: 4, category: 'مشروع تخرج' },

  // =========================================================
  // LEVEL 4 — AI — SEMESTER 8
  // =========================================================
  { code: 'AI411', nameEn: 'Deep Learning', nameAr: 'التعلم العميق', credits: 3, teachingHoursLecture: 2, teachingHoursPractical: 2, prerequisites: ['AI312','AI301'], type: 'إجباري', departments: ['AI'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI435', nameEn: 'Fuzzy Computing', nameAr: 'الحوسبة الضبابية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: ['MA121','MA113'], type: 'إجباري', departments: ['AI'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI426', nameEn: 'Evolutionary Computing', nameAr: 'الحوسبة التطورية', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['AI'], semester: 8, level: 4, category: 'متطلبات تخصص' },
  { code: 'AI432', nameEn: 'Internet of Things', nameAr: 'إنترنت الأشياء', credits: 3, teachingHoursLecture: 3, teachingHoursPractical: 0, prerequisites: [], type: 'اختياري', departments: ['AI'], semester: 8, level: 4, category: 'متطلبات تخصص' },
];

// Map department names to codes
function getDeptCode(department: string): 'CS' | 'IS' | 'IT' | 'AI' | null {
  if (department.includes('علوم الحاسب') || department.includes('CS')) return 'CS';
  if (department.includes('نظم المعلومات') || department.includes('IS')) return 'IS';
  if (department.includes('تكنولوجيا المعلومات') || department.includes('IT')) return 'IT';
  if (department.includes('الذكاء الاصطناعي') || department.includes('AI')) return 'AI';
  return null; // General/first year — no specialization yet
}

// Map level string to number
function getLevelNumber(level: string): 1 | 2 | 3 | 4 {
  if (level.includes('الأولى') || level.includes('أولى')) return 1;
  if (level.includes('الثانية') || level.includes('ثانية')) return 2;
  if (level.includes('الثالثة') || level.includes('ثالثة')) return 3;
  if (level.includes('الرابعة') || level.includes('رابعة')) return 4;
  return 1;
}

// Check if a student is eligible for a course based on their passed courses
function checkEligibility(courseCode: string, passedCourses: string[]): { eligible: boolean; missingPrereqs: string[] } {
  const course = CURRICULUM_DATABASE.find(c => c.code === courseCode);
  if (!course) return { eligible: false, missingPrereqs: [] };
  const missing = course.prerequisites.filter(p => !passedCourses.includes(p));
  return { eligible: missing.length === 0, missingPrereqs: missing };
}

// Get eligible courses for a student given their level, dept, semester, passed courses
function getEligibleCourses(
  levelNum: 1 | 2 | 3 | 4,
  semester: 1 | 2,  // 1 = odd (1,3,5,7), 2 = even (2,4,6,8)
  deptCode: 'CS' | 'IS' | 'IT' | 'AI' | null,
  passedCourses: string[]
): { course: CurriculumCourse; eligible: boolean; missingPrereqs: string[] }[] {
  // Calculate actual semester number
  const semesterNum = (levelNum - 1) * 2 + semester;

  // Get courses for this semester
  const semCourses = CURRICULUM_DATABASE.filter(c => {
    if (c.semester !== semesterNum) return false;
    // Filter by department
    if (levelNum >= 3 && deptCode) {
      return c.departments.includes(deptCode);
    }
    // Levels 1 & 2: all departments (common courses)
    return c.departments.length === 4 || levelNum <= 2;
  });

  return semCourses.map(course => {
    const { eligible, missingPrereqs } = checkEligibility(course.code, passedCourses);
    return { course, eligible, missingPrereqs };
  });
}

// Student override — admin can manually lock/unlock specific courses per student
interface StudentCourseOverride {
  studentSeat: string;
  courseCode: string;
  action: 'lock' | 'unlock';
  reason: string;
  overriddenAt: string;
}
let studentOverridesStore: StudentCourseOverride[] = [];

// Official In-Memory Database for Qena Faculty of Computers & Information (Bylaws Articles 2 & 3 & 25)
const DEPARTMENTS = [
  {
    id: 'cs',
    code: 'CS',
    name: 'قسم علوم الحاسب',
    nameEn: 'Computer Science (CS)',
    head: 'أ.د. عصام الدين فؤاد',
    description: 'يختص القسم بالأسس النظرية والتطبيقية للحوسبة، هندسة البرمجيات المعقدة، تصميم الخوارزميات المتقدمة، التعلم الآلي، ورؤية الحاسب والنظم الذكية.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (علوم الحاسب)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 42,
    creditHoursTotal: 144,
    labs: ['معمل الذكاء الاصطناعي والحوسبة المتقدمة', 'معمل الخوارزميات وهندسة البرمجيات', 'معمل معالجة الصور الرقمية والرؤية الحاسوبية', 'معمل الحوسبة السحابية والموزعة'],
    objectives: [
      'بناء برمجيات معقدة عالية الكفاءة والأمان والجودة وفق منهجيات هندسة البرمجيات الدولية',
      'تطوير وتطبيق نماذج الذكاء الاصطناعي والتعلم العميق لخدمة قضايا التنمية بصعيد مصر',
      'تأهيل الكوادر للمنافسة في مسابقات البرمجة العالمية ICPC وسوق العمل الدولي',
      'إجراء البحوث المتقدمة في النظم الذكية ومترجمات لغات البرمجة ونظم الحوسبة المتوازية'
    ],
    scientificFields: [
      'برمجة الحاسبات', 'لغات الحاسب ومترجماتها', 'هياكل البيانات', 'تحليل وتصميم الخوارزميات',
      'الخوارزميات الجينية', 'نظم تشغيل الحاسبات', 'بنية وتنظيم الحاسبات', 'تشفير وأمن البيانات',
      'ضغط البيانات', 'أمن الحاسب', 'هندسة البرمجيات', 'معالجة الصور الرقمية',
      'معالجة اللغات الطبيعية', 'رؤية الحاسب (Computer Vision)', 'الشبكات العصبية الاصطناعية',
      'الرسم بالحاسب والرسوميات', 'نظم الوكلاء المتعددة (Multi-Agent Systems)', 'نظم قواعد المعرفة',
      'المعالجة على التوازي والنظم الموزعة', 'الحوسبة السحابية (Cloud Computing)', 'نظم التعلم الذكية',
      'تعليم الحاسبات', 'التعرف على النماذج', 'تعريب الحاسبات', 'النمذجة والمحاكاة ثنائية وثلاثية الأبعاد'
    ],
    hoursBreakdown: { general: 15, collegeMathBasic: 27, collegeCSBasic: 36, specializationCompulsory: 39, specializationElective: 18, graduationProject: 6, fieldTraining: 3 }
  },
  {
    id: 'it',
    code: 'IT',
    name: 'قسم تكنولوجيا المعلومات',
    nameEn: 'Information Technology (IT)',
    head: 'د. وليد البصيلي',
    description: 'يغطي شبكات الحاسب المتقدمة، اتصالات البيانات، إنترنت الأشياء (IoT)، الأمن السيبراني واختبار الاختراق، ومعالجة الإشارات والوسائط المتعددة.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (تكنولوجيا المعلومات)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 40,
    creditHoursTotal: 144,
    labs: ['معمل شبكات سيسكو Cisco المتطورة', 'معمل الأمن السيبراني واختبار الاختراق', 'معمل إنترنت الأشياء والمتحكمات الدقيقة', 'معمل معالجة الإشارات والوسائط المتعددة'],
    objectives: [
      'تصميم وإدارة الشبكات السلكية واللاسلكية المعقدة وحماية البنية التحتية الرقمية',
      'مكافحة التهديدات السيبرانية وتطبيق معايير التشفير والأمان المتقدمة',
      'بناء حلول الأنظمة المدمجة وإنترنت الأشياء والمدن الذكية',
      'تحليل ومعالجة إشارات الاتصالات الرقمية والوسائط المتعددة'
    ],
    scientificFields: [
      'شبكات الحاسبات بأنواعها المختلفة', 'شبكات المعلومات وتطبيقاتها', 'تكنولوجيا الاتصالات',
      'تكنولوجيا الإنترنت', 'بروتوكولات وبرمجة الإنترنت', 'تأمين وسرية المعلومات والشبكات',
      'معالجة الإشارات الرقمية (DSP)', 'نظم الزمن الحقيقي', 'النظم الرقمية', 'عمارة الحاسبات والمعالجات',
      'المعالجات الدقيقة وتطبيقاتها', 'الأنظمة المدمجة (Embedded Systems)', 'الحاسبات الذكية والكمية',
      'نظم الحاسبات ذات الأعطال المحتملة', 'نظم الحاسبات الموزعة والمتوازية', 'الأمن السيبراني والدفاع الرقمي',
      'النظم الديناميكية والإنسان الآلي', 'التعلم الإلكتروني', 'المكتبات الرقمية', 'الأعمال والتجارة الإلكترونية'
    ],
    hoursBreakdown: { general: 15, collegeMathBasic: 27, collegeCSBasic: 36, specializationCompulsory: 39, specializationElective: 18, graduationProject: 6, fieldTraining: 3 }
  },
  {
    id: 'is',
    code: 'IS',
    name: 'قسم نظم المعلومات',
    nameEn: 'Information Systems (IS)',
    head: 'أ.د. منال عبد الستار',
    description: 'يركز على تحليل وتصميم نظم المعلومات المؤسسية، إدارة قواعد البيانات الضخمة، ذكاء الأعمال، التنقيب في البيانات، وإدارة العمليات التجارية.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (نظم المعلومات)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 39,
    creditHoursTotal: 144,
    labs: ['معمل قواعد البيانات الضخمة والنظم الموزعة', 'معمل ذكاء الأعمال وتحليل البيانات', 'معمل نظم المعلومات المؤسسية والـ ERP', 'معمل هندسة النظم السحابية'],
    objectives: [
      'تطوير نظم معلومات مؤسسية لدعم اتخاذ القرارات في المؤسسات الحكومية والخاصة',
      'إدارة وتنقيب البيانات الضخمة واستخراج المعرفة من مستودعات البيانات',
      'حوكمة أمن المعلومات وضمان جودة البرمجيات والأنظمة الحيوية',
      'قيادة مشروعات التحول الرقمي وتصميم الحلول المبنية على الويب'
    ],
    scientificFields: [
      'تحليل وتصميم نظم المعلومات', 'منهجيات تطوير نظم المعلومات', 'معماريات نظم المعلومات (Enterprise Architecture)',
      'نظم تخزين واسترجاع المعلومات', 'نظم قواعد البيانات المتقدمة', 'نظم المعلومات الذكية',
      'نظم معلومات الوسائط المتعددة', 'نظم المعلومات الموزعة', 'هندسة المعلومات',
      'اكتشاف المعرفة في قواعد البيانات', 'قواعد البيانات الشيئية', 'اقتصاديات نظم المعلومات',
      'التنقيب في البيانات (Data Mining)', 'مستودعات البيانات (Data Warehousing)', 'إدارة مراكز المعلومات',
      'نظم المعلومات المتكاملة', 'نظم المعلومات الحيوية (Bioinformatics)', 'نظم البيانات كبيرة الحجم (Big Data)',
      'تأكيد جودة البرمجيات ونظم المعلومات', 'تطبيقات نظم المعلومات في المجالات الحيوية'
    ],
    hoursBreakdown: { general: 15, collegeMathBasic: 27, collegeCSBasic: 36, specializationCompulsory: 39, specializationElective: 18, graduationProject: 6, fieldTraining: 3 }
  },
  {
    id: 'ai',
    code: 'AI',
    name: 'قسم الذكاء الاصطناعي',
    nameEn: 'Artificial Intelligence (AI)',
    head: 'د. خالد الدندراوي',
    description: 'يختص القسم بتعلم الآلة، التعلم العميق، الروبوتات الذكية، معالجة اللغات الطبيعية، الرؤية الحاسوبية، والأنظمة الخبيرة لخدمة الثورة الصناعية الرابعة.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (الذكاء الاصطناعي)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 38,
    creditHoursTotal: 144,
    labs: ['معمل الحوسبة فائقة الأداء HPC للذكاء الاصطناعي', 'معمل الروبوتات والأنظمة الذاتية المستقلة', 'معمل معالجة اللغات الطبيعية واللهجات العربية', 'معمل الرؤية الحاسوبية والواقع الافتراضي'],
    objectives: [
      'بناء خوارزميات الذكاء الاصطناعي المتقدمة ونماذج التعلم العميق عالية الكفاءة',
      'تطوير حلول ذكية لمعالجة اللغة العربية ولهجات صعيد مصر والرعاية الصحية والزراعة الدقيقة',
      'تصميم الروبوتات الذكية والأنظمة الذاتية والواقع الافتراضي والمعزز',
      'تأهيل المتخصصين لقيادة التحول في تطبيقات الثورة الصناعية الرابعة وعلم البيانات'
    ],
    scientificFields: [
      'أساسيات وأدوات الذكاء الاصطناعي', 'القدرة على التعلم والاستنتاج ورد الفعل', 'دراسة وتصميم العملاء الأذكياء',
      'نظم الذكاء الاصطناعي التوليدي', 'محاكاة الإدراك البشري', 'النظم الخبيرة (Expert Systems)',
      'علم البيانات التطبيقية (Data Science)', 'تعلم الآلة (Machine Learning)', 'الأنظمة الذكية والمستقلة',
      'المنطق الرياضي للحوسبة', 'نظرية التحكم والأنظمة', 'إثبات النظريات آلياً',
      'علم الروبوت (Robotics)', 'الواقع الافتراضي والمعزز (VR/AR)', 'الوسائط المتعددة التفاعلية',
      'التصوير ثلاثي الأبعاد والرؤية', 'تفاعل الإنسان والحاسب (HCI)', 'طرق اتصال الإنسان بالحاسب',
      'تمثيل المعارف آلياً (Knowledge Representation)', 'التعليم والتعلم باستخدام الذكاء الاصطناعي',
      'الويب الدلالي والأونطولوجيا', 'الحوسبة التطورية والضبابية'
    ],
    hoursBreakdown: { general: 15, collegeMathBasic: 27, collegeCSBasic: 36, specializationCompulsory: 39, specializationElective: 18, graduationProject: 6, fieldTraining: 3 }
  }
];


let studentsStore: StudentRecord[] = [
  {
    seatNumber: '1042',
    nationalId: '30205122700145',
    name: 'أحمد محمود قناوي عبد الرحيم',
    level: 'الفرقة الرابعة',
    department: 'علوم الحاسب (CS)',
    academicAdvisor: 'أ.د. عصام الدين فؤاد',
    cgpa: 3.86,
    totalCredits: 132,
    status: 'مقيد - منتظم (ممتاز مع مرتبة الشرف)',
    examHall: 'مدرج 2 - الدور الثالث',
    seatLocation: 'الصف B - مقعد 14',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    courses: [
      // Level 1 passed
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A', points: 4.0, score: 90, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'A', points: 4.0, score: 92, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'A', points: 3.7, score: 89, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'A-', points: 3.5, score: 86, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'HU132', name: 'الكتابة التقنية', credits: 2, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS141', name: 'أساسيات البرمجة', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'MA112', name: 'الهياكل المتقطعة', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'MA121', name: 'الاحتمالات والإحصاء I', credits: 3, grade: 'A-', points: 3.5, score: 88, status: 'ناجح' },
      { code: 'MA113', name: 'رياضيات II', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'HU112', name: 'اللغة الإنجليزية II', credits: 2, grade: 'A', points: 3.7, score: 89, status: 'ناجح' },
      // Level 2 passed
      { code: 'MA222', name: 'الاحتمالات والإحصاء II', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'CS241', name: 'البرمجة كائنية التوجه', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'IT231', name: 'شبكات الحاسب I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'MA231', name: 'بحوث العمليات', credits: 3, grade: 'B+', points: 3.2, score: 83, status: 'ناجح' },
      { code: 'EE201', name: 'التصميم المنطقي', credits: 3, grade: 'A-', points: 3.5, score: 87, status: 'ناجح' },
      { code: 'IS221', name: 'إدارة المشروعات', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'IS212', name: 'تكنولوجيا الويب', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'CS211', name: 'هياكل البيانات I', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'CS291', name: 'النمذجة والمحاكاة', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'PH201', name: 'فيزياء', credits: 3, grade: 'B+', points: 3.2, score: 84, status: 'ناجح' },
      { code: 'IS211', name: 'قواعد البيانات', credits: 3, grade: 'A', points: 3.7, score: 94, status: 'ناجح' },
      { code: 'CS242', name: 'البرمجة المتوازية', credits: 3, grade: 'A-', points: 3.5, score: 88, status: 'ناجح' },
      // Level 3 CS passed
      { code: 'CS312', name: 'هياكل البيانات II', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'CS352', name: 'معالجة الصور', credits: 3, grade: 'A+', points: 4.0, score: 95, status: 'ناجح' },
      { code: 'CS391', name: 'هندسة البرمجيات', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'AI301', name: 'الذكاء الاصطناعي', credits: 3, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'CS321', name: 'نظم التشغيل I', credits: 3, grade: 'A-', points: 3.5, score: 87, status: 'ناجح' },
      { code: 'CS311', name: 'تحليل وتصميم الخوارزميات', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'CS341', name: 'مفاهيم لغات البرمجة', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'CS351', name: 'رسوميات الحاسب I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS331', name: 'البرمجة المرئية', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'CS322', name: 'معمارية وتنظيم الحاسبات', credits: 3, grade: 'A-', points: 3.5, score: 88, status: 'ناجح' },
      { code: 'IT302', name: 'التشفير', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'TR301', name: 'التدريب الميداني', credits: 3, grade: 'A+', points: 4.0, score: 99, status: 'ناجح' }
    ]
  },
  {
    seatNumber: '2058',
    nationalId: '30308142700892',
    name: 'فاطمة علي حسن النجار',
    level: 'الفرقة الثالثة',
    department: 'نظم المعلومات (IS)',
    academicAdvisor: 'أ.د. منال عبد الستار',
    cgpa: 3.68,
    totalCredits: 96,
    status: 'مقيد - منتظم (جيد جداً مرتفع)',
    examHall: 'مدرج 1 - الدور الأرضي',
    seatLocation: 'الصف D - مقعد 08',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    courses: [
      // Level 1 passed
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A', points: 4.0, score: 92, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'A', points: 4.0, score: 90, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'B+', points: 3.3, score: 84, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'B', points: 3.0, score: 79, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A', points: 3.7, score: 89, status: 'ناجح' },
      { code: 'HU132', name: 'الكتابة التقنية', credits: 2, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS141', name: 'أساسيات البرمجة', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'MA112', name: 'الهياكل المتقطعة', credits: 3, grade: 'B+', points: 3.3, score: 83, status: 'ناجح' },
      { code: 'MA121', name: 'الاحتمالات والإحصاء I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'MA113', name: 'رياضيات II', credits: 3, grade: 'B+', points: 3.3, score: 85, status: 'ناجح' },
      // Level 2 passed
      { code: 'MA222', name: 'الاحتمالات والإحصاء II', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS241', name: 'البرمجة كائنية التوجه', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'IT231', name: 'شبكات الحاسب I', credits: 3, grade: 'B+', points: 3.3, score: 84, status: 'ناجح' },
      { code: 'MA231', name: 'بحوث العمليات', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'EE201', name: 'التصميم المنطقي', credits: 3, grade: 'B+', points: 3.3, score: 83, status: 'ناجح' },
      { code: 'IS221', name: 'إدارة المشروعات', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'IS212', name: 'تكنولوجيا الويب', credits: 3, grade: 'A', points: 3.7, score: 94, status: 'ناجح' },
      { code: 'CS211', name: 'هياكل البيانات I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS291', name: 'النمذجة والمحاكاة', credits: 3, grade: 'B+', points: 3.3, score: 85, status: 'ناجح' },
      { code: 'PH201', name: 'فيزياء', credits: 3, grade: 'B', points: 3.0, score: 78, status: 'ناجح' },
      { code: 'IS211', name: 'قواعد البيانات', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'CS242', name: 'البرمجة المتوازية', credits: 3, grade: 'B+', points: 3.3, score: 84, status: 'ناجح' }
    ]
  },
  {
    seatNumber: '3120',
    nationalId: '30402192701123',
    name: 'عبد الله محمد عبد الباسط الصاوي',
    level: 'الفرقة الثانية',
    department: 'المرحلة العامة (General)',
    academicAdvisor: 'د. خالد الدندراوي',
    cgpa: 3.92,
    totalCredits: 64,
    status: 'مقيد - منتظم (امتياز)',
    examHall: 'قاعة 3B - مبنى المعامل المركزية',
    seatLocation: 'الصف A - مقعد 03',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    courses: [
      // Level 1 passed
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'A+', points: 4.0, score: 99, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A+', points: 4.0, score: 100, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'HU132', name: 'الكتابة التقنية', credits: 2, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'CS141', name: 'أساسيات البرمجة', credits: 3, grade: 'A+', points: 4.0, score: 99, status: 'ناجح' },
      { code: 'MA112', name: 'الهياكل المتقطعة', credits: 3, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'MA121', name: 'الاحتمالات والإحصاء I', credits: 3, grade: 'A', points: 3.7, score: 94, status: 'ناجح' },
      { code: 'MA113', name: 'رياضيات II', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'HU112', name: 'اللغة الإنجليزية II', credits: 2, grade: 'A', points: 3.7, score: 91, status: 'ناجح' }
    ]
  },
  {
    seatNumber: '4015',
    nationalId: '30501102700388',
    name: 'سارة إبراهيم محمد الدندراوي',
    level: 'الفرقة الأولى',
    department: 'المرحلة العامة (General)',
    academicAdvisor: 'د. مصطفى عبد اللطيف',
    cgpa: 3.55,
    totalCredits: 32,
    status: 'مقيد - منتظم (جيد جداً)',
    examHall: 'مدرج 3 - الدور الثاني',
    seatLocation: 'الصف C - مقعد 21',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    courses: [
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'B+', points: 3.3, score: 83, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'A-', points: 3.5, score: 86, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'B', points: 3.0, score: 78, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A+', points: 4.0, score: 95, status: 'ناجح' }
    ]
  }
];

let schedulesStore = [
  {
    level: 'الفرقة الأولى',
    department: 'المرحلة العامة',
    day: 'الأحد',
    items: [
      { time: '08:30 - 10:15', title: 'مقدمة في البرمجة (Python)', type: 'محاضرة', instructor: 'د. أحمد رشوان', hall: 'مدرج 1 الرئيسي' },
      { time: '10:30 - 12:15', title: 'تفاضل وتكامل (Calculus I)', type: 'محاضرة', instructor: 'د. يوسف البدري', hall: 'مدرج 1 الرئيسي' },
      { time: '12:45 - 02:30', title: 'معمل بايثون والبرمجة الإجرائية', type: 'سكشن عملي', instructor: 'م. كريم الشريف', hall: 'معمل C2 الحاسبات' }
    ]
  },
  {
    level: 'الفرقة الأولى',
    department: 'المرحلة العامة',
    day: 'الاثنين',
    items: [
      { time: '09:00 - 10:45', title: 'الرياضيات المتقطعة (Discrete Math)', type: 'محاضرة', instructor: 'أ.د. عصام الدين فؤاد', hall: 'مدرج 2' },
      { time: '11:00 - 01:00', title: 'معمل الدوائر المنطقية الرقمية', type: 'سكشن عملي', instructor: 'م. مروة حسني', hall: 'معمل المنطق الرقمي' }
    ]
  },
  {
    level: 'الفرقة الثانية',
    department: 'علوم الحاسب / الذكاء الاصطناعي',
    day: 'الأحد',
    items: [
      { time: '08:30 - 10:15', title: 'هياكل البيانات والخوارزميات (Data Structures)', type: 'محاضرة', instructor: 'د. مصطفى عبد اللطيف', hall: 'مدرج 3' },
      { time: '10:30 - 12:30', title: 'تطبيق عملي: C++ Data Structures', type: 'سكشن عملي', instructor: 'م. عمر طارق', hall: 'معمل الخوارزميات B1' },
      { time: '01:00 - 02:45', title: 'معمارية الحاسبات ولغة الأسمبلي', type: 'محاضرة', instructor: 'د. حسام السمان', hall: 'مدرج 3' }
    ]
  },
  {
    level: 'الفرقة الثالثة',
    department: 'نظم المعلومات',
    day: 'الثلاثاء',
    items: [
      { time: '09:00 - 10:45', title: 'قواعد البيانات المتقدمة وإدارة المعاملات', type: 'محاضرة', instructor: 'أ.د. منال عبد الستار', hall: 'قاعة السمينار 4' },
      { time: '11:00 - 01:00', title: 'مشروع عملي: SQL Server & PostgreSQL Tuning', type: 'سكشن عملي', instructor: 'م. ريهام الصغير', hall: 'معمل قواعد البيانات' }
    ]
  },
  {
    level: 'الفرقة الرابعة',
    department: 'علوم الحاسب',
    day: 'الأربعاء',
    items: [
      { time: '08:30 - 10:30', title: 'التعلم العميق ومعالجة الصور المتقدمة', type: 'محاضرة', instructor: 'د. خالد الدندراوي', hall: 'مدرج 2' },
      { time: '11:00 - 02:00', title: 'جلسة متابعة وتقييم مشاريع التخرج', type: 'حلقة نقاشية', instructor: 'لجنة الإشراف الأكاديمي', hall: 'قاعة مؤتمرات الكلية' }
    ]
  }
];

let projectsStore: ProjectRecord[] = [
  {
    id: 'proj-01',
    title: 'نظام الري الذكي والتنبؤ بآفات المحاصيل لمزارع صعيد مصر بالذكاء الاصطناعي',
    titleEn: 'AgriSense Qena: AI-Powered Precision Irrigation & Crop Disease Detection',
    department: 'علوم الحاسب والذكاء الاصطناعي',
    year: '2025/2026',
    supervisor: 'أ.د. عصام الدين فؤاد & د. خالد الدندراوي',
    teamMembers: ['أحمد محمود قناوي', 'مصطفى كمال الدين', 'آية محمود عبد العزيز', 'محمود حساني'],
    description: 'منظومة متكاملة لربط محطات استشعار إنترنت الأشياء بنماذج رؤية حاسوبية (YOLOv11 & Vision Transformers) لفحص أوراق قصب السكر والقمح وتحديد الري المتغير لترشيد 35% من مياه الري.',
    technologies: ['PyTorch', 'TensorFlow Lite', 'ESP32 IoT', 'React Native', 'FastAPI'],
    likes: 148,
    awards: 'المركز الأول في هاكاثون الابتكار الزراعي لجامعات جنوب الصعيد 2026',
    status: 'مكتمل'
  },
  {
    id: 'proj-02',
    title: 'منصة ترياج وتشخيص الطوارئ بالمستشفيات الجامعية بقنا عبر الرؤية والنماذج اللغوية',
    titleEn: 'QenaMed-Triage: Multimodal Clinical Emergency Assistant',
    department: 'نظم المعلومات الطبية',
    year: '2025/2026',
    supervisor: 'أ.د. منال عبد الستار',
    teamMembers: ['فاطمة علي حسن', 'عبد الرحمن ممدوح', 'نورهان عادل الجبلاوي', 'عمر إبراهيم'],
    description: 'نظام طبي سحابي يستقبل بيانات وأشعة المرضى في قسم الاستقبال والطوارئ لترتيب أولويات العلاج (Manchester Triage System) مع تلخيص السجل الصوتي للأطباء.',
    technologies: ['FastAPI', 'DICOM Processing', 'Gemini Med-Vision', 'PostgreSQL', 'Docker'],
    likes: 112,
    awards: 'ترشيح رسمي للاحتضان بمسرعة الأعمال الجامعية SVU Hub',
    status: 'مكتمل'
  },
  {
    id: 'proj-03',
    title: 'نظام حماية أمني وكشف الهجمات السيبرانية لشبكات الكهرباء الإقليمية بقنا',
    titleEn: 'SmartGrid-Shield: Deep Learning IDS for SCADA Regional Infrastructure',
    department: 'تكنولوجيا المعلومات والشبكات',
    year: '2025/2026',
    supervisor: 'د. وليد البصيلي',
    teamMembers: ['محمود خضري أحمد', 'سارة جمال الدين', 'زياد حجاجي', 'هند علي'],
    description: 'حل سيبراني يحلل تدفقات حزم الشبكة في محطات التوزيع الكهربائي للكشف في أجزاء من الثانية عن هجمات الاستغلال وانتحال بروتوكولات Modbus/IEC-60870.',
    technologies: ['Suricata IDS', 'Graph Neural Networks', 'Python', 'Kafka', 'Grafana'],
    likes: 95,
    status: 'مكتمل'
  },
  {
    id: 'proj-04',
    title: 'روبوت مسح وأرشفة المخطوطات والوثائق الأثرية بصعيد مصر بتقنية SLAM',
    titleEn: 'Heritage-Bot: Autonomous Robotic 3D Scanner for Upper Egypt Archives',
    department: 'الذكاء الاصطناعي والميكاترونكس البرمجية',
    year: '2025/2026',
    supervisor: 'د. خالد الدندراوي',
    teamMembers: ['عبد الله الصاوي', 'إبراهيم النوبي', 'ياسمين مدحت', 'محمد العوامي'],
    description: 'عربة ذاتية الحركة مزودة بحساسات LiDAR وكاميرات عمق ثلاثية الأبعاد للتنقل الآمن في مباني الآثار والمكتبات وأرشفة الوثائق بجودة فائقة دون إشعاعات ضارة.',
    technologies: ['ROS 2', 'LiDAR SLAM', 'Point Cloud Library', 'Computer Vision', 'Jetson Orin'],
    likes: 134,
    awards: 'درع التميز في معرض بحوث الشباب التكنولوجي 2026',
    status: 'قيد التنفيذ'
  }
];

let announcementsStore = [
  {
    id: 'ann-1',
    title: 'فتح باب تسجيل رغبات الأقسام التخصصية للفرقة الثانية للعام الجامعي 2026',
    category: 'شؤون التعليم والطلاب',
    date: '12 نوفمبر 2026',
    summary: 'تعلن الكلية عن فتح استمارة الرغبات الإلكترونية للالتحاق بأقسام (علوم الحاسب - نظم المعلومات - تكنولوجيا المعلومات - برنامج الذكاء الاصطناعي) عبر المنصة.',
    important: true
  },
  {
    id: 'ann-2',
    title: 'انطلاق معسكر التدريب لمسابقة البرمجة الجامعية ICPC Qena 2026/2027',
    category: 'الأنشطة والمسابقات',
    date: '10 نوفمبر 2026',
    summary: 'ينظم النادي التكنولوجي للكلية جلسات تدريب مكثفة على حل المسائل الحسابية المتقدمة بالتعاون مع مدربي مجتمع حل المشكلات بجامعة جنوب الوادي.',
    important: false
  },
  {
    id: 'ann-3',
    title: 'إعلان جدول امتحانات منتصف الفصل الدراسي الأول (Midterm) لجميع الفرق',
    category: 'الجداول والامتحانات',
    date: '08 نوفمبر 2026',
    summary: 'تم نشر جداول الميدتيرم وأرقام الجلوس وأماكن اللجان. يرجى من جميع الطلاب مراجعة قاعات الامتحانات والالتزام بالتعليمات الاحترازية.',
    important: true
  },
  {
    id: 'ann-4',
    title: 'ورشة عمل مجانية حول تقنيات النماذج التوليدية ونشر النظم السحابية',
    category: 'التدريب والتطوير',
    date: '05 نوفمبر 2026',
    summary: 'بالتعاون مع كبرى شركات التكنولوجيا العالمية، تقام ورشة تطبيقية لطلاب الفرقتين الثالثة والرابعة في مدرج 1 المركزي.',
    important: false
  }
];

const STAFF_MEMBERS = [
  {
    name: 'أ.د. عصام الدين فؤاد محمد',
    role: 'عميد الكلية وأستاذ علوم الحاسب ورؤية الآلة',
    department: 'علوم الحاسب',
    email: 'dean.fci@svu.edu.eg',
    office: 'مبنى الإدارة - الدور الثاني - مكتب 201',
    officeHours: 'الأحد والثلاثاء: 11:00 ص - 01:00 م',
    research: 'Machine Learning, Computer Vision, Pattern Recognition, Remote Sensing.'
  },
  {
    name: 'أ.د. منال عبد الستار أحمد',
    role: 'وكيل الكلية لشؤون التعليم والطلاب وأستاذ نظم المعلومات',
    department: 'نظم المعلومات',
    email: 'vicedean.students@svu.edu.eg',
    office: 'مبنى الإدارة - الدور الأول - مكتب 104',
    officeHours: 'الاثنين والأربعاء: 10:00 ص - 12:00 م',
    research: 'Big Data Management, Health Informatics, Enterprise Database Architecture.'
  },
  {
    name: 'د. وليد البصيلي إبراهيم',
    role: 'رئيس قسم تكنولوجيا المعلومات وأستاذ مساعد الشبكات والأمن السيبراني',
    department: 'تكنولوجيا المعلومات',
    email: 'w.baseely@svu.edu.eg',
    office: 'مبنى المعامل - الدور الثالث - مكتب 312',
    officeHours: 'الأحد والخميس: 12:00 م - 02:00 م',
    research: 'Cybersecurity, Intrusion Detection, IoT Security, Software-Defined Networks.'
  },
  {
    name: 'د. خالد الدندراوي عبد اللاه',
    role: 'منسق برنامج الذكاء الاصطناعي التطبيقي وأستاذ مساعد النظم الذكية',
    department: 'الذكاء الاصطناعي',
    email: 'k.dandarawy@svu.edu.eg',
    office: 'مبنى المعامل - الدور الثاني - مكتب 215',
    officeHours: 'الاثنين والثلاثاء: 01:00 م - 03:00 م',
    research: 'Deep Learning, Robotics, Arabic Natural Language Processing, Autonomous Systems.'
  },
  {
    name: 'د. مصطفى عبد اللطيف قاسم',
    role: 'مدرس علوم الحاسب وهياكل البيانات',
    department: 'علوم الحاسب',
    email: 'm.kassem@svu.edu.eg',
    office: 'مبنى المعامل - الدور الرابع - مكتب 405',
    officeHours: 'الأحد والأربعاء: 10:00 ص - 12:00 م',
    research: 'Graph Algorithms, High Performance Computing, Combinatorial Optimization.'
  }
];

// Student service requests submitted online
let studentRequestsStore: StudentServiceRequest[] = [
  {
    id: 'req-1',
    referenceNumber: 'SVU-FCI-2026-9041',
    studentName: 'أحمد محمود قناوي عبد الرحيم',
    seatNumber: '1042',
    nationalId: '30205122700145',
    level: 'الفرقة الرابعة',
    department: 'علوم الحاسب',
    requestType: 'بيان درجات باللغتين العربية والإنجليزية',
    details: 'مطلوب لتقديمه للتدريب الأكاديمي الدولي في منحة الحوسبة السحابية.',
    status: 'جاهز للاستلام',
    submittedAt: '09 نوفمبر 2026'
  },
  {
    id: 'req-2',
    referenceNumber: 'SVU-FCI-2026-9042',
    studentName: 'فاطمة علي حسن النجار',
    seatNumber: '2058',
    nationalId: '30308142700892',
    level: 'الفرقة الثالثة',
    department: 'نظم المعلومات',
    requestType: 'إفادة قيد رسمية موجهة لوزارة الاتصالات',
    details: 'للتسجيل في مبادرة رواد مصر الرقمية DEPI.',
    status: 'تم التدقيق',
    submittedAt: '11 نوفمبر 2026'
  }
];

let facultyInquiriesStore: FacultyInquiry[] = [
  {
    id: 'inq-101',
    trackingCode: 'INQ-SVU-2026-1184',
    studentName: 'أحمد محمود قناوي عبد الرحيم',
    seatNumber: '1042',
    email: 'ahmed.qenawi@student.svu.edu.eg',
    phone: '01012345678',
    level: 'الفرقة الرابعة',
    department: 'علوم الحاسب',
    recipientDepartment: 'مكتب عميد الكلية',
    messageType: 'مقترح تطوير',
    priority: 'عادي',
    subject: 'مقترح تمديد ساعات العمل بمعمل الذكاء الاصطناعي خلال فترة مشاريع التخرج',
    content: 'نرجو من سيادتكم التكرم بالموافقة على فتح معمل الذكاء الاصطناعي والحوسبة الفائقة حتى الساعة 6:00 مساءً يومياً لتمكين فرق مشاريع التخرج من تدريب النماذج العصبية وإجراء التجارب المعملية.',
    status: 'تم الرد والاعتماد',
    officialResponse: {
      responderName: 'أ.د. عصام الدين فؤاد محمد',
      responderRole: 'عميد الكلية',
      responseText: 'تمت دراسة المقترح والموافقة الكريمة عليه، وجرى التنسيق مع مشرف المعامل وإدارة أمن الكلية لفتح معمل الذكاء الاصطناعي يومياً حتى السادسة مساءً طوال الفصل الدراسي الثاني مع تواجد المعيد النوبتجي.',
      respondedAt: '11 نوفمبر 2026'
    },
    submittedAt: '08 نوفمبر 2026'
  },
  {
    id: 'inq-102',
    trackingCode: 'INQ-SVU-2026-1195',
    studentName: 'فاطمة علي حسن النجار',
    seatNumber: '2058',
    email: 'fatma.naggar@student.svu.edu.eg',
    phone: '01198765432',
    level: 'الفرقة الثالثة',
    department: 'نظم المعلومات',
    recipientDepartment: 'وحدة الإرشاد الأكاديمي والتدريب الصيفي',
    messageType: 'استفسار أكاديمي',
    priority: 'عاجل',
    subject: 'استفسار عن اعتماد شهادات التدريب الصيفي من الشركات التكنولوجية المعتمدة',
    content: 'هل تحتسب شهادة إتمام التدريب العملي في الحوسبة السحابية من منصة رواد مصر الرقمية DEPI ضمن ساعات التدريب الصيفي الإلزامية بلائحة الساعات المعتمدة للكلية؟',
    status: 'تم الرد والاعتماد',
    officialResponse: {
      responderName: 'أ.د. منال عبد الستار أحمد',
      responderRole: 'وكيل الكلية لشؤون التعليم والطلاب',
      responseText: 'نعم، مبادرة DEPI معتمدة رسمياً بقرار مجلس الكلية وتعادل متطلب التدريب الميداني الصيفي للفرقتين الثانية والثالثة شريطة تسليم التقرير الفني المعتمد لشؤون الطلاب.',
      respondedAt: '12 نوفمبر 2026'
    },
    submittedAt: '10 نوفمبر 2026'
  }
];

let messagesStore: ChatMessage[] = [
  {
    id: 'msg-1',
    senderSeat: '1042',
    senderName: 'أحمد محمود قناوي عبد الرحيم',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    receiverSeat: '2058',
    receiverName: 'فاطمة علي حسن النجار',
    content: 'السلام عليكم يا فاطمة، هل حددتم موعد تسليم تقرير مشروع التخرج للجنة الإشراف؟',
    timestamp: '10:30 ص',
    read: true
  },
  {
    id: 'msg-2',
    senderSeat: '2058',
    senderName: 'فاطمة علي حسن النجار',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    receiverSeat: '1042',
    receiverName: 'أحمد محمود قناوي عبد الرحيم',
    content: 'وعليكم السلام يا أحمد، أ.د. منال حددت يوم الثلاثاء القادم الساعة 11 صباحاً بمعمل النظم.',
    timestamp: '10:35 ص',
    read: true
  },
  {
    id: 'msg-3',
    senderSeat: '3120',
    senderName: 'عبد الله محمد عبد الباسط الصاوي',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    receiverSeat: '1042',
    receiverName: 'أحمد محمود قناوي عبد الرحيم',
    content: 'يا بشمهندس أحمد، معسكر تدريب ICPC Qena هيبدأ السبت الجاي في معمل B1 إن شاء الله.',
    timestamp: '11:15 ص',
    read: false
  }
];

async function startServer() {
  
const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // --- API Endpoints ---

  // Health and faculty stats
  app.get('/api/faculty/stats', (_req: Request, res: Response) => {
    res.json({
      university: 'جامعة جنوب الوادي بقنا',
      faculty: 'كلية الحاسبات والمعلومات والذكاء الاصطناعي',
      dean: 'أ.د. عصام الدين فؤاد محمد',
      stats: {
        totalStudents: 1420,
        departmentsCount: 4,
        facultyStaff: 58,
        activeResearchLabs: 11,
        completedGradProjects: 310,
        icpcTeamsQualified: 14,
        establishedYear: 2006
      }
    });
  });

  // Departments
  app.get('/api/departments', (_req: Request, res: Response) => {
    res.json(DEPARTMENTS);
  });

  // Admin Authentication (Password: 1234)
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (password === '1234') {
      return res.json({
        success: true,
        token: 'fci-qena-admin-session-active',
        message: 'تم تسجيل الدخول إلى لوحة إدارة الأخبار بنجاح'
      });
    }
    return res.status(401).json({
      error: 'كلمة المرور غير صحيحة. كلمة المرور الصحيحة هي 1234'
    });
  });

  // Student Authentication (Name or Seat Number + National ID as password)
  app.post('/api/students/login', (req: Request, res: Response) => {
    const { identifier, nationalId } = req.body;
    if (!identifier || !nationalId) {
      return res.status(400).json({ error: 'يرجى إدخال اسم الطالب أو رقم الجلوس، والرقم القومي ككلمة مرور' });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanNat = String(nationalId).trim();

    const student = studentsStore.find(s =>
      (s.seatNumber.toLowerCase() === cleanId || s.name.toLowerCase().includes(cleanId)) &&
      s.nationalId === cleanNat
    );

    if (!student) {
      return res.status(401).json({
        error: 'بيانات الدخول غير صحيحة. كلمة المرور هي رقمك القومي (14 رقم).'
      });
    }

    res.json({
      success: true,
      token: `fci-token-${student.seatNumber}`,
      student
    });
  });

  // Student Directory for Chat & Messaging
  app.get('/api/students/directory', (_req: Request, res: Response) => {
    const list = studentsStore.map(s => ({
      seatNumber: s.seatNumber,
      name: s.name,
      level: s.level,
      department: s.department,
      avatar: s.avatar || ''
    }));
    res.json(list);
  });

  // Update Student Avatar
  app.put('/api/students/:seatNumber/avatar', (req: Request, res: Response) => {
    const { seatNumber } = req.params;
    const { avatar } = req.body;

    const student = studentsStore.find(s => s.seatNumber === seatNumber);
    if (!student) {
      return res.status(404).json({ error: 'الطالب غير موجود' });
    }

    student.avatar = avatar;
    messagesStore.forEach(m => {
      if (m.senderSeat === seatNumber) m.senderAvatar = avatar;
    });

    res.json({ success: true, message: 'تم تحديث الصورة الشخصية بنجاح', student });
  });

  // Chat Messages: Get
  app.get('/api/messages', (req: Request, res: Response) => {
    const { seatNumber, withSeat } = req.query;
    if (!seatNumber) {
      return res.status(400).json({ error: 'رقم جلوس الطالب مطلوب' });
    }

    const userSeat = String(seatNumber);
    if (withSeat) {
      const other = String(withSeat);
      const conversation = messagesStore.filter(m =>
        (m.senderSeat === userSeat && m.receiverSeat === other) ||
        (m.senderSeat === other && m.receiverSeat === userSeat)
      );
      return res.json(conversation);
    }

    const userMsgs = messagesStore.filter(m => m.senderSeat === userSeat || m.receiverSeat === userSeat);
    res.json(userMsgs);
  });

  // Chat Messages: Send
  app.post('/api/messages', (req: Request, res: Response) => {
    const { senderSeat, receiverSeat, content } = req.body;
    if (!senderSeat || !receiverSeat || !content || !content.trim()) {
      return res.status(400).json({ error: 'المرسل والمستقبل ومحتوى الرسالة حقول مطلوبة' });
    }

    const sender = studentsStore.find(s => s.seatNumber === String(senderSeat));
    const receiver = studentsStore.find(s => s.seatNumber === String(receiverSeat));

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'أحد أطراف المحادثة غير مسجل بالنظام' });
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderSeat: sender.seatNumber,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      receiverSeat: receiver.seatNumber,
      receiverName: receiver.name,
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    messagesStore.push(newMsg);
    res.status(201).json({ success: true, message: newMsg });
  });

  // Chat Messages: Mark conversation as read
  app.put('/api/messages/read', (req: Request, res: Response) => {
    const { userSeat, otherSeat } = req.body;
    if (!userSeat || !otherSeat) return res.json({ success: true });

    messagesStore.forEach(m => {
      if (m.senderSeat === String(otherSeat) && m.receiverSeat === String(userSeat)) {
        m.read = true;
      }
    });

    res.json({ success: true });
  });

  // Announcements CRUD
  app.get('/api/announcements', (_req: Request, res: Response) => {
    res.json(announcementsStore);
  });

  app.post('/api/announcements', (req: Request, res: Response) => {
    const { title, category, summary, date, important } = req.body;

    if (!title || !category || !summary) {
      return res.status(400).json({ error: 'العنوان، التصنيف، وملخص الخبر حقول مطلوبة' });
    }

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      category,
      date: date || '12 نوفمبر 2026',
      summary,
      important: Boolean(important)
    };

    announcementsStore.unshift(newAnnouncement);
    res.status(201).json({
      success: true,
      message: 'تم نشر الخبر بنجاح على اللوحة الرسمية',
      announcement: newAnnouncement
    });
  });

  app.put('/api/announcements/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, category, summary, date, important } = req.body;

    const index = announcementsStore.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'الخبر غير موجود' });
    }

    announcementsStore[index] = {
      ...announcementsStore[index],
      title: title || announcementsStore[index].title,
      category: category || announcementsStore[index].category,
      summary: summary || announcementsStore[index].summary,
      date: date || announcementsStore[index].date,
      important: important !== undefined ? Boolean(important) : announcementsStore[index].important
    };

    res.json({
      success: true,
      message: 'تم تحديث الخبر بنجاح',
      announcement: announcementsStore[index]
    });
  });

  app.delete('/api/announcements/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLength = announcementsStore.length;
    announcementsStore = announcementsStore.filter(a => a.id !== id);

    if (announcementsStore.length === initialLength) {
      return res.status(404).json({ error: 'الخبر غير موجود' });
    }

    res.json({ success: true, message: 'تم حذف الخبر من لوحة الإعلانات' });
  });

  // Schedules
  app.get('/api/schedules', (req: Request, res: Response) => {
    const { level, day } = req.query;
    let filtered = schedulesStore;
    if (level && typeof level === 'string') {
      filtered = filtered.filter(s => s.level.includes(level));
    }
    if (day && typeof day === 'string') {
      filtered = filtered.filter(s => s.day === day);
    }
    res.json(filtered);
  });

  // Student Search (Results, Seating, Exam Hall, Transcript)
  app.get('/api/students/search', (req: Request, res: Response) => {
    const query = (req.query.q as string || '').trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ error: 'يرجى إدخال رقم الجلوس أو الرقم القومي أو الاسم' });
    }

    const found = studentsStore.find(s => 
      s.seatNumber.toLowerCase() === query ||
      s.nationalId === query ||
      s.name.toLowerCase().includes(query)
    );

    if (!found) {
      return res.status(404).json({
        error: 'لم يتم العثور على سجل مطابق. جرب البحث برقم الجلوس التجريبي: 1042 أو 2058 أو 3120 أو 4015'
      });
    }

    res.json(found);
  });

  // Admin Student Management (List, Add, Update, Delete)
  app.get('/api/admin/students', (_req: Request, res: Response) => {
    res.json(studentsStore);
  });

  app.post('/api/admin/students', (req: Request, res: Response) => {
    const {
      seatNumber,
      nationalId,
      name,
      level,
      department,
      academicAdvisor,
      cgpa,
      totalCredits,
      status,
      examHall,
      seatLocation,
      courses
    } = req.body;

    if (!seatNumber || !name) {
      return res.status(400).json({ error: 'اسم الطالب ورقم الجلوس حقول إلزامية' });
    }

    // Check if seatNumber already exists
    const exists = studentsStore.some(s => s.seatNumber === seatNumber.trim());
    if (exists) {
      return res.status(400).json({ error: `رقم الجلوس ${seatNumber} مسجل بالفعل لطالب آخر` });
    }

    const newStudent: StudentRecord = {
      seatNumber: seatNumber.trim(),
      nationalId: nationalId ? nationalId.trim() : '30000000000000',
      name: name.trim(),
      level: level || 'الفرقة الأولى',
      department: department || 'المرحلة العامة (General)',
      academicAdvisor: academicAdvisor || 'د. مصطفى عبد اللطيف',
      cgpa: typeof cgpa === 'number' ? cgpa : parseFloat(cgpa) || 3.0,
      totalCredits: typeof totalCredits === 'number' ? totalCredits : parseInt(totalCredits, 10) || 30,
      status: status || 'مقيد - منتظم',
      examHall: examHall || 'مدرج 1 الرئيسي',
      seatLocation: seatLocation || 'الصف A - مقعد 01',
      courses: Array.isArray(courses) && courses.length > 0 ? courses : [
        { code: 'CS101', name: 'أساسيات الحوسبة والبرمجة', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
        { code: 'MATH101', name: 'الرياضيات المتقدمة', credits: 3, grade: 'B+', points: 3.2, score: 83, status: 'ناجح' }
      ]
    };

    studentsStore.unshift(newStudent);
    res.status(201).json({
      success: true,
      message: `تمت إضافة الطالب ${name} برقم جلوس (${seatNumber}) بنجاح إلى قاعدة البيانات الأكاديمية`,
      student: newStudent
    });
  });

  app.put('/api/admin/students/:seatNumber', (req: Request, res: Response) => {
    const { seatNumber } = req.params;
    const index = studentsStore.findIndex(s => s.seatNumber === seatNumber);

    if (index === -1) {
      return res.status(404).json({ error: 'الطالب غير موجود' });
    }

    const {
      name,
      nationalId,
      level,
      department,
      academicAdvisor,
      cgpa,
      totalCredits,
      status,
      examHall,
      seatLocation,
      courses
    } = req.body;

    studentsStore[index] = {
      ...studentsStore[index],
      name: name ? name.trim() : studentsStore[index].name,
      nationalId: nationalId ? nationalId.trim() : studentsStore[index].nationalId,
      level: level || studentsStore[index].level,
      department: department || studentsStore[index].department,
      academicAdvisor: academicAdvisor || studentsStore[index].academicAdvisor,
      cgpa: cgpa !== undefined ? parseFloat(cgpa) : studentsStore[index].cgpa,
      totalCredits: totalCredits !== undefined ? parseInt(totalCredits, 10) : studentsStore[index].totalCredits,
      status: status || studentsStore[index].status,
      examHall: examHall || studentsStore[index].examHall,
      seatLocation: seatLocation || studentsStore[index].seatLocation,
      courses: Array.isArray(courses) ? courses : studentsStore[index].courses
    };

    res.json({
      success: true,
      message: `تم تحديث بيانات الطالب ${studentsStore[index].name} بنجاح`,
      student: studentsStore[index]
    });
  });

  app.delete('/api/admin/students/:seatNumber', (req: Request, res: Response) => {
    const { seatNumber } = req.params;
    const prevCount = studentsStore.length;
    studentsStore = studentsStore.filter(s => s.seatNumber !== seatNumber);

    if (studentsStore.length === prevCount) {
      return res.status(404).json({ error: 'الطالب غير موجود' });
    }

    res.json({
      success: true,
      message: `تم حذف الطالب برقم جلوس ${seatNumber} من السجلات الأكاديمية بنجاح`
    });
  });

  // Graduation Projects
  app.get('/api/projects', (_req: Request, res: Response) => {
    res.json(projectsStore);
  });

  // Vote / Like Project
  app.post('/api/projects/:id/like', (req: Request, res: Response) => {
    const { id } = req.params;
    const project = projectsStore.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    project.likes += 1;
    res.json({ success: true, likes: project.likes });
  });

  // Staff members
  app.get('/api/staff', (_req: Request, res: Response) => {
    res.json(STAFF_MEMBERS);
  });

  // Student Service Requests
  app.get('/api/requests', (req: Request, res: Response) => {
    const { seatNumber } = req.query;
    if (seatNumber && typeof seatNumber === 'string') {
      return res.json(studentRequestsStore.filter(r => r.seatNumber === seatNumber));
    }
    res.json(studentRequestsStore);
  });

  app.post('/api/requests', (req: Request, res: Response) => {
    const { studentName, seatNumber, nationalId, level, department, requestType, details } = req.body;

    if (!studentName || !seatNumber || !requestType) {
      return res.status(400).json({ error: 'جميع الحقول الأساسية مطلوبة' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRequest: StudentServiceRequest = {
      id: `req-${Date.now()}`,
      referenceNumber: `SVU-FCI-2026-${randomSuffix}`,
      studentName,
      seatNumber,
      nationalId: nationalId || '30000000000000',
      level: level || 'الفرقة المقيدة',
      department: department || 'عام',
      requestType,
      details: details || '',
      status: 'قيد المراجعة',
      submittedAt: '12 نوفمبر 2026'
    };

    studentRequestsStore.unshift(newRequest);
    res.status(201).json({
      success: true,
      message: 'تم إرسال طلبك بنجاح لشؤون الطلاب بكلية الحاسبات بقنا',
      request: newRequest
    });
  });

  // Official Inquiries & Suggestions to Faculty Administration
  app.get('/api/contact/messages', (req: Request, res: Response) => {
    const { seatNumber, trackingCode } = req.query;
    let list = facultyInquiriesStore;

    if (trackingCode && typeof trackingCode === 'string') {
      const item = list.find(m => m.trackingCode.toLowerCase() === trackingCode.toLowerCase());
      return res.json(item ? [item] : []);
    }

    if (seatNumber && typeof seatNumber === 'string') {
      list = list.filter(m => m.seatNumber === seatNumber);
    }

    res.json(list);
  });

  app.post('/api/contact/messages', (req: Request, res: Response) => {
    const {
      studentName,
      seatNumber,
      email,
      phone,
      level,
      department,
      recipientDepartment,
      messageType,
      priority,
      subject,
      content,
      documentLink
    } = req.body;

    if (!studentName || !subject || !content || !recipientDepartment) {
      return res.status(400).json({ error: 'يرجى استكمال الحقول الأساسية: الاسم، الجهة المختصة، العنوان، والتفاصيل.' });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `INQ-SVU-2026-${randomNum}`;

    const newInquiry: FacultyInquiry = {
      id: `inq-${Date.now()}`,
      trackingCode,
      studentName,
      seatNumber: seatNumber || 'غير محدد',
      email: email || 'student@svu.edu.eg',
      phone: phone || '',
      level: level || 'الفرقة المقيدة',
      department: department || 'عام',
      recipientDepartment,
      messageType: messageType || 'استفسار أكاديمي',
      priority: priority || 'عادي',
      subject,
      content,
      documentLink: documentLink || '',
      status: 'تم الاستلام',
      submittedAt: '12 نوفمبر 2026'
    };

    facultyInquiriesStore.unshift(newInquiry);

    res.status(201).json({
      success: true,
      message: `تم تسليم رسالتك بنجاح إلى ${recipientDepartment}. كود المتابعة الرسمي: ${trackingCode}`,
      inquiry: newInquiry
    });
  });

  // --- Admin Extended Management Endpoints ---

  // Admin Overview Stats
  app.get('/api/admin/stats/overview', (_req: Request, res: Response) => {
    res.json({
      totalStudents: studentsStore.length,
      totalAnnouncements: announcementsStore.length,
      totalProjects: projectsStore.length,
      totalRequests: studentRequestsStore.length,
      pendingRequests: studentRequestsStore.filter(r => r.status === 'قيد المراجعة').length,
      totalInquiries: facultyInquiriesStore.length,
      unansweredInquiries: facultyInquiriesStore.filter(i => i.status !== 'تم الرد والاعتماد').length
    });
  });

  // Admin Student Document Requests (List, Update Status, Delete)
  app.get('/api/admin/requests', (_req: Request, res: Response) => {
    res.json(studentRequestsStore);
  });

  app.put('/api/admin/requests/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const item = studentRequestsStore.find(r => r.id === id);
    if (!item) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    if (status) {
      item.status = status;
    }
    res.json({ success: true, message: `تم تحديث حالة الطلب إلى "${status}" بنجاح`, request: item });
  });

  app.delete('/api/admin/requests/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = studentRequestsStore.length;
    studentRequestsStore = studentRequestsStore.filter(r => r.id !== id);
    if (studentRequestsStore.length === initialLen) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    res.json({ success: true, message: 'تم حذف طلب الوثيقة بنجاح' });
  });

  // Admin Inquiries / Complaints Management (List, Respond, Delete)
  app.get('/api/admin/inquiries', (_req: Request, res: Response) => {
    res.json(facultyInquiriesStore);
  });

  app.put('/api/admin/inquiries/:id/respond', (req: Request, res: Response) => {
    const { id } = req.params;
    const { responderName, responderRole, responseText } = req.body;
    const item = facultyInquiriesStore.find(i => i.id === id);
    if (!item) {
      return res.status(404).json({ error: 'الرسالة غير موجودة' });
    }
    if (!responseText) {
      return res.status(400).json({ error: 'نص الرد الرسمي مطلوب' });
    }

    item.status = 'تم الرد والاعتماد';
    item.officialResponse = {
      responderName: responderName || 'عمادة كلية الحاسبات والمعلومات',
      responderRole: responderRole || 'إدارة الكلية',
      responseText: responseText.trim(),
      respondedAt: '12 نوفمبر 2026'
    };

    res.json({ success: true, message: 'تم اعتماد الرد الرسمي بنجاح وإرساله لسجل المتابعة للطالب', inquiry: item });
  });

  app.delete('/api/admin/inquiries/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = facultyInquiriesStore.length;
    facultyInquiriesStore = facultyInquiriesStore.filter(i => i.id !== id);
    if (facultyInquiriesStore.length === initialLen) {
      return res.status(404).json({ error: 'الرسالة غير موجودة' });
    }
    res.json({ success: true, message: 'تم حذف الرسالة بنجاح' });
  });

  // Admin Graduation Projects Management (Add, Update, Delete)
  app.post('/api/admin/projects', (req: Request, res: Response) => {
    const { title, titleEn, department, year, supervisor, teamMembers, description, technologies, awards, status } = req.body;
    if (!title || !department || !supervisor) {
      return res.status(400).json({ error: 'عنوان المشروع، القسم، والمشرف حقول مطلوبة' });
    }

    const newProject: ProjectRecord = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      titleEn: titleEn || '',
      department: department.trim(),
      year: year || '2025/2026',
      supervisor: supervisor.trim(),
      teamMembers: Array.isArray(teamMembers) ? teamMembers : (teamMembers ? teamMembers.split(',').map((s: string) => s.trim()) : []),
      description: description || '',
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((s: string) => s.trim()) : ['Python']),
      likes: 0,
      awards: awards || '',
      status: status === 'قيد التنفيذ' ? 'قيد التنفيذ' : 'مكتمل'
    };

    projectsStore.unshift(newProject);
    res.status(201).json({ success: true, message: 'تمت إضافة مشروع التخرج بنجاح إلى المعرض الأكاديمي', project: newProject });
  });

  app.put('/api/admin/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = projectsStore.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    const { title, titleEn, department, year, supervisor, teamMembers, description, technologies, awards, status } = req.body;

    projectsStore[index] = {
      ...projectsStore[index],
      title: title || projectsStore[index].title,
      titleEn: titleEn !== undefined ? titleEn : projectsStore[index].titleEn,
      department: department || projectsStore[index].department,
      year: year || projectsStore[index].year,
      supervisor: supervisor || projectsStore[index].supervisor,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : (teamMembers ? teamMembers.split(',').map((s: string) => s.trim()) : projectsStore[index].teamMembers),
      description: description !== undefined ? description : projectsStore[index].description,
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((s: string) => s.trim()) : projectsStore[index].technologies),
      awards: awards !== undefined ? awards : projectsStore[index].awards,
      status: status || projectsStore[index].status
    };

    res.json({ success: true, message: 'تم تحديث بيانات مشروع التخرج بنجاح', project: projectsStore[index] });
  });

  app.delete('/api/admin/projects/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = projectsStore.length;
    projectsStore = projectsStore.filter(p => p.id !== id);
    if (projectsStore.length === initialLen) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    res.json({ success: true, message: 'تم حذف مشروع التخرج بنجاح' });
  });

  // Admin Schedules Timetable Management (Add Lecture, Delete Lecture)
  app.post('/api/admin/schedules', (req: Request, res: Response) => {
    const { level, department, day, time, title, type, instructor, hall } = req.body;
    if (!level || !day || !title || !time) {
      return res.status(400).json({ error: 'الفرقة، اليوم، وقت المحاضرة، واسم المقرر حقول مطلوبة' });
    }

    let dayGroup = schedulesStore.find(s => s.level.includes(level) && s.day === day);
    if (!dayGroup) {
      dayGroup = {
        level,
        department: department || 'عام',
        day,
        items: []
      };
      schedulesStore.push(dayGroup);
    }

    dayGroup.items.push({
      time,
      title,
      type: type || 'محاضرة',
      instructor: instructor || 'هيئة التدريس',
      hall: hall || 'مدرج الكلية'
    });

    res.status(201).json({ success: true, message: 'تمت إضافة المحاضرة/السكشن إلى الجدول الدراسي بنجاح' });
  });

  app.delete('/api/admin/schedules', (req: Request, res: Response) => {
    const { level, day, itemIndex } = req.query;
    if (!level || !day || itemIndex === undefined) {
      return res.status(400).json({ error: 'الفرقة واليوم ورقم الحصة مطلوبة' });
    }

    const dayGroup = schedulesStore.find(s => s.level.includes(String(level)) && s.day === String(day));
    if (!dayGroup) {
      return res.status(404).json({ error: 'لم يتم العثور على جدول لهذا اليوم' });
    }

    const idx = parseInt(String(itemIndex), 10);
    if (isNaN(idx) || idx < 0 || idx >= dayGroup.items.length) {
      return res.status(400).json({ error: 'رقم المحاضرة غير صالح' });
    }

    dayGroup.items.splice(idx, 1);
    res.json({ success: true, message: 'تم حذف المحاضرة من الجدول بنجاح' });
  });

  

  // =====================================================================
  // ACADEMIC SPECIALIZATION (التشعيب الأكاديمي) API ENDPOINTS
  // =====================================================================

  // GET Specialization Status
  app.get('/api/specialization/status', (_req: Request, res: Response) => {
    res.json({
      status: specializationStatus,
      totalApplicants: specializationPreferencesStore.length
    });
  });

  // Admin: Toggle Specialization Open/Close
  app.post('/api/admin/specialization/toggle', (req: Request, res: Response) => {
    const { open, endDate } = req.body;
    specializationStatus.isOpen = Boolean(open);
    if (endDate) specializationStatus.endDate = String(endDate);
    res.json({
      success: true,
      message: `تم ${specializationStatus.isOpen ? 'فتح' : 'إغلاق'} باب التقديم للتشعيب الأكاديمي بنجاح`,
      status: specializationStatus
    });
  });

  // Admin: Set capacities
  app.post('/api/admin/specialization/capacities', (req: Request, res: Response) => {
    const { capacities } = req.body;
    if (capacities && typeof capacities === 'object') {
      specializationStatus.capacities = { ...specializationStatus.capacities, ...capacities };
      return res.json({ success: true, message: 'تم تحديث الطاقة الاستيعابية للأقسام بنجاح', capacities: specializationStatus.capacities });
    }
    return res.status(400).json({ error: 'بيانات غير صالحة' });
  });

  // Student: Get my specialization preference
  app.get('/api/specialization/my', (req: Request, res: Response) => {
    const { seatNumber } = req.query;
    if (!seatNumber) return res.status(400).json({ error: 'رقم الجلوس مطلوب' });

    const student = studentsStore.find(s => s.seatNumber === String(seatNumber));
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });

    const pref = specializationPreferencesStore.find(p => p.studentSeat === String(seatNumber));
    return res.json({
      student: {
        name: student.name,
        seatNumber: student.seatNumber,
        level: student.level,
        department: student.department,
        cgpa: student.cgpa
      },
      isOpen: specializationStatus.isOpen,
      preference: pref || null
    });
  });

  // Student: Submit / Update specialization preferences
  app.post('/api/specialization/submit', (req: Request, res: Response) => {
    const { studentSeat, preferences } = req.body;
    if (!studentSeat || !preferences || !Array.isArray(preferences) || preferences.length !== 4) {
      return res.status(400).json({ error: 'يجب اختيار وترتيب الرغبات الأربعة بالكامل (CS, IT, IS, AI)' });
    }

    if (!specializationStatus.isOpen) {
      return res.status(403).json({ error: 'عذراً، باب التقدم للتشعيب الأكاديمي مغلق حالياً' });
    }

    const student = studentsStore.find(s => s.seatNumber === String(studentSeat));
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });

    const existingIndex = specializationPreferencesStore.findIndex(p => p.studentSeat === String(studentSeat));
    const now = new Date().toLocaleString('ar-EG');

    if (existingIndex !== -1) {
      specializationPreferencesStore[existingIndex].preferences = preferences;
      specializationPreferencesStore[existingIndex].submittedAt = now;
      return res.json({ success: true, message: 'تم تحديث رغبات التشعيب بنجاح', preference: specializationPreferencesStore[existingIndex] });
    } else {
      const newPref: SpecializationPreference = {
        id: `spec-${Date.now()}`,
        studentSeat: String(studentSeat),
        studentName: student.name,
        studentLevel: student.level,
        cgpa: student.cgpa,
        preferences,
        submittedAt: now,
        assignedDepartment: null,
        status: 'قيد المراجعة'
      };
      specializationPreferencesStore.push(newPref);
      return res.status(201).json({ success: true, message: 'تم تسجيل رغبات التشعيب الأكاديمي بنجاح', preference: newPref });
    }
  });

  // Admin: Get all specialization applicants
  app.get('/api/admin/specialization/applicants', (_req: Request, res: Response) => {
    res.json({
      applicants: specializationPreferencesStore,
      status: specializationStatus
    });
  });

  // Admin: Run automatic merit-based allocation
  app.post('/api/admin/specialization/run-allocation', (_req: Request, res: Response) => {
    if (specializationPreferencesStore.length === 0) {
      return res.status(400).json({ error: 'لا يوجد متقدمين للتشعيب بعد' });
    }

    // Sort applicants by CGPA descending
    const sorted = [...specializationPreferencesStore].sort((a, b) => b.cgpa - a.cgpa);
    const deptFullNames: Record<string, string> = {
      'CS': 'علوم الحاسب (CS)',
      'IT': 'تكنولوجيا المعلومات (IT)',
      'IS': 'نظم المعلومات (IS)',
      'AI': 'الذكاء الاصطناعي (AI)'
    };

    const counts: Record<string, number> = { 'CS': 0, 'IT': 0, 'IS': 0, 'AI': 0 };

    for (const applicant of sorted) {
      let assigned = false;
      for (const pref of applicant.preferences) {
        const cap = specializationStatus.capacities[pref as keyof typeof specializationStatus.capacities] || 40;
        if (counts[pref] < cap) {
          counts[pref] += 1;
          applicant.assignedDepartment = deptFullNames[pref] || pref;
          applicant.status = 'تم الترشيح';
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        // Fallback to least filled department
        const least = Object.keys(counts).reduce((a, b) => counts[a] < counts[b] ? a : b);
        counts[least] += 1;
        applicant.assignedDepartment = deptFullNames[least] || least;
        applicant.status = 'تم الترشيح';
      }
    }

    res.json({
      success: true,
      message: `تم تشغيل التنسيق الإلكتروني وتوزيع ${sorted.length} طالب بنجاح`,
      distribution: counts,
      applicants: specializationPreferencesStore
    });
  });

  // Admin: Manually assign or approve department for a student
  app.post('/api/admin/specialization/assign', (req: Request, res: Response) => {
    const { studentSeat, department, status, applyToStudent } = req.body;
    if (!studentSeat || !department) return res.status(400).json({ error: 'رقم الجلوس والقسم مطلوبان' });

    const pref = specializationPreferencesStore.find(p => p.studentSeat === String(studentSeat));
    if (pref) {
      pref.assignedDepartment = department;
      if (status) pref.status = status;
    }

    // Update in studentsStore if requested
    if (applyToStudent) {
      const student = studentsStore.find(s => s.seatNumber === String(studentSeat));
      if (student) {
        student.department = department;
        if (student.level === 'الفرقة الثانية') student.level = 'الفرقة الثالثة';
      }
    }

    res.json({ success: true, message: `تم اعتماد قسم ${department} للطالب ${studentSeat} بنجاح` });
  });

  // =====================================================================
  // COURSE REGISTRATION SYSTEM API ENDPOINTS
  // =====================================================================

  // GET registration open/closed status per level and department
  app.get('/api/registration/status', (_req: Request, res: Response) => {
    res.json(registrationStatus);
  });

  // Admin: Toggle registration open/closed for a level or department
  app.post('/api/admin/registration/toggle', (req: Request, res: Response) => {
    const { level, open } = req.body;
    if (!level) {
      return res.status(400).json({ error: 'يرجى تحديد الفرقة أو القسم' });
    }
    registrationStatus[level] = Boolean(open);
    return res.json({
      success: true,
      message: `تم ${open ? 'فتح' : 'إغلاق'} التسجيل لـ ${level} بنجاح`,
      status: registrationStatus
    });
  });

  // Admin: Get all course slots
  app.get('/api/admin/course-slots', (_req: Request, res: Response) => {
    res.json(courseSlotsStore);
  });

  // Admin: Add a new course slot
  app.post('/api/admin/course-slots', (req: Request, res: Response) => {
    const { courseCode, courseName, type, instructor, hallNumber, capacity, day, time, level, department, semester } = req.body;
    if (!courseCode || !courseName || !instructor || !hallNumber || !capacity || !day || !time || !level) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }
    const cap = parseInt(String(capacity), 10);
    if (isNaN(cap) || cap < 1) {
      return res.status(400).json({ error: 'الطاقة الاستيعابية يجب أن تكون رقم موجب' });
    }
    const slot: CourseSlot = {
      id: `slot-${Date.now()}`,
      courseCode: String(courseCode).trim().toUpperCase(),
      courseName: String(courseName).trim(),
      type: (type === 'سكشن عملي' ? 'سكشن عملي' : 'محاضرة') as CourseSlot['type'],
      instructor: String(instructor).trim(),
      hallNumber: String(hallNumber).trim(),
      capacity: cap,
      enrolledCount: 0,
      day: String(day).trim(),
      time: String(time).trim(),
      level: level as CourseSlot['level'],
      department: department || 'عام',
      semester: semester || 'الفصل الدراسي الأول 2026/2027',
      createdAt: new Date().toISOString()
    };
    courseSlotsStore.push(slot);
    return res.status(201).json({ success: true, message: 'تمت إضافة الشعبة بنجاح', slot });
  });

  // Admin: Update a course slot
  app.put('/api/admin/course-slots/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = courseSlotsStore.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'الشعبة غير موجودة' });
    const s = courseSlotsStore[idx];
    const { courseCode, courseName, type, instructor, hallNumber, capacity, day, time, level, department, semester } = req.body;
    courseSlotsStore[idx] = {
      ...s,
      courseCode: courseCode ? String(courseCode).trim().toUpperCase() : s.courseCode,
      courseName: courseName ? String(courseName).trim() : s.courseName,
      type: type || s.type,
      instructor: instructor ? String(instructor).trim() : s.instructor,
      hallNumber: hallNumber ? String(hallNumber).trim() : s.hallNumber,
      capacity: capacity ? parseInt(String(capacity), 10) : s.capacity,
      day: day || s.day,
      time: time || s.time,
      level: level || s.level,
      department: department !== undefined ? department : s.department,
      semester: semester || s.semester
    };
    return res.json({ success: true, message: 'تم تحديث الشعبة بنجاح', slot: courseSlotsStore[idx] });
  });

  // Admin: Delete a course slot
  app.delete('/api/admin/course-slots/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = courseSlotsStore.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'الشعبة غير موجودة' });
    registrationsStore = registrationsStore.filter(r => r.slotId !== id);
    courseSlotsStore.splice(idx, 1);
    return res.json({ success: true, message: 'تم حذف الشعبة وجميع تسجيلاتها بنجاح' });
  });

  // Student: Get available slots for registration (Aware of Level AND Department)
  app.get('/api/registration/slots', (req: Request, res: Response) => {
    const { level, department } = req.query;
    if (!level || typeof level !== 'string') {
      return res.status(400).json({ error: 'يرجى تحديد الفرقة الدراسية' });
    }
    const deptStr = typeof department === 'string' ? department : undefined;
    if (!isRegistrationOpen(level, deptStr)) {
      return res.json({ open: false, slots: [], message: `التسجيل لـ ${level} غير مفتوح حالياً` });
    }

    const slots = courseSlotsStore
      .filter(s => {
        if (s.level !== level) return false;
        if (deptStr && s.department && s.department !== 'عام') {
          return s.department.includes(deptStr) || deptStr.includes(s.department);
        }
        return true;
      })
      .map(s => ({
        ...s,
        available: s.capacity - s.enrolledCount,
        isFull: s.enrolledCount >= s.capacity
      }));
    return res.json({ open: true, slots });
  });

  // Student: Register in a slot
  app.post('/api/registration/register', (req: Request, res: Response) => {
    const { studentSeat, slotId } = req.body;
    if (!studentSeat || !slotId) return res.status(400).json({ error: 'رقم الجلوس ومعرف الشعبة مطلوبان' });

    const student = studentsStore.find(s => s.seatNumber === String(studentSeat));
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });

    const slot = courseSlotsStore.find(s => s.id === slotId);
    if (!slot) return res.status(404).json({ error: 'الشعبة غير موجودة' });

    if (!isRegistrationOpen(slot.level, student.department)) {
      return res.status(403).json({ error: `التسجيل لـ ${slot.level} غير مفتوح حالياً` });
    }

    if (slot.enrolledCount >= slot.capacity) {
      return res.status(400).json({ error: 'عذراً، الشعبة ممتلئة ولا توجد مقاعد متاحة' });
    }

    const alreadySameCourse = registrationsStore.find(
      r => r.studentSeat === String(studentSeat) && r.courseCode === slot.courseCode && r.type === slot.type
    );
    if (alreadySameCourse) {
      return res.status(400).json({ error: `أنت مسجل بالفعل في ${slot.type} لمقرر ${slot.courseName}` });
    }

    slot.enrolledCount += 1;
    const reg: CourseRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentSeat: student.seatNumber,
      studentName: student.name,
      studentLevel: student.level,
      studentDepartment: student.department,
      slotId: slot.id,
      courseCode: slot.courseCode,
      courseName: slot.courseName,
      type: slot.type,
      instructor: slot.instructor,
      hallNumber: slot.hallNumber,
      day: slot.day,
      time: slot.time,
      registeredAt: new Date().toLocaleString('ar-EG')
    };
    registrationsStore.push(reg);

    return res.status(201).json({
      success: true,
      message: `تم تسجيلك بنجاح في ${slot.courseName} (${slot.type})`,
      registration: reg,
      remainingSeats: slot.capacity - slot.enrolledCount
    });
  });

  // Student: Cancel a registration
  app.delete('/api/registration/cancel/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { studentSeat } = req.body;
    const idx = registrationsStore.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'التسجيل غير موجود' });

    const reg = registrationsStore[idx];
    if (studentSeat && reg.studentSeat !== String(studentSeat)) {
      return res.status(403).json({ error: 'غير مصرح لك بإلغاء هذا التسجيل' });
    }

    const slot = courseSlotsStore.find(s => s.id === reg.slotId);
    if (slot && slot.enrolledCount > 0) slot.enrolledCount -= 1;

    registrationsStore.splice(idx, 1);
    return res.json({ success: true, message: 'تم إلغاء التسجيل بنجاح' });
  });

  // Student: Get my registrations
  app.get('/api/registration/my', (req: Request, res: Response) => {
    const { seatNumber } = req.query;
    if (!seatNumber) return res.status(400).json({ error: 'رقم الجلوس مطلوب' });
    const myRegs = registrationsStore.filter(r => r.studentSeat === String(seatNumber));
    return res.json(myRegs);
  });

  // Admin: Get all registrations
  app.get('/api/admin/registrations', (req: Request, res: Response) => {
    const { level } = req.query;
    let list = registrationsStore;
    if (level && typeof level === 'string') {
      list = list.filter(r => r.studentLevel.includes(level));
    }
    return res.json(list);
  });

  // GET full curriculum database
  app.get('/api/curriculum', (req: Request, res: Response) => {
    const { level, semester, department } = req.query;
    let list = CURRICULUM_DATABASE;
    if (level) list = list.filter(c => c.level === parseInt(String(level), 10));
    if (semester) list = list.filter(c => c.semester === parseInt(String(semester), 10));
    if (department && typeof department === 'string') {
      list = list.filter(c => c.departments.includes(department.toUpperCase() as any));
    }
    return res.json(list);
  });

  // Smart eligibility check: Returns flattened fields for direct UI binding
  app.get('/api/registration/eligible', (req: Request, res: Response) => {
    const { seatNumber, semester } = req.query;
    if (!seatNumber) return res.status(400).json({ error: 'رقم الجلوس مطلوب' });

    const student = studentsStore.find(s => s.seatNumber === String(seatNumber));
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });

    const levelNum = getLevelNumber(student.level) as 1 | 2 | 3 | 4;
    const deptCode = getDeptCode(student.department);

    // Get passed course codes
    const passedCodes = student.courses
      .filter(c => c.status === 'ناجح' || c.grade !== 'F')
      .map(c => c.code);

    const registeredCodes = registrationsStore
      .filter(r => r.studentSeat === String(seatNumber))
      .map(r => r.courseCode);

    const semesterPart = semester ? (parseInt(String(semester), 10) as 1 | 2) : 1;
    const eligibleList = getEligibleCourses(levelNum, semesterPart, deptCode, passedCodes);
    const overrides = studentOverridesStore.filter(o => o.studentSeat === String(seatNumber));

    const result = eligibleList.map(item => {
      const override = overrides.find(o => o.courseCode === item.course.code);
      let eligible = item.eligible;
      let lockReason: string | null = null;

      if (override?.action === 'lock') {
        eligible = false;
        lockReason = `محظور إدارياً: ${override.reason}`;
      } else if (override?.action === 'unlock') {
        eligible = true;
        lockReason = null;
      }

      const alreadyRegistered = registeredCodes.includes(item.course.code);
      const availableSlots = courseSlotsStore.filter(
        s => s.courseCode === item.course.code && s.enrolledCount < s.capacity
      ).length;

      return {
        code: item.course.code,
        nameAr: item.course.nameAr,
        nameEn: item.course.nameEn,
        credits: item.course.credits,
        teachingHoursLecture: item.course.teachingHoursLecture,
        teachingHoursPractical: item.course.teachingHoursPractical,
        type: item.course.type,
        semester: item.course.semester,
        level: item.course.level,
        category: item.course.category,
        course: item.course, // backwards compatible
        eligible,
        finalEligible: eligible,
        missingPrereqs: override?.action === 'unlock' ? [] : item.missingPrereqs.map(code => {
          const c = CURRICULUM_DATABASE.find(x => x.code === code);
          return { code, nameAr: c?.nameAr || code };
        }),
        lockReason,
        alreadyRegistered,
        availableSlots,
        hasOverride: !!override,
        overrideAction: override?.action
      };
    });

    return res.json({
      student: { name: student.name, level: student.level, department: student.department },
      levelNum,
      deptCode,
      semesterPart,
      isOpen: isRegistrationOpen(student.level, student.department),
      courses: result
    });
  });

  // Admin: Get eligibility of any student
  app.get('/api/admin/student-eligibility/:seatNumber', (req: Request, res: Response) => {
    const { seatNumber } = req.params;
    const { semester } = req.query;

    const student = studentsStore.find(s => s.seatNumber === seatNumber);
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });

    const levelNum = getLevelNumber(student.level) as 1 | 2 | 3 | 4;
    const deptCode = getDeptCode(student.department);
    const passedCodes = student.courses.filter(c => c.status === 'ناجح').map(c => c.code);
    const semPart = semester ? (parseInt(String(semester), 10) as 1 | 2) : 1;

    const eligibleList = getEligibleCourses(levelNum, semPart, deptCode, passedCodes);
    const overrides = studentOverridesStore.filter(o => o.studentSeat === seatNumber);

    const result = eligibleList.map(item => {
      const override = overrides.find(o => o.courseCode === item.course.code);
      let eligible = item.eligible;
      let lockReason: string | null = null;
      if (override?.action === 'lock') { eligible = false; lockReason = override.reason; }
      else if (override?.action === 'unlock') { eligible = true; }
      return {
        code: item.course.code,
        nameAr: item.course.nameAr,
        nameEn: item.course.nameEn,
        credits: item.course.credits,
        type: item.course.type,
        eligible,
        finalEligible: eligible,
        missingPrereqs: item.missingPrereqs,
        lockReason,
        hasOverride: !!override,
        override: override ? { action: override.action, reason: override.reason } : null
      };
    });

    return res.json({ student, levelNum, deptCode, courses: result, overrides });
  });

  // Admin: Set manual override for a student course
  app.post('/api/admin/student-override', (req: Request, res: Response) => {
    const { studentSeat, courseCode, action, reason } = req.body;
    if (!studentSeat || !courseCode || !action || !['lock','unlock','remove'].includes(action)) {
      return res.status(400).json({ error: 'بيانات غير كاملة' });
    }

    studentOverridesStore = studentOverridesStore.filter(
      o => !(o.studentSeat === String(studentSeat) && o.courseCode === String(courseCode))
    );

    if (action !== 'remove') {
      studentOverridesStore.push({
        studentSeat: String(studentSeat),
        courseCode: String(courseCode),
        action: action as 'lock' | 'unlock',
        reason: reason || (action === 'lock' ? 'قرار إداري' : 'استثناء إداري'),
        overriddenAt: new Date().toLocaleString('ar-EG')
      });
    }

    const actionLabel = action === 'lock' ? 'قفل' : action === 'unlock' ? 'فتح' : 'إزالة تعديل';
    return res.json({ success: true, message: `تم ${actionLabel} مقرر ${courseCode} للطالب ${studentSeat} بنجاح` });
  });

  // Admin: Get all overrides
  app.get('/api/admin/overrides', (req: Request, res: Response) => {
    const { seatNumber } = req.query;
    let list = studentOverridesStore;
    if (seatNumber) list = list.filter(o => o.studentSeat === String(seatNumber));
    return res.json(list);
  });

  // Smart registration: Prerequisite validation + Department check + Capacity check
  app.post('/api/registration/register-smart', (req: Request, res: Response) => {
    const { studentSeat, slotId } = req.body;
    if (!studentSeat || !slotId) return res.status(400).json({ error: 'رقم الجلوس ومعرف الشعبة مطلوبان' });

    const student = studentsStore.find(s => s.seatNumber === String(studentSeat));
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });

    const slot = courseSlotsStore.find(s => s.id === slotId);
    if (!slot) return res.status(404).json({ error: 'الشعبة غير موجودة' });

    if (!isRegistrationOpen(slot.level, student.department)) {
      return res.status(403).json({ error: `التسجيل لـ ${slot.level} غير مفتوح حالياً` });
    }

    if (slot.enrolledCount >= slot.capacity) {
      return res.status(400).json({ error: 'عذراً، الشعبة ممتلئة بالكامل ولا توجد مقاعد شاغرة' });
    }

    const passedCodes = student.courses.filter(c => c.status === 'ناجح').map(c => c.code);
    const override = studentOverridesStore.find(o => o.studentSeat === String(studentSeat) && o.courseCode === slot.courseCode);

    if (override?.action === 'lock') {
      return res.status(403).json({ error: `هذا المقرر محظور عليك بقرار إداري: ${override.reason}` });
    }

    if (!override || override.action !== 'unlock') {
      const { eligible, missingPrereqs } = checkEligibility(slot.courseCode, passedCodes);
      if (!eligible) {
        const missingNames = missingPrereqs.map(code => {
          const c = CURRICULUM_DATABASE.find(x => x.code === code);
          return `${code} (${c?.nameAr || code})`;
        });
        return res.status(400).json({
          error: `لا يمكنك التسجيل — لم تجتز المتطلبات السابقة للمقرر: ${missingNames.join('، ')}`
        });
      }
    }

    const alreadySameCourse = registrationsStore.find(
      r => r.studentSeat === String(studentSeat) && r.courseCode === slot.courseCode && r.type === slot.type
    );
    if (alreadySameCourse) {
      return res.status(400).json({ error: `أنت مسجل بالفعل في ${slot.type} لمقرر ${slot.courseName}` });
    }

    slot.enrolledCount += 1;
    const reg: CourseRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentSeat: student.seatNumber,
      studentName: student.name,
      studentLevel: student.level,
      studentDepartment: student.department,
      slotId: slot.id,
      courseCode: slot.courseCode,
      courseName: slot.courseName,
      type: slot.type,
      instructor: slot.instructor,
      hallNumber: slot.hallNumber,
      day: slot.day,
      time: slot.time,
      registeredAt: new Date().toLocaleString('ar-EG')
    };
    registrationsStore.push(reg);

    return res.status(201).json({
      success: true,
      message: `تم تسجيلك بنجاح في ${slot.courseName} (${slot.type})`,
      registration: reg,
      remainingSeats: slot.capacity - slot.enrolledCount
    });
  });

// Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Qena FCI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
});
