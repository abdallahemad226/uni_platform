import re

with open('server.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace CourseSlot interface and stores block
old_block = """interface CourseSlot {
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

// Which year levels have registration open (admin controls this)
let registrationStatus: Record<string, boolean> = {
  'الفرقة الأولى': false,
  'الفرقة الثانية': false,
  'الفرقة الثالثة': false,
  'الفرقة الرابعة': false
};

// Available course slots (admin populates these)
let courseSlotsStore: CourseSlot[] = [];

// Student registrations
let registrationsStore: CourseRegistration[] = [];"""

new_block = """interface CourseSlot {
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
let registrationsStore: CourseRegistration[] = [];"""

if old_block in text:
    text = text.replace(old_block, new_block, 1)
    print("Replaced CourseSlot and stores block successfully!")
else:
    print("WARNING: old_block not found in text!")

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(text)
