import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
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
  Award
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

type AdminTab = 'overview' | 'students' | 'announcements' | 'requests' | 'inquiries' | 'projects' | 'schedules';

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

// In-Memory Database for Qena Faculty of Computers & Information
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
    objectives: [
      'ابتكار حلول ذكاء اصطناعي لمعالجة اللغة العربية ولهجات صعيد مصر',
      'تحليل البيانات الجغرافية والزراعية بالاستشعار عن بعد',
      'بناء خوارزميات التنبؤ والرعاية الصحية الذكية'
    ]
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
      { code: 'CS411', name: 'التعلم العميق والرؤية الحاسوبية', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'CS412', name: 'الحوسبة الموزعة والسحابية', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'CS499', name: 'مشروع التخرج (الجزء الثاني)', credits: 4, grade: 'A+', points: 4.0, score: 98, status: 'مستمر' },
      { code: 'IT415', name: 'أمن الشبكات والتشفير المتقدم', credits: 3, grade: 'A-', points: 3.5, score: 87, status: 'ناجح' },
      { code: 'HUM401', name: 'أخلاقيات الحوسبة والملكية الفكرية', credits: 2, grade: 'A', points: 3.7, score: 90, status: 'ناجح' }
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
      { code: 'IS301', name: 'إدارة قواعد البيانات المتقدمة', credits: 3, grade: 'A', points: 3.7, score: 89, status: 'ناجح' },
      { code: 'IS302', name: 'تحليل وتصميم النظم الكبرى', credits: 3, grade: 'A-', points: 3.4, score: 85, status: 'ناجح' },
      { code: 'IS305', name: 'تنقيب البيانات وذكاء الأعمال', credits: 3, grade: 'B+', points: 3.2, score: 82, status: 'ناجح' },
      { code: 'CS310', name: 'هياكل البيانات والبحث الأمثل', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'STAT301', name: 'الاحتمالات والإحصاء الهندسي', credits: 3, grade: 'B', points: 3.0, score: 78, status: 'ناجح' }
    ]
  },
  {
    seatNumber: '3120',
    nationalId: '30402192701123',
    name: 'عبد الله محمد عبد الباسط الصاوي',
    level: 'الفرقة الثانية',
    department: 'الذكاء الاصطناعي (AI)',
    academicAdvisor: 'د. خالد الدندراوي',
    cgpa: 3.92,
    totalCredits: 64,
    status: 'مقيد - منتظم (امتياز)',
    examHall: 'قاعة 3B - مبنى المعامل المركزية',
    seatLocation: 'الصف A - مقعد 03',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    courses: [
      { code: 'AI201', name: 'مقدمة في خوارزميات الذكاء الاصطناعي', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'MATH202', name: 'الجبر الخطي والتحسين الرياضي', credits: 3, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'CS204', name: 'البرمجة كائنية التوجه المتقدمة (C++)', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'CS205', name: 'تنظيم ومعمارية الحاسبات', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'GEN201', name: 'مهارات العرض والتواصل العلمي', credits: 2, grade: 'A+', points: 4.0, score: 95, status: 'ناجح' }
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
      { code: 'CS101', name: 'مقدمة في علوم الحاسب والبرمجة بايثون', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'MATH101', name: 'تفاضل وتكامل 1', credits: 3, grade: 'B+', points: 3.2, score: 83, status: 'ناجح' },
      { code: 'PHYS101', name: 'فيزياء عامة وإلكترونيات رقمية', credits: 3, grade: 'A-', points: 3.5, score: 86, status: 'ناجح' },
      { code: 'MATH102', name: 'رياضيات متقطعة للمعلوماتية', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'ENG101', name: 'لغة إنجليزية تقنية وكتابة أكاديمية', credits: 2, grade: 'A+', points: 4.0, score: 95, status: 'ناجح' }
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
