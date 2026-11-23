import sys

with open('scratch/server_original_recovered.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('scratch/replacement_435.txt', 'r', encoding='utf-8') as f:
    rep435 = f.read()

with open('scratch/replacement_445.txt', 'r', encoding='utf-8') as f:
    rep445 = f.read()

# 1. Imports and base types from orig (lines 1 to where StudentRecord ends)
idx_student_record_end = orig.find('let studentsStore')
head = orig[:idx_student_record_end]

# 2. Extract other stores from orig (from let schedulesStore to const app = express();)
sched_start = orig.find('let schedulesStore')
app_start = orig.find('const app = express();')
other_stores = orig[sched_start:app_start]

# 3. Extract curriculum block from rep435
curriculum_start = rep435.find('const CURRICULUM_DATABASE: CurriculumCourse[] = [')
curriculum_end = rep435.find('let studentOverridesStore: StudentCourseOverride[] = [];') + len('let studentOverridesStore: StudentCourseOverride[] = [];')
curriculum_block = rep435[curriculum_start:curriculum_end]

# 4. Extract routes from orig (from const app = express(); to // Vite middleware in dev)
vite_start = orig.find('// Vite middleware in dev or static files in production')
orig_routes = orig[app_start:vite_start]

# 5. Extract end of file (Vite middleware to end)
vite_end = orig[vite_start:]

# New definitions for CourseSlot and Registration and Specialization
registration_and_slots_block = '''
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
'''

# Official Bylaws Departments
departments_block = '''
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
'''

# Students Store with Complete Realistic Passed Courses
students_store_block = '''
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
'''

# New endpoints for Registration and Specialization
registration_and_specialization_endpoints = '''
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
'''

full_server = (
    head + '\n' +
    registration_and_slots_block + '\n' +
    curriculum_block + '\n' +
    departments_block + '\n' +
    students_store_block + '\n' +
    other_stores + '\n' +
    orig_routes + '\n' +
    registration_and_specialization_endpoints + '\n' +
    vite_end
)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(full_server)

print("Master server.ts generated successfully, total length:", len(full_server))
