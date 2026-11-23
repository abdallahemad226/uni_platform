export interface DepartmentPlanSemester {
  semesterNumber: number;
  semesterName: string;
  totalCredits: number;
  courses: {
    code: string;
    nameAr: string;
    nameEn: string;
    credits: number;
    type: 'إجباري' | 'اختياري';
    prerequisites?: string[];
  }[];
}

export interface DepartmentLevelPlan {
  levelNumber: number;
  levelName: string;
  semesters: DepartmentPlanSemester[];
}

export interface Department {
  id: string;
  code: 'CS' | 'IS' | 'IT' | 'AI';
  name: string;
  nameEn: string;
  head: string;
  description: string;
  degree: string;
  bylawsArticle: string;
  coursesCount: number;
  labs: string[];
  objectives: string[];
  scientificFields: string[];
  creditHoursTotal: number;
  hoursBreakdown: {
    general: number;
    collegeMathBasic: number;
    collegeCSBasic: number;
    specializationCompulsory: number;
    specializationElective: number;
    graduationProject: number;
    fieldTraining: number;
  };
  studyPlan: DepartmentLevelPlan[];
}

export interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  grade: string;
  points: number;
  score: number;
  status: string;
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

export interface ChatMessage {
  id: string;
  senderSeat: string;
  senderName: string;
  senderAvatar?: string;
  receiverSeat: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ScheduleItem {
  time: string;
  title: string;
  type: string;
  instructor: string;
  hall: string;
}

export interface ScheduleDay {
  level: string;
  department: string;
  day: string;
  items: ScheduleItem[];
}

export interface ProjectRecord {
  id: string;
  title: string;
  titleEn: string;
  department: string;
  year: string;
  supervisor: string;
  teamMembers: string[];
  description: string;
  technologies: string[];
  likes: number;
  awards?: string;
  status: 'مكتمل' | 'قيد التنفيذ';
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  important: boolean;
}

export interface StaffMember {
  name: string;
  role: string;
  department: string;
  email: string;
  office: string;
  officeHours: string;
  research: string;
}

export interface StudentServiceRequest {
  id: string;
  referenceNumber: string;
  studentName: string;
  seatNumber: string;
  nationalId: string;
  level: string;
  department: string;
  requestType: string;
  details: string;
  status: 'قيد المراجعة' | 'تم التدقيق' | 'جاهز للاستلام' | 'مرفوض';
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

export interface FacultyStats {
  university: string;
  faculty: string;
  dean: string;
  stats: {
    totalStudents: number;
    departmentsCount: number;
    facultyStaff: number;
    activeResearchLabs: number;
    completedGradProjects: number;
    icpcTeamsQualified: number;
    establishedYear: number;
  };
}
