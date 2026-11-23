import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calculator,
  MessageSquare,
  Send,
  Inbox,
  Building2,
  Copy,
  Check,
  UserCheck,
  Shield,
  Lock,
  Printer,
  Sparkles
} from 'lucide-react';
import { StudentRecord, StudentServiceRequest, FacultyInquiry } from '../types';

interface StudentPortalSectionProps {
  onOpenAdmin?: () => void;
  loggedStudent?: StudentRecord | null;
  onOpenStudentAuth?: () => void;
}

export const StudentPortalSection: React.FC<StudentPortalSectionProps> = ({
  onOpenAdmin,
  loggedStudent,
  onOpenStudentAuth
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'results' | 'requests' | 'contact' | 'calculator'>('results');

  // Form states for student services requests (documents)
  const [formRequestType, setFormRequestType] = useState('بيان درجات باللغتين العربية والإنجليزية');
  const [formDetails, setFormDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Recent document requests store for current student
  const [requestsList, setRequestsList] = useState<StudentServiceRequest[]>([]);

  // --- Official Contact & Suggestions Form States ---
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRecipient, setContactRecipient] = useState('مكتب عميد الكلية');
  const [contactType, setContactType] = useState<'استفسار أكاديمي' | 'مقترح تطوير' | 'شكوى / التماس' | 'طلب مقابلة رسمية'>('استفسار أكاديمي');
  const [contactPriority, setContactPriority] = useState<'عادي' | 'عاجل'>('عادي');
  const [contactSubject, setContactSubject] = useState('');
  const [contactContent, setContactContent] = useState('');
  const [contactDocLink, setContactDocLink] = useState('');
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSuccessData, setContactSuccessData] = useState<FacultyInquiry | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Inquiries List for current student
  const [inquiriesList, setInquiriesList] = useState<FacultyInquiry[]>([]);
  const [inquiryViewMode, setInquiryViewMode] = useState<'form' | 'history'>('form');

  // GPA Calculator simulator state
  const [calcCourses, setCalcCourses] = useState([
    { name: 'مقرر 1 (الذكاء الاصطناعي)', credits: 3, gradePoint: 4.0 },
    { name: 'مقرر 2 (هندسة البرمجيات)', credits: 3, gradePoint: 3.7 },
    { name: 'مقرر 3 (الشبكات المتقدمة)', credits: 3, gradePoint: 3.5 },
    { name: 'مقرر 4 (قواعد البيانات)', credits: 3, gradePoint: 3.7 },
  ]);

  useEffect(() => {
    if (loggedStudent) {
      fetchMyRequests(loggedStudent.seatNumber);
      fetchMyInquiries(loggedStudent.seatNumber);
    } else {
      setRequestsList([]);
      setInquiriesList([]);
    }
  }, [loggedStudent]);

  const fetchMyRequests = async (seatNumber: string) => {
    try {
      const res = await fetch(`/api/requests?seatNumber=${encodeURIComponent(seatNumber)}`);
      if (res.ok) {
        const data = await res.json();
        setRequestsList(data);
      }
    } catch {}
  };

  const fetchMyInquiries = async (seatNumber: string) => {
    try {
      const res = await fetch(`/api/contact/messages?seatNumber=${encodeURIComponent(seatNumber)}`);
      if (res.ok) {
        const data = await res.json();
        setInquiriesList(data);
      }
    } catch {}
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedStudent) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: loggedStudent.name,
          seatNumber: loggedStudent.seatNumber,
          nationalId: loggedStudent.nationalId,
          level: loggedStudent.level,
          department: loggedStudent.department,
          requestType: formRequestType,
          details: formDetails
        })
      });

      if (res.ok) {
        const result = await res.json();
        setSubmitSuccess(result.message);
        fetchMyRequests(loggedStudent.seatNumber);
        setFormDetails('');
      }
    } catch {
      setSubmitSuccess('تعذر إرسال الطلب، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedStudent || !contactSubject || !contactContent || !contactRecipient) {
      setContactError('يرجى ملء كافة الحقول الأساسية: الجهة الإدارية، العنوان، وتفاصيل الرسالة.');
      return;
    }

    setIsContactSubmitting(true);
    setContactError(null);
    setContactSuccessData(null);

    try {
      const res = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: loggedStudent.name,
          seatNumber: loggedStudent.seatNumber,
          email: contactEmail || 'student@svu.edu.eg',
          phone: contactPhone,
          level: loggedStudent.level,
          department: loggedStudent.department,
          recipientDepartment: contactRecipient,
          messageType: contactType,
          priority: contactPriority,
          subject: contactSubject,
          content: contactContent,
          documentLink: contactDocLink
        })
      });

      if (res.ok) {
        const result = await res.json();
        setContactSuccessData(result.inquiry);
        fetchMyInquiries(loggedStudent.seatNumber);
        setContactSubject('');
        setContactContent('');
        setContactDocLink('');
      } else {
        const err = await res.json();
        setContactError(err.error || 'تعذر إرسال الرسالة لإدارة الكلية');
      }
    } catch {
      setContactError('حدث خطأ في الاتصال بالخادم الأكاديمي');
    } finally {
      setIsContactSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Calculate simulated GPA
  const totalSimCredits = calcCourses.reduce((acc, c) => acc + c.credits, 0);
  const totalSimPoints = calcCourses.reduce((acc, c) => acc + (c.credits * c.gradePoint), 0);
  const simulatedGpa = totalSimCredits > 0 ? (totalSimPoints / totalSimCredits).toFixed(2) : '0.00';

  return (
    <section id="services" className="py-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
              STUDENT AFFAIRS & ACADEMIC PORTAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white mt-1">
              بوابة الخدمات الطلابية وشؤون الطلاب
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
              السجل الأكاديمي المعتمد، استخراج الوثائق والإفادات، وقنوات التواصل المباشر مع إدارة الكلية.
            </p>
          </div>

          {/* Subtabs Segmented Control (Active only when logged in) */}
          {loggedStudent && (
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shrink-0 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveSubTab('results')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeSubTab === 'results'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                سجلي الأكاديمي واللجنة
              </button>
              <button
                onClick={() => setActiveSubTab('requests')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeSubTab === 'requests'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                استخراج الوثائق والإفادات
              </button>
              <button
                onClick={() => setActiveSubTab('contact')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeSubTab === 'contact'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>التواصل مع الإدارة والمقترحات</span>
              </button>
              <button
                onClick={() => setActiveSubTab('calculator')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeSubTab === 'calculator'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                حاسبة المعدل التراكمي
              </button>
            </div>
          )}
        </div>

        {/* If NOT LOGGED IN: Secure Protected Gate (No student data shown) */}
        {!loggedStudent ? (
          <div className="mt-8 p-8 sm:p-14 text-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white">
                بوابة شؤون الطلاب والنتائج الأكاديمية مشفرة ومحمية
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                لحماية خصوصية وسرية السجلات والدرجات، يرجى تسجيل الدخول بحسابك الأكاديمي (اسم الطالب ورقمك القومي) للوصول إلى بيان درجاتك ومقرراتك واستخراج الوثائق.
              </p>
            </div>

            {onOpenStudentAuth && (
              <div className="pt-2">
                <button
                  onClick={onOpenStudentAuth}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-md bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-850 dark:hover:bg-neutral-200 transition-all shadow-md"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>تسجيل الدخول إلى حساب الطالب</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Logged In Content: STRICTLY FOR CURRENT STUDENT ONLY */
          <div className="mt-8">
            
            {/* Tab 1: Current Student's Result & Transcript */}
            {activeSubTab === 'results' && (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
                {/* Dossier Header Info */}
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/40">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                        OFFICIAL ACADEMIC TRANSCRIPT · FACULTY OF COMPUTERS & INFORMATION
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white mt-1">
                        {loggedStudent.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                        <span>{loggedStudent.level}</span>
                        <span aria-hidden="true">·</span>
                        <span>{loggedStudent.department}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">رقم الجلوس: {loggedStudent.seatNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">المرشد الأكاديمي: {loggedStudent.academicAdvisor}</span>
                      </div>
                    </div>

                    {/* CGPA Badge & Status */}
                    <div className="flex items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-neutral-200 dark:border-neutral-800">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">المعدل التراكمي CGPA</div>
                        <div className="text-3xl font-extrabold text-neutral-950 dark:text-white font-mono tabular-nums">
                          {loggedStudent.cgpa.toFixed(2)} <span className="text-sm font-normal text-neutral-500">/ 4.00</span>
                        </div>
                        <div className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                          {loggedStudent.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exam Seating strip */}
                  <div className="mt-5 p-3 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block">لجنة الامتحان:</span>
                      <strong className="text-neutral-950 dark:text-neutral-100">{loggedStudent.examHall}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">مكان المقعد:</span>
                      <strong className="text-neutral-950 dark:text-neutral-100">{loggedStudent.seatLocation}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">إجمالي الساعات المعتمدة:</span>
                      <strong className="text-neutral-950 dark:text-neutral-100 font-mono tabular-nums">{loggedStudent.totalCredits} ساعة</strong>
                    </div>
                  </div>
                </div>

                {/* Course Grades Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        <th className="py-3 px-4">كود المقرر</th>
                        <th className="py-3 px-4">اسم المادة الدراسية</th>
                        <th className="py-3 px-4 text-center">الساعات</th>
                        <th className="py-3 px-4 text-center">الدرجة المئوية</th>
                        <th className="py-3 px-4 text-center">التقدير</th>
                        <th className="py-3 px-4 text-center">النقاط</th>
                        <th className="py-3 px-4 text-center">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850">
                      {loggedStudent.courses.map((course, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-neutral-900 dark:text-neutral-200">
                            {course.code}
                          </td>
                          <td className="py-3 px-4 font-medium text-neutral-950 dark:text-white">
                            {course.name}
                          </td>
                          <td className="py-3 px-4 text-center font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                            {course.credits}
                          </td>
                          <td className="py-3 px-4 text-center font-mono tabular-nums text-neutral-900 dark:text-neutral-100 font-semibold">
                            {course.score}%
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-neutral-900 dark:text-white">
                            {course.grade}
                          </td>
                          <td className="py-3 px-4 text-center font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                            {course.points.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-center text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            {course.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/30 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>ختم الاعتماد الإلكتروني: معتمد رسمياً من الإدارة المركزية لشؤون الطلاب · قنا</span>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 transition-colors"
                  >
                    طباعة إفادة الدرجات (PDF)
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Document Requests for Current Student */}
            {activeSubTab === 'requests' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form (7 cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                  <h3 className="text-base font-bold text-neutral-950 dark:text-white mb-1">
                    تقديم طلب استخراج وثيقة رسمية
                  </h3>
                  <p className="text-xs text-neutral-500 mb-5">
                    الطلب مسجل باسم الطالب: {loggedStudent.name} (رقم جلوس: {loggedStudent.seatNumber})
                  </p>

                  {submitSuccess && (
                    <div className="mb-5 p-4 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-neutral-900 dark:text-white shrink-0" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        نوع الوثيقة المطلوبة
                      </label>
                      <select
                        value={formRequestType}
                        onChange={(e) => setFormRequestType(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none"
                      >
                        <option>بيان درجات باللغتين العربية والإنجليزية</option>
                        <option>إفادة قيد رسمية موجهة لجهة حكومية أو خاصة</option>
                        <option>طلب تسجيل تدريب صيفي معتمد</option>
                        <option>استخراج بدل فاقد لكارنيه الكلية</option>
                        <option>طلب مراجعة رصد درجات امتحان دور سابق</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                        تفاصيل وملاحظات إضافية
                      </label>
                      <textarea
                        rows={3}
                        value={formDetails}
                        onChange={(e) => setFormDetails(e.target.value)}
                        placeholder="اذكر اسم الجهة الموجه إليها الخطاب أو أي تفاصيل..."
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-950 dark:text-neutral-950 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded transition-colors"
                    >
                      {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب لشؤون الطلاب'}
                    </button>
                  </form>
                </div>

                {/* My Requests Tracker (5 cols) - ONLY THIS STUDENT'S REQUESTS */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                    <h4 className="text-sm font-bold text-neutral-950 dark:text-white mb-3">
                      سجل طلباتي السابقة ({requestsList.length})
                    </h4>
                    <div className="space-y-3">
                      {requestsList.length > 0 ? (
                        requestsList.map((req) => (
                          <div
                            key={req.id}
                            className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-neutral-950 dark:text-white">
                                {req.referenceNumber}
                              </span>
                              <span className="font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-250 dark:border-neutral-700">
                                {req.status}
                              </span>
                            </div>
                            <div className="text-neutral-900 dark:text-neutral-100 font-medium">
                              {req.requestType}
                            </div>
                            <div className="text-neutral-500 text-[11px] font-mono">
                              تاريخ التقديم: {req.submittedAt}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800 rounded">
                          لم تقم بتقديم أي طلبات وثائق بعد.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Official Contact & My Inquiries */}
            {activeSubTab === 'contact' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
                    <div>
                      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                        قناة التواصل الرسمية بعمادة وإدارة الكلية
                      </h3>
                      <p className="text-xs text-neutral-500">
                        مراسلة مباشرة لعميد الكلية وشؤون التعليم والطلاب
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 p-1 rounded-md border border-neutral-200 dark:border-neutral-800 shrink-0">
                    <button
                      onClick={() => setInquiryViewMode('form')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                        inquiryViewMode === 'form'
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                          : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      كتابة رسالة جديدة
                    </button>
                    <button
                      onClick={() => setInquiryViewMode('history')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                        inquiryViewMode === 'history'
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                          : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>رسائلي وردود الإدارة ({inquiriesList.length})</span>
                    </button>
                  </div>
                </div>

                {inquiryViewMode === 'form' ? (
                  <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 max-w-3xl">
                    {contactSuccessData && (
                      <div className="mb-6 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs space-y-2">
                        <div className="font-bold flex items-center gap-2 text-neutral-950 dark:text-white">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم تسليم رسالتك بنجاح. كود المتابعة: {contactSuccessData.trackingCode}</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          يمكنك مراجعة الرد الرسمي الصادر من الإدارة في تبويب "رسائلي وردود الإدارة".
                        </p>
                      </div>
                    )}

                    {contactError && (
                      <div className="mb-4 p-3 rounded bg-red-500/10 text-xs text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{contactError}</span>
                      </div>
                    )}

                    <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-1">الجهة المختصة بالكلية *</label>
                          <select
                            value={contactRecipient}
                            onChange={(e) => setContactRecipient(e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                          >
                            <option>مكتب عميد الكلية</option>
                            <option>مكتب وكيل الكلية لشؤون التعليم والطلاب</option>
                            <option>إدارة شؤون الطلاب والامتحانات</option>
                            <option>وحدة الإرشاد الأكاديمي والتدريب الصيفي</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold mb-1">نوع الرسالة *</label>
                          <select
                            value={contactType}
                            onChange={(e) => setContactType(e.target.value as any)}
                            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                          >
                            <option value="استفسار أكاديمي">استفسار أكاديمي</option>
                            <option value="مقترح تطوير">مقترح تطوير</option>
                            <option value="شكوى / التماس">شكوى / التماس</option>
                            <option value="طلب مقابلة رسمية">طلب مقابلة رسمية</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">عنوان الموضوع *</label>
                        <input
                          type="text"
                          required
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="موضوع الرسالة..."
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">تفاصيل الرسالة *</label>
                        <textarea
                          rows={4}
                          required
                          value={contactContent}
                          onChange={(e) => setContactContent(e.target.value)}
                          placeholder="اكتب رسالتك للإدارة..."
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isContactSubmitting}
                        className="w-full py-2.5 font-semibold text-white bg-neutral-950 dark:text-neutral-950 dark:bg-white hover:bg-neutral-800 rounded transition-colors"
                      >
                        {isContactSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة للإدارة'}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* My Inquiries & Responses (ONLY THIS STUDENT'S) */
                  <div className="space-y-4">
                    {inquiriesList.length > 0 ? (
                      inquiriesList.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between font-mono text-neutral-500">
                            <span>كود المتابعة: {inq.trackingCode}</span>
                            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 font-sans font-bold text-neutral-950 dark:text-white">
                              {inq.status}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-neutral-950 dark:text-white">{inq.subject}</h4>
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{inq.content}</p>

                          {inq.officialResponse && (
                            <div className="p-3.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                              <div className="font-bold text-neutral-950 dark:text-white flex items-center justify-between">
                                <span>رد إدارة الكلية المعتمد:</span>
                                <span className="font-mono text-[10px] text-neutral-500">{inq.officialResponse.respondedAt}</span>
                              </div>
                              <p className="text-neutral-900 dark:text-neutral-100">{inq.officialResponse.responseText}</p>
                              <div className="text-[10px] text-neutral-500 font-semibold pt-1">
                                — {inq.officialResponse.responderName} ({inq.officialResponse.responderRole})
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-xs text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800 rounded">
                        ليس لديك أي رسائل أو استفسارات مسجلة.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: GPA Calculator */}
            {activeSubTab === 'calculator' && (
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 max-w-2xl">
                <h3 className="text-base font-bold text-neutral-950 dark:text-white mb-1">
                  حاسبة ومحاكي المعدل التراكمي CGPA
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  احسب المعدل المتوقع بناءً على تقديرات وساعات المقررات
                </p>

                <div className="space-y-3">
                  {calcCourses.map((course, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs">
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => {
                          const copy = [...calcCourses];
                          copy[idx].name = e.target.value;
                          setCalcCourses(copy);
                        }}
                        className="flex-1 px-3 py-1.5 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-neutral-500">الساعات:</label>
                        <select
                          value={course.credits}
                          onChange={(e) => {
                            const copy = [...calcCourses];
                            copy[idx].credits = parseInt(e.target.value, 10);
                            setCalcCourses(copy);
                          }}
                          className="px-2 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded font-mono"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-neutral-500">التقدير:</label>
                        <select
                          value={course.gradePoint}
                          onChange={(e) => {
                            const copy = [...calcCourses];
                            copy[idx].gradePoint = parseFloat(e.target.value);
                            setCalcCourses(copy);
                          }}
                          className="px-2 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded font-mono"
                        >
                          <option value={4.0}>A+ (4.0)</option>
                          <option value={3.7}>A (3.7)</option>
                          <option value={3.4}>A- (3.4)</option>
                          <option value={3.2}>B+ (3.2)</option>
                          <option value={3.0}>B (3.0)</option>
                          <option value={2.7}>B- (2.7)</option>
                          <option value={2.4}>C+ (2.4)</option>
                          <option value={2.0}>C (2.0)</option>
                          <option value={1.5}>D (1.5)</option>
                          <option value={0.0}>F (0.0)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-between">
                  <div>
                    <div className="text-xs opacity-80">المعدل الفصلي المحسوب:</div>
                    <div className="text-2xl font-bold font-mono">{simulatedGpa} / 4.00</div>
                  </div>
                  <div className="text-xs font-mono opacity-90">
                    الساعات: {totalSimCredits}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
