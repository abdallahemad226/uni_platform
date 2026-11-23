import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, CheckCircle2, XCircle, Clock, Users, MapPin, User,
  Lock, Unlock, FileText, Printer, AlertCircle, RefreshCw, Trash2,
  ChevronDown, ChevronUp, GraduationCap, AlertTriangle, Info,
  Layers, Award, FlaskConical, CalendarDays, Star
} from 'lucide-react';
import { StudentRecord } from '../types';

interface EligibleCourse {
  code: string;
  nameAr: string;
  nameEn: string;
  credits: number;
  type: 'إجباري' | 'اختياري';
  eligible: boolean;
  finalEligible: boolean;
  missingPrereqs: string[];
  lockReason: string | null;
  hasOverride: boolean;
  override: { action: 'lock' | 'unlock'; reason: string } | null;
}

interface CourseSlot {
  id: string;
  courseCode: string;
  courseName: string;
  type: 'محاضرة' | 'سكشن عملي';
  instructor: string;
  hallNumber: string;
  capacity: number;
  enrolledCount: number;
  available: number;
  isFull: boolean;
  day: string;
  time: string;
  level: string;
  semester: string;
}

interface MyRegistration {
  id: string;
  studentSeat: string;
  courseCode: string;
  courseName: string;
  type: string;
  instructor: string;
  hallNumber: string;
  day: string;
  time: string;
  registeredAt: string;
}

interface CourseRegistrationSectionProps {
  loggedStudent: StudentRecord;
}

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  'متطلبات عامة': 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'متطلبات كلية - رياضيات وعلوم': 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'متطلبات كلية - علوم حاسب': 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  'متطلبات تخصص': 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'مشروع تخرج': 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'تدريب': 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
};

