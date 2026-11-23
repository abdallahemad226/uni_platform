import React, { useState } from 'react';
import { Department } from '../types';
import { OFFICIAL_DEPARTMENTS } from '../data/departmentsData';
import {
  Terminal, Database, Wifi, BrainCircuit, Check, BookOpen,
  Award, Layers, FlaskConical, Search, FileText, ChevronRight,
  ShieldCheck, Info, CalendarDays, ExternalLink
} from 'lucide-react';

interface DepartmentsSectionProps {
  departments?: Department[];
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ departments: propDepts }) => {
  // Use official bylaws departments data if available, fallback to prop
  const departmentsList: Department[] = (OFFICIAL_DEPARTMENTS && OFFICIAL_DEPARTMENTS.length > 0)
    ? OFFICIAL_DEPARTMENTS
    : (propDepts || []);

  const [selectedDeptId, setSelectedDeptId] = useState<string>('cs');
  const [activeTab, setActiveTab] = useState<'overview' | 'fields' | 'plan'>('overview');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [fieldSearch, setFieldSearch] = useState<string>('');

  const getDeptIcon = (id: string) => {
    switch (id) {
      case 'cs':
        return <Terminal className="w-5 h-5" />;
      case 'is':
        return <Database className="w-5 h-5" />;
      case 'it':
        return <Wifi className="w-5 h-5" />;
      case 'ai':
        return <BrainCircuit className="w-5 h-5" />;
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  const activeDept = departmentsList.find(d => d.id === selectedDeptId) || departmentsList[0];

  const filteredFields = activeDept?.scientificFields?.filter(f =>
    !fieldSearch.trim() || f.toLowerCase().includes(fieldSearch.toLowerCase().trim())
  ) || [];

  const currentLevelPlan = activeDept?.studyPlan?.find(p => p.levelNumber === selectedLevel);

  return (
    <section id="departments" className="py-14 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-2">
                <span>ACADEMIC DEPARTMENTS & CURRICULUM</span>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">اللائحة الداخلية الرسمية (144 ساعة معتمدة)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white mt-1">
                الأقسام العلمية والخطط الدراسية
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-3xl">
                الأقسام الأكاديمية الأربعة بكلية الحاسبات والمعلومات جامعة جنوب الوادي المنشأة وفق المادتين (2) و (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950">
                <ShieldCheck className="w-3.5 h-3.5" />
                معتمدة بالقرار الوزاري
              </span>
            </div>
          </div>
        </div>

        {/* 4 Official Departments Selector Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentsList.map((dept) => {
            const isSelected = dept.id === selectedDeptId;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDeptId(dept.id);
                  // Default level to 3 if moving to dept-specific view
                  if (activeTab === 'plan' && selectedLevel < 3) setSelectedLevel(3);
                }}
                className={`text-right p-5 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-900 border-neutral-950 dark:border-white shadow-md ring-1 ring-neutral-950 dark:ring-white'
                    : 'bg-white/80 dark:bg-neutral-950/80 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-neutral-950 dark:bg-white" />
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${
                    isSelected
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {getDeptIcon(dept.id)}
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {dept.code}
                  </span>
                </div>

                <div className="font-extrabold text-base text-neutral-950 dark:text-white">
                  {dept.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                  {dept.nameEn}
                </div>
                <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {dept.description}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span>{dept.coursesCount} مقرر دراسي</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200">{dept.creditHoursTotal || 144} ساعة</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Department Showcase */}
        {activeDept && (
          <div className="mt-8 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
            
            {/* Department Banner Header */}
            <div className="p-6 sm:p-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
                    <span className="font-bold text-neutral-900 dark:text-white">{activeDept.code}</span>
                    <span>·</span>
                    <span>{activeDept.nameEn}</span>
                    <span>·</span>
                    <span>رئيس القسم: {activeDept.head}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                    {activeDept.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-200 bg-neutral-200/60 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                      <Award className="w-3.5 h-3.5" />
                      {activeDept.degree}
                    </span>
                    <span className="text-neutral-400">|</span>
                    <span>{activeDept.bylawsArticle}</span>
                  </div>
                </div>

                {/* Sub-Tabs Navigation */}
                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 self-start lg:self-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'overview'
                        ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    نظرة عامة والدرجة
                  </button>
                  <button
                    onClick={() => setActiveTab('fields')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'fields'
                        ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    المجالات العلمية (مادة 2)
                  </button>
                  <button
                    onClick={() => setActiveTab('plan')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'plan'
                        ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    الخطة والمقررات (ملحق 2)
                  </button>
                </div>
              </div>
            </div>

            {/* TAB 1: OVERVIEW & DEGREE BREAKDOWN */}
            {activeTab === 'overview' && (
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* 144 Hours Structure Bar (Article 25) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      توزيع الساعات المعتمدة للتخرج (144 ساعة معتمدة — مادة 25 باللائحة)
                    </h4>
                    <span className="text-xs font-mono font-bold text-neutral-500">CGPA ≥ 2.00</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {[
                      { label: 'متطلبات عامة', hours: 15, note: '9 إجباري + 6 اختياري', color: 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300' },
                      { label: 'رياضيات وعلوم أساسية', hours: 27, note: 'متطلبات كلية إجبارية', color: 'border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300' },
                      { label: 'علوم حاسب أساسية', hours: 36, note: 'متطلبات كلية إجبارية', color: 'border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300' },
                      { label: 'تخصص القسم الإجباري', hours: 39, note: 'مقررات تخصصية إجبارية', color: 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' },
                      { label: 'اختياري التخصص', hours: 18, note: 'مقررات يختارها الطالب', color: 'border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300' },
                      { label: 'مشروع وتدريب', hours: 9, note: '6 مشروع + 3 تدريب', color: 'border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300' },
                    ].map((item, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${item.color}`}>
                        <div className="text-xl font-black">{item.hours} <span className="text-xs font-normal">ساعة</span></div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1">{item.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (7 cols): Description & Objectives */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                        عن القسم ورسالته الأكاديمية
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {activeDept.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                        الأهداف والمخرجات الأكاديمية المستهدفة (NARS)
                      </h4>
                      <ul className="space-y-2.5">
                        {activeDept.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                        المعامل التخصصية التابعة للقسم
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeDept.labs.map((lab, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5"
                          >
                            <FlaskConical className="w-3.5 h-3.5 text-neutral-500" />
                            {lab}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (5 cols): Photo & Bylaw Summary */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 relative">
                      <img
                        src="/src/assets/images/computing_lab_qena_1794493198476.jpg"
                        alt="معمل الذكاء الاصطناعي والحوسبة المتقدمة بكلية الحاسبات قنا"
                        className="w-full h-56 object-cover grayscale contrast-120 brightness-95"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-300">LABORATORY & RESEARCH FACILITY</span>
                        <span className="text-sm font-bold text-white mt-0.5">معامل الأبحاث والبرمجيات المتقدمة بقنا</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                        <Info className="w-4 h-4 text-neutral-500" />
                        نظام الدراسة والتخصص (مادة 5 باللائحة)
                      </div>
                      <p className="leading-relaxed">
                        الدراسة في المستويين الأول والثاني (الفرقتين الأولى والثانية) مشتركة لجميع الطلاب، ويبدأ التخصص الأكاديمي الدقيق اعتبارا من <strong>المستوى الثالث (الفرقة الثالثة)</strong>.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: SCIENTIFIC FIELDS (ARTICLE 2) */}
            {activeTab === 'fields' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h4 className="text-base font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      المجالات العلمية التخصصية للقسم
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      وفقاً لنص <strong>المادة (2) من اللائحة الداخلية للكلية</strong> التي تحدد المجالات البحثية والتعليمية الرسمية للقسم.
                    </p>
                  </div>
                  
                  {/* Search bar inside fields */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={fieldSearch}
                      onChange={e => setFieldSearch(e.target.value)}
                      placeholder="بحث في مجالات القسم..."
                      className="w-full text-xs pr-8 pl-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white"
                    />
                  </div>
                </div>

                {filteredFields.length === 0 ? (
                  <div className="text-center py-12 text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                    لا توجد نتائج مطابقة لبحثك في مجالات {activeDept.name}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredFields.map((field, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex items-center gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {field}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STUDY PLAN (APPENDIX 2) */}
            {activeTab === 'plan' && (
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Level Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h4 className="text-base font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      الخطة الدراسية وتوزيع المقررات (ملحق 2 باللائحة)
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      توزيع مقررات الفصول الدراسية وفق نموذج المستويات المقترح باللائحة الداخلية الرسمية.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[1, 2, 3, 4].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedLevel === lvl
                            ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                            : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        المستوى {lvl === 1 ? 'الأول' : lvl === 2 ? 'الثاني' : lvl === 3 ? 'الثالث' : 'الرابع'}
                        {lvl <= 2 ? ' (مشترك)' : ` (${activeDept.code})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Semesters of Selected Level */}
                {currentLevelPlan ? (
                  <div className="space-y-8">
                    {currentLevelPlan.semesters.map(sem => (
                      <div key={sem.semesterNumber} className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                        
                        {/* Semester Bar */}
                        <div className="px-5 py-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-neutral-500" />
                            <span className="font-extrabold text-neutral-950 dark:text-white text-sm">
                              {sem.semesterName} (الفصل الدراسي {sem.semesterNumber})
                            </span>
                          </div>
                          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 font-mono">
                            إجمالي: {sem.totalCredits} ساعة معتمدة
                          </span>
                        </div>

                        {/* Courses Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                                <th className="text-right px-4 py-2.5">كود المقرر</th>
                                <th className="text-right px-4 py-2.5">اسم المقرر (بالعربية)</th>
                                <th className="text-right px-4 py-2.5">Course Name (English)</th>
                                <th className="text-center px-4 py-2.5">الساعات</th>
                                <th className="text-center px-4 py-2.5">النوع</th>
                                <th className="text-right px-4 py-2.5">المتطلب السابق</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                              {sem.courses.map((course, i) => (
                                <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                                  <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-white">
                                    {course.code}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                                    {course.nameAr}
                                  </td>
                                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 font-sans">
                                    {course.nameEn}
                                  </td>
                                  <td className="px-4 py-3 text-center font-bold text-neutral-800 dark:text-neutral-200">
                                    {course.credits}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      course.type === 'إجباري'
                                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950'
                                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                    }`}>
                                      {course.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    {course.prerequisites && course.prerequisites.length > 0 ? (
                                      <span className="font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[11px]">
                                        {course.prerequisites.join(', ')}
                                      </span>
                                    ) : (
                                      <span className="text-neutral-400 text-[11px]">— لا يوجد</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-neutral-400 text-xs border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                    لا تتوفر خطة دراسية لهذا المستوى
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