export const CourseRegistrationSection: React.FC<CourseRegistrationSectionProps> = ({ loggedStudent }) => {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [eligibleCourses, setEligibleCourses] = useState<EligibleCourse[]>([]);
  const [allSlots, setAllSlots] = useState<CourseSlot[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<MyRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [registeringSlot, setRegisteringSlot] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [semesterPart, setSemesterPart] = useState<1 | 2>(1);
  const [activeTab, setActiveTab] = useState<'courses' | 'registered' | 'plan'>('courses');

  const level = loggedStudent.level;

  const flash = (text: string, ok: boolean) => {
    setActionMsg({ text, ok });
    setTimeout(() => setActionMsg(null), 5000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const dept = loggedStudent.department || '';
      const [statusRes, eligibleRes, slotsRes, myRes] = await Promise.all([
        fetch(`/api/registration/status`),
        fetch(`/api/registration/eligible?seatNumber=${loggedStudent.seatNumber}&semester=${semesterPart}`),
        fetch(`/api/registration/slots?level=${encodeURIComponent(level)}&department=${encodeURIComponent(dept)}`),
        fetch(`/api/registration/my?seatNumber=${loggedStudent.seatNumber}`)
      ]);

      const statusData = await statusRes.json();
      const eligibleData = await eligibleRes.json();
      const slotsData = await slotsRes.json();
      const myData = await myRes.json();

      const deptKey = `${level} - ${dept}`;
      const isOpen = eligibleData.isOpen !== undefined 
        ? eligibleData.isOpen 
        : (statusData[deptKey] !== undefined ? statusData[deptKey] : (statusData[level] ?? true));

      setRegistrationOpen(isOpen);
      setEligibleCourses(eligibleData.courses || []);
      setAllSlots(slotsData.slots || []);
      setMyRegistrations(Array.isArray(myData) ? myData : []);
    } catch {
      flash('خطأ في تحميل بيانات التسجيل', false);
    } finally {
      setLoading(false);
    }
  }, [level, loggedStudent.seatNumber, semesterPart]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRegister = async (slotId: string) => {
    setRegisteringSlot(slotId);
    try {
      const res = await fetch('/api/registration/register-smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentSeat: loggedStudent.seatNumber, slotId })
      });
      const data = await res.json();
      if (res.ok) { flash(data.message, true); await fetchData(); }
      else flash(data.error || 'حدث خطأ أثناء التسجيل', false);
    } catch { flash('فشل الاتصال بالسيرفر', false); }
    finally { setRegisteringSlot(null); }
  };

  const handleCancel = async (regId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا التسجيل؟')) return;
    try {
      const res = await fetch(`/api/registration/cancel/${regId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentSeat: loggedStudent.seatNumber })
      });
      const data = await res.json();
      if (res.ok) { flash(data.message, true); await fetchData(); }
      else flash(data.error || 'فشل إلغاء التسجيل', false);
    } catch { flash('فشل الاتصال بالسيرفر', false); }
  };

  const handlePrint = () => {
    const totalCredits = myRegistrations.reduce((sum, r) => sum + 3, 0);
    const printContent = `
      <html dir="rtl"><head><meta charset="UTF-8">
      <title>استمارة التسجيل الدراسي</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #111; background: #fff; }
        .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { font-size: 20px; font-weight: 900; margin: 0 0 4px; }
        .header h2 { font-size: 14px; color: #444; margin: 0; font-weight: normal; }
        .logo { font-size: 10px; color: #999; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; margin-bottom: 24px; font-size: 13px; }
        .info-grid div { display: flex; gap: 8px; }
        .info-grid strong { color: #555; white-space: nowrap; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
        th, td { border: 1px solid #bbb; padding: 7px 10px; text-align: right; }
        th { background: #f5f5f5; font-weight: bold; font-size: 11px; color: #333; }
        tr:nth-child(even) td { background: #fafafa; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .badge-lec { background: #e5e7eb; color: #374151; }
        .badge-sec { background: #111; color: #fff; }
        .summary { margin-top: 20px; display: flex; gap: 24px; font-size: 12px; }
        .summary div { background: #f5f5f5; padding: 8px 16px; border-radius: 4px; }
        .summary strong { display: block; font-size: 16px; }
        .seal { text-align: center; margin-top: 48px; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 16px; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 48px; font-size: 12px; }
        .sig-box { text-align: center; width: 180px; }
        .sig-line { border-bottom: 1px solid #666; margin-bottom: 4px; height: 36px; }
      </style></head><body>
      <div class="header">
        <div class="logo">جامعة جنوب الوادي — South Valley University</div>
        <h1>كلية الحاسبات والمعلومات والذكاء الاصطناعي</h1>
        <h2>استمارة التسجيل الدراسي الرسمية — الفصل الدراسي ${semesterPart === 1 ? 'الأول' : 'الثاني'} 2026/2027</h2>
      </div>
      <div class="info-grid">
        <div><strong>اسم الطالب:</strong> ${loggedStudent.name}</div>
        <div><strong>رقم الجلوس:</strong> ${loggedStudent.seatNumber}</div>
        <div><strong>الرقم القومي:</strong> ${loggedStudent.nationalId}</div>
        <div><strong>الفرقة الدراسية:</strong> ${loggedStudent.level}</div>
        <div><strong>القسم:</strong> ${loggedStudent.department}</div>
        <div><strong>المرشد الأكاديمي:</strong> ${loggedStudent.academicAdvisor}</div>
        <div><strong>المعدل التراكمي:</strong> ${loggedStudent.cgpa}</div>
        <div><strong>تاريخ الطباعة:</strong> ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <table><thead><tr>
        <th>#</th><th>كود المقرر</th><th>اسم المقرر</th><th>النوع</th>
        <th>الدكتور/المعيد</th><th>رقم القاعة</th><th>اليوم</th><th>الوقت</th>
      </tr></thead><tbody>
      ${myRegistrations.map((r, i) => `<tr>
        <td>${i + 1}</td><td style="font-family:monospace">${r.courseCode}</td><td>${r.courseName}</td>
        <td><span class="badge ${r.type === 'محاضرة' ? 'badge-lec' : 'badge-sec'}">${r.type}</span></td>
        <td>${r.instructor}</td><td style="font-family:monospace">${r.hallNumber}</td><td>${r.day}</td><td>${r.time}</td>
      </tr>`).join('')}
      </tbody></table>
      <div class="summary">
        <div><strong>${myRegistrations.length}</strong>مقرر مسجل</div>
        <div><strong>${myRegistrations.filter(r => r.type === 'محاضرة').length}</strong>محاضرات</div>
        <div><strong>${myRegistrations.filter(r => r.type === 'سكشن عملي').length}</strong>سكاشن عملية</div>
      </div>
      <div class="sig-row">
        <div class="sig-box"><div class="sig-line"></div><div>توقيع الطالب</div></div>
        <div class="sig-box"><div class="sig-line"></div><div>توقيع المرشد الأكاديمي</div></div>
        <div class="sig-box"><div class="sig-line"></div><div>خاتم وتوقيع الكلية</div></div>
      </div>
      <div class="seal">— هذه الاستمارة صادرة إلكترونياً من منصة كلية الحاسبات والمعلومات — جامعة جنوب الوادي بقنا —</div>
      </body></html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(printContent); win.document.close(); win.print(); }
  };

  const getSlotsForCourse = (courseCode: string, type: string) =>
    allSlots.filter(s => s.courseCode === courseCode && s.type === type);

  const isRegisteredInSlot = (slotId: string) =>
    myRegistrations.some(r => r.id === slotId);

  const isRegisteredInCourse = (courseCode: string, type: string) =>
    myRegistrations.some(r => r.courseCode === courseCode && r.type === type);

  // Stats
  const eligibleCount = eligibleCourses.filter(c => c.finalEligible).length;
  const lockedCount = eligibleCourses.filter(c => !c.finalEligible).length;
  const registeredCodesSet = new Set(myRegistrations.map(r => r.courseCode));

  // Group courses by category for display
  const groupedCourses = eligibleCourses.reduce<Record<string, EligibleCourse[]>>((acc, course) => {
    // We don't have category from API directly — group by eligible/locked
    const key = !course.finalEligible ? 'مواد محجوبة (متطلبات ناقصة)' : 'مواد متاحة للتسجيل';
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {});

  return (
    <section id="registration" className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== SECTION HEADER ===== */}
        <div className="mb-8">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">COURSE REGISTRATION SYSTEM</div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                التسجيل الدراسي
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {level} &mdash; {loggedStudent.department}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Semester Switcher */}
              <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {([1, 2] as const).map(s => (
                  <button key={s} onClick={() => setSemesterPart(s)}
                    className={`px-4 py-1.5 text-xs font-bold transition-colors ${semesterPart === s
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-transparent'}`}>
                    الفصل {s === 1 ? 'الأول' : 'الثاني'}
                  </button>
                ))}
              </div>
              <button onClick={fetchData} title="تحديث"
                className="p-2 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              {myRegistrations.length > 0 && (
                <button onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-900 dark:border-white text-neutral-900 dark:text-white text-xs font-semibold hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors">
                  <Printer className="w-3.5 h-3.5" /> طباعة الاستمارة
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== FLASH MESSAGE ===== */}
        {actionMsg && (
          <div className={`mb-5 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${actionMsg.ok
            ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
            {actionMsg.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {actionMsg.text}
          </div>
        )}

        {/* ===== LOADING ===== */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>جاري تحميل بيانات التسجيل...</span>
          </div>

        ) : !registrationOpen ? (
          /* ===== REGISTRATION CLOSED ===== */
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">التسجيل الأكاديمي غير مفتوح حالياً</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
              التسجيل الدراسي مغلق حالياً لـ <strong>{level} — {loggedStudent.department}</strong>.
              يرجى مراجعة المرشد الأكاديمي أو إدارة شؤون الطلاب عند فتح مواعيد التسجيل الرسمية.
            </p>
          </div>

        ) : (
          <div className="space-y-6">

            {/* ===== STATS BAR ===== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'مقررات الفصل', value: eligibleCourses.length, icon: BookOpen, color: 'text-neutral-600 dark:text-neutral-300' },
                { label: 'متاح للتسجيل', value: eligibleCount, icon: Unlock, color: 'text-green-600 dark:text-green-400' },
                { label: 'متطلبات ناقصة', value: lockedCount, icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400' },
                { label: 'مقرراتي المسجلة', value: myRegistrations.length, icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 shrink-0 ${stat.color}`} />
                  <div>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== TABS ===== */}
            <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
              {[
                { key: 'courses', label: 'المقررات المتاحة', icon: GraduationCap },
                { key: 'registered', label: `مقرراتي (${myRegistrations.length})`, icon: FileText },
                { key: 'plan', label: 'خطة الدراسة', icon: Layers },
              ].map(tab => (
                <button key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${activeTab === tab.key
                    ? 'border-neutral-950 dark:border-white text-neutral-950 dark:text-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ===== TAB: AVAILABLE COURSES ===== */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                {eligibleCourses.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                    لا توجد مقررات لهذا الفصل. جرّب الفصل الآخر.
                  </div>
                ) : (
                  Object.entries(groupedCourses).map(([groupName, courses]) => (
                    <div key={groupName}>
                      {/* Group Header */}
                      <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${groupName.includes('محجوبة')
                        ? 'border-amber-200 dark:border-amber-900'
                        : 'border-neutral-200 dark:border-neutral-800'}`}>
                        {groupName.includes('محجوبة')
                          ? <AlertTriangle className="w-4 h-4 text-amber-500" />
                          : <Unlock className="w-4 h-4 text-green-500" />}
                        <h3 className={`text-sm font-bold ${groupName.includes('محجوبة')
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-neutral-900 dark:text-white'}`}>
                          {groupName}
                        </h3>
                        <span className="text-xs text-neutral-400">({courses.length} مقرر)</span>
                      </div>

                      {/* Course Cards */}
                      <div className="space-y-2">
                        {courses.map(course => {
                          const slots = getSlotsForCourse(course.code, 'محاضرة');
                          const sections = getSlotsForCourse(course.code, 'سكشن عملي');
                          const isExpanded = expandedCourse === course.code;
                          const regLecture = isRegisteredInCourse(course.code, 'محاضرة');
                          const regSection = isRegisteredInCourse(course.code, 'سكشن عملي');
                          const isFullyRegistered = registeredCodesSet.has(course.code);
                          const totalSlots = slots.length + sections.length;

                          return (
                            <div key={course.code} className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                              isFullyRegistered
                                ? 'border-green-300 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10'
                                : !course.finalEligible
                                ? 'border-amber-200 dark:border-amber-900/50 opacity-80'
                                : course.lockReason
                                ? 'border-red-200 dark:border-red-900/50 opacity-75'
                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                            }`}>

                              {/* Course Row */}
                              <button
                                onClick={() => setExpandedCourse(isExpanded ? null : course.code)}
                                className="w-full flex items-stretch gap-0 text-right">

                                {/* Type indicator strip */}
                                <div className={`w-1 shrink-0 ${
                                  isFullyRegistered ? 'bg-green-500' :
                                  !course.finalEligible ? 'bg-amber-400' :
                                  course.lockReason ? 'bg-red-500' :
                                  course.type === 'إجباري' ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-600'
                                }`} />

                                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60">
                                  {/* Course Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                                        {course.code}
                                      </span>
                                      <span className="font-bold text-neutral-900 dark:text-white text-sm">
                                        {course.nameAr}
                                      </span>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                                        course.type === 'إجباري'
                                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-500'
                                      }`}>
                                        {course.type}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                      <span className="text-xs text-neutral-400">{course.nameEn}</span>
                                      <span className="flex items-center gap-1 text-xs text-neutral-500">
                                        <Award className="w-3 h-3" /> {course.credits} ساعة معتمدة
                                      </span>
                                      {slots.length > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                                          <CalendarDays className="w-3 h-3" /> {slots.length} شعبة محاضرة
                                        </span>
                                      )}
                                      {sections.length > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                                          <FlaskConical className="w-3 h-3" /> {sections.length} سكشن عملي
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Status Badge */}
                                  <div className="shrink-0 flex items-center gap-2">
                                    {course.lockReason ? (
                                      <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg border border-red-200 dark:border-red-800">
                                        <Lock className="w-3 h-3" /> محجوب
                                      </span>
                                    ) : !course.finalEligible ? (
                                      <span className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <AlertTriangle className="w-3 h-3" /> ناقص متطلبات
                                      </span>
                                    ) : isFullyRegistered ? (
                                      <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-lg border border-green-200 dark:border-green-800">
                                        <CheckCircle2 className="w-3 h-3" /> مسجل
                                      </span>
                                    ) : totalSlots > 0 ? (
                                      <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <BookOpen className="w-3 h-3" /> {totalSlots} شعبة
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-xs text-neutral-400 px-2 py-1 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700">
                                        <XCircle className="w-3 h-3" /> لا شعب
                                      </span>
                                    )}
                                    {isExpanded
                                      ? <ChevronUp className="w-4 h-4 text-neutral-400" />
                                      : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                                  </div>
                                </div>
                              </button>

                              {/* ===== EXPANDED CONTENT ===== */}
                              {isExpanded && (
                                <div className="border-t border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950">

                                  {/* Missing prereqs warning */}
                                  {!course.finalEligible && course.missingPrereqs.length > 0 && (
                                    <div className="mx-4 mt-4 flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                      <div>
                                        <div className="font-bold mb-1">متطلبات سابقة ناقصة — لا يمكن التسجيل في هذا المقرر:</div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                          {course.missingPrereqs.map((p: any) => {
                                            const code = typeof p === 'string' ? p : (p?.code || JSON.stringify(p));
                                            const label = typeof p === 'string' ? p : (p?.nameAr ? `${p.code} (${p.nameAr})` : p?.code);
                                            return (
                                              <span key={code} className="font-mono bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                {label}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Lock reason */}
                                  {course.lockReason && (
                                    <div className="mx-4 mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                                      <Lock className="w-4 h-4 shrink-0" />
                                      <div><strong>محجوب بقرار إداري:</strong> {course.lockReason}</div>
                                    </div>
                                  )}

                                  {/* Override unlock notice */}
                                  {course.override?.action === 'unlock' && (
                                    <div className="mx-4 mt-4 flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
                                      <Unlock className="w-4 h-4 shrink-0" />
                                      <div><strong>مفتوح باستثناء إداري:</strong> {course.override.reason}</div>
                                    </div>
                                  )}

                                  {/* Slots */}
                                  {course.finalEligible && !course.lockReason && (
                                    <div className="p-4 space-y-4">
                                      {slots.length > 0 && (
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <CalendarDays className="w-3.5 h-3.5 text-neutral-500" />
                                            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">شعب المحاضرات</span>
                                          </div>
                                          <SlotList slots={slots} onRegister={handleRegister}
                                            registeringSlot={registeringSlot}
                                            isRegisteredInSlot={isRegisteredInSlot}
                                            alreadyRegisteredType={regLecture} />
                                        </div>
                                      )}
                                      {sections.length > 0 && (
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <FlaskConical className="w-3.5 h-3.5 text-neutral-500" />
                                            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">شعب السكاشن العملية</span>
                                          </div>
                                          <SlotList slots={sections} onRegister={handleRegister}
                                            registeringSlot={registeringSlot}
                                            isRegisteredInSlot={isRegisteredInSlot}
                                            alreadyRegisteredType={regSection} />
                                        </div>
                                      )}
                                      {slots.length === 0 && sections.length === 0 && (
                                        <div className="text-center py-6 text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                                          <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-30" />
                                          لم تُضف إدارة الكلية شعباً لهذا المقرر بعد
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Not eligible bottom spacing */}
                                  {(!course.finalEligible || course.lockReason) && <div className="pb-4" />}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== TAB: MY REGISTRATIONS ===== */}
            {activeTab === 'registered' && (
              <div>
                {myRegistrations.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p>لم تقم بالتسجيل في أي مقرر بعد.</p>
                    <p className="text-xs mt-1">اذهب لتبويب "المقررات المتاحة" وابدأ التسجيل.</p>
                  </div>
                ) : (
                  <div>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                      {[
                        { label: 'إجمالي المقررات', value: new Set(myRegistrations.map(r => r.courseCode)).size, color: 'text-neutral-900 dark:text-white' },
                        { label: 'شعب المحاضرات', value: myRegistrations.filter(r => r.type === 'محاضرة').length, color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'سكاشن عملية', value: myRegistrations.filter(r => r.type === 'سكشن عملي').length, color: 'text-purple-600 dark:text-purple-400' },
                      ].map(s => (
                        <div key={s.label} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 text-center">
                          <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Registrations Table */}
                    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                            <th className="text-right px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300 text-xs">#</th>
                            <th className="text-right px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300 text-xs">المقرر</th>
                            <th className="text-right px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300 text-xs">النوع</th>
                            <th className="text-right px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300 text-xs">الدكتور/المعيد</th>
                            <th className="text-right px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300 text-xs">القاعة</th>
                            <th className="text-right px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300 text-xs">اليوم والوقت</th>
                            <th className="text-center px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300 text-xs">إلغاء</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                          {myRegistrations.map((reg, idx) => (
                            <tr key={reg.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                              <td className="px-4 py-3 text-xs text-neutral-400">{idx + 1}</td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-neutral-900 dark:text-white text-sm">{reg.courseName}</div>
                                <div className="text-xs text-neutral-400 font-mono">{reg.courseCode}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${reg.type === 'محاضرة'
                                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                  : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'}`}>
                                  {reg.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{reg.instructor}</td>
                              <td className="px-4 py-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">{reg.hallNumber}</td>
                              <td className="px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">{reg.day} · {reg.time}</td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => handleCancel(reg.id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                  title="إلغاء التسجيل">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-sm font-bold hover:opacity-90 transition-opacity">
                        <Printer className="w-4 h-4" /> طباعة استمارة التسجيل الرسمية
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== TAB: STUDY PLAN ===== */}
            {activeTab === 'plan' && (
              <div>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">مقرراتي السابقة (المواد المجتازة)</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    هذه المواد تم اجتيازها وتُستخدم كمتطلبات سابقة لتحديد أهليتك في المقررات الحالية.
                  </p>
                  {loggedStudent.courses && loggedStudent.courses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            <th className="text-right pb-2 font-semibold text-neutral-500">كود المقرر</th>
                            <th className="text-right pb-2 font-semibold text-neutral-500">اسم المقرر</th>
                            <th className="text-center pb-2 font-semibold text-neutral-500">الساعات</th>
                            <th className="text-center pb-2 font-semibold text-neutral-500">التقدير</th>
                            <th className="text-center pb-2 font-semibold text-neutral-500">الدرجة</th>
                            <th className="text-center pb-2 font-semibold text-neutral-500">الحالة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                          {loggedStudent.courses.map((c, i) => (
                            <tr key={i} className="hover:bg-neutral-100 dark:hover:bg-neutral-800/50">
                              <td className="py-2 font-mono text-neutral-500 font-bold">{c.code}</td>
                              <td className="py-2 text-neutral-900 dark:text-white">{c.name}</td>
                              <td className="py-2 text-center text-neutral-500">{c.credits}</td>
                              <td className="py-2 text-center">
                                <span className={`px-1.5 py-0.5 rounded font-bold ${
                                  c.grade?.startsWith('A') ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30' :
                                  c.grade?.startsWith('B') ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' :
                                  'text-neutral-600 bg-neutral-100 dark:bg-neutral-800'
                                }`}>{c.grade}</span>
                              </td>
                              <td className="py-2 text-center text-neutral-600 dark:text-neutral-400">{c.score}</td>
                              <td className="py-2 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.status === 'ناجح' ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400' :
                                  c.status === 'راسب' ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' :
                                  'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                                }`}>{c.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-neutral-400 text-xs border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                      لا توجد مواد مسجلة في سجل الطالب
                    </div>
                  )}
                </div>

                {/* GPA Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'المعدل التراكمي', value: loggedStudent.cgpa?.toFixed(2), icon: Star, color: 'text-yellow-600 dark:text-yellow-400' },
                    { label: 'إجمالي الساعات', value: loggedStudent.totalCredits, icon: Award, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'المواد المجتازة', value: loggedStudent.courses?.filter(c => c.status === 'ناجح').length ?? 0, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400' },
                    { label: 'المرحلة الدراسية', value: loggedStudent.level.replace('الفرقة ', ''), icon: GraduationCap, color: 'text-neutral-700 dark:text-neutral-300' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 shrink-0 ${stat.color}`} />
                      <div>
                        <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
};

// ======== Slot List Sub-component ========
const SlotList: React.FC<{
  slots: CourseSlot[];
  onRegister: (id: string) => void;
  registeringSlot: string | null;
  isRegisteredInSlot: (id: string) => boolean;
  alreadyRegisteredType: boolean;
}> = ({ slots, onRegister, registeringSlot, isRegisteredInSlot, alreadyRegisteredType }) => (
  <div className="space-y-2">
    {slots.map(slot => {
      const isHere = isRegisteredInSlot(slot.id);
      const isFull = slot.isFull;
      const fillPct = Math.round((slot.enrolledCount / slot.capacity) * 100);
      return (
        <div key={slot.id} className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border text-sm transition-colors ${
          isHere
            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
            : isFull
            ? 'bg-red-50/30 dark:bg-red-950/10 border-red-200 dark:border-red-900/50 opacity-70'
            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
        }`}>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <User className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span className="text-xs truncate">{slot.instructor}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span className="font-mono text-xs">{slot.hallNumber}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <Clock className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span className="text-xs">{slot.day} · {slot.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <div className="flex-1">
                <div className={`text-xs mb-0.5 ${fillPct >= 100 ? 'text-red-500' : fillPct >= 75 ? 'text-amber-500' : 'text-neutral-500'}`}>
                  {slot.enrolledCount}/{slot.capacity}
                  {isFull ? ' — ممتلئة 🔴' : ` (${slot.available} متاح)`}
                </div>
                <div className="w-20 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${fillPct >= 100 ? 'bg-red-500' : fillPct >= 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(fillPct, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {isHere ? (
              <div className="flex items-center gap-1 text-green-700 dark:text-green-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> مسجل ✓
              </div>
            ) : alreadyRegisteredType ? (
              <div className="text-xs text-neutral-400 italic">مسجل في شعبة أخرى</div>
            ) : isFull ? (
              <div className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" /> ممتلئة
              </div>
            ) : (
              <button onClick={() => onRegister(slot.id)}
                disabled={registeringSlot === slot.id}
                className="px-5 py-1.5 text-xs font-bold rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 transition-colors">
                {registeringSlot === slot.id ? (
                  <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> جاري...</span>
                ) : 'تسجيل'}
              </button>
            )}
          </div>
        </div>
      );
    })}
  </div>
);
