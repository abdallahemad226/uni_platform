import React, { useState, useEffect, useCallback } from 'react';
import {
  GitFork, Award, CheckCircle2, AlertCircle, ArrowUpDown, ChevronUp, ChevronDown,
  Printer, RefreshCw, FileText, Sparkles, Building2, ShieldCheck, Info, Check
} from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentSpecializationSectionProps {
  loggedStudent: StudentRecord;
  onSpecializationUpdated?: () => void;
}

interface SpecializationPref {
  id: string;
  studentSeat: string;
  studentName: string;
  studentLevel: string;
  cgpa: number;
  preferences: string[];
  submittedAt: string;
  assignedDepartment: string | null;
  status: 'قيد المراجعة' | 'تم الترشيح' | 'معتمد';
  notes?: string;
}

const DEPARTMENTS_INFO: Record<string, { code: string; nameAr: string; nameEn: string; desc: string; color: string; badge: string }> = {
  'CS': {
    code: 'CS',
    nameAr: 'علوم الحاسب',
    nameEn: 'Computer Science',
    desc: 'الخوارزميات، الحوسبة السحابية، أمن البيانات، وهندسة البرمجيات المعقدة.',
    color: 'from-blue-600 to-indigo-700',
    badge: 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  'AI': {
    code: 'AI',
    nameAr: 'الذكاء الاصطناعي',
    nameEn: 'Artificial Intelligence',
    desc: 'تعلم الآلة، الرؤية الحاسوبية، معالجة اللغات الطبيعية، والأنظمة الذكية والمستقلة.',
    color: 'from-purple-600 to-violet-700',
    badge: 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  'IT': {
    code: 'IT',
    nameAr: 'تكنولوجيا المعلومات',
    nameEn: 'Information Technology',
    desc: 'شبكات الحاسب، الأمن السيبراني، البنية التحتية، وإنترنت الأشياء والأنظمة المدمجة.',
    color: 'from-emerald-600 to-teal-700',
    badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  'IS': {
    code: 'IS',
    nameAr: 'نظم المعلومات',
    nameEn: 'Information Systems',
    desc: 'قواعد البيانات الضخمة، تحليل الأعمال، التنقيب في البيانات، وإدارة المنظومات المؤسسية.',
    color: 'from-amber-600 to-orange-700',
    badge: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  }
};

export const StudentSpecializationSection: React.FC<StudentSpecializationSectionProps> = ({
  loggedStudent,
  onSpecializationUpdated
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [existingPref, setExistingPref] = useState<SpecializationPref | null>(null);
  const [order, setOrder] = useState<string[]>(['AI', 'CS', 'IT', 'IS']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const isEligibleForBranching = loggedStudent.level.includes('الثانية') || 
                               loggedStudent.level.includes('الثالثة') || 
                               loggedStudent.department.includes('عام') ||
                               loggedStudent.department.includes('General');

  const flash = (text: string, ok: boolean) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchSpecialization = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/specialization/my?seatNumber=${loggedStudent.seatNumber}`);
      const data = await res.json();
      setIsOpen(data.isOpen ?? true);
      if (data.preference) {
        setExistingPref(data.preference);
        if (Array.isArray(data.preference.preferences) && data.preference.preferences.length === 4) {
          setOrder(data.preference.preferences);
        }
      }
    } catch {
      flash('فشل تحميل بيانات التشعيب الأكاديمي', false);
    } finally {
      setLoading(false);
    }
  }, [loggedStudent.seatNumber]);

  useEffect(() => {
    fetchSpecialization();
  }, [fetchSpecialization]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/specialization/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentSeat: loggedStudent.seatNumber,
          preferences: order
        })
      });
      const data = await res.json();
      if (res.ok) {
        flash(data.message || 'تم حفظ رغبات التشعيب بنجاح', true);
        await fetchSpecialization();
        if (onSpecializationUpdated) onSpecializationUpdated();
      } else {
        flash(data.error || 'حدث خطأ أثناء حفظ الرغبات', false);
      }
    } catch {
      flash('فشل الاتصال بالسيرفر', false);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const desiresPrint = order.map((code, idx) => {
      const dept = DEPARTMENTS_INFO[code];
      return `<tr>
        <td style="text-align:center;font-weight:bold;padding:10px;border:1px solid #ddd;">الرغبة ${idx + 1}</td>
        <td style="font-weight:bold;padding:10px;border:1px solid #ddd;">${dept?.nameAr || code} (${code})</td>
        <td style="color:#555;padding:10px;border:1px solid #ddd;">${dept?.nameEn || ''}</td>
        <td style="font-size:12px;color:#666;padding:10px;border:1px solid #ddd;">${dept?.desc || ''}</td>
      </tr>`;
    }).join('');

    const printContent = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8">
      <title>بطاقة رغبات التشعيب الأكاديمي — ${loggedStudent.name}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 25px; color: #111; line-height: 1.5; }
        .hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .univ { font-size: 13px; font-weight: bold; }
        .title { text-align: center; margin: 15px 0; }
        .title h2 { margin: 0; font-size: 19px; }
        .title p { margin: 4px 0 0; color: #555; font-size: 12px; }
        .box { background: #f9f9f9; border: 1px solid #ccc; border-radius: 6px; padding: 12px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #f0f0f0; padding: 10px; border: 1px solid #ccc; font-size: 13px; }
        .rule-box { border: 1px dashed #888; background: #fffbe6; padding: 10px; border-radius: 6px; font-size: 12px; margin: 18px 0; }
        .sig { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; font-size: 13px; }
        .sig-box { width: 28%; }
        .sig-line { border-bottom: 1px solid #333; height: 35px; margin-bottom: 5px; }
        .footer { text-align: center; font-size: 11px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
      </head><body>
      <div class="hdr">
        <div class="univ">جامعة جنوب الوادي<br>كلية الحاسبات والمعلومات بقنا<br>شؤون التعليم والطلاب</div>
        <div style="text-align:left;font-size:12px;color:#555;">التاريخ: ${new Date().toLocaleDateString('ar-EG')}<br>كود الاستمارة: SPEC-${loggedStudent.seatNumber}</div>
      </div>
      <div class="title">
        <h2>بطاقة رغبات التشعيب الأكاديمي الرسمية</h2>
        <p>طبقا للمادة (5) من اللائحة الداخلية لكلية الحاسبات والمعلومات بنظام الساعات المعتمدة</p>
      </div>
      <div class="box">
        <div class="grid">
          <div><strong>اسم الطالب:</strong> ${loggedStudent.name}</div>
          <div><strong>رقم الجلوس:</strong> ${loggedStudent.seatNumber}</div>
          <div><strong>الرقم القومي:</strong> ${loggedStudent.nationalId || '—'}</div>
          <div><strong>الفرقة المقيد بها:</strong> ${loggedStudent.level}</div>
          <div><strong>المعدل التراكمي (CGPA):</strong> ${loggedStudent.cgpa.toFixed(2)}</div>
          <div><strong>حالة القيد:</strong> ${loggedStudent.status}</div>
        </div>
      </div>
      <div class="rule-box">
        <strong>ضوابط وتنسيق التشعيب (المادة 5 من اللائحة):</strong>
        يتم توزيع الطلاب على الأقسام العلمية (علوم الحاسب CS، تكنولوجيا المعلومات IT، نظم المعلومات IS، الذكاء الاصطناعي AI) بنهاية المستوى الثاني بناءً على: (1) رغبة الطالب، (2) المعدل التراكمي CGPA، (3) الأعداد المقررة بمجالس الأقسام ومجلس الكلية.
      </div>
      <h3 style="font-size:15px;margin-bottom:6px;">ترتيب رغبات الطالب المعتمدة:</h3>
      <table>
        <thead>
          <tr>
            <th style="width:18%;">الترتيب</th>
            <th style="width:28%;">اسم القسم الأكاديمي</th>
            <th style="width:24%;">English Name</th>
            <th>المجال والتخصص</th>
          </tr>
        </thead>
        <tbody>
          ${desiresPrint}
        </tbody>
      </table>
      ${existingPref?.assignedDepartment ? `
        <div style="margin-top:20px;padding:12px;background:#e6f7ff;border:1px solid #91d5ff;border-radius:6px;font-size:14px;font-weight:bold;color:#0050b3;">
          القرار الإداري: تم ترشيح الطالب لقسم (${existingPref.assignedDepartment}) — حالة الترشيح: ${existingPref.status}
        </div>
      ` : ''}
      <div class="sig">
        <div class="sig-box"><div class="sig-line"></div><div>توقيع الطالب المقر برغباته</div></div>
        <div class="sig-box"><div class="sig-line"></div><div>توقيع المرشد الأكاديمي</div></div>
        <div class="sig-box"><div class="sig-line"></div><div>يعتمد، وكيل الكلية لشؤون التعليم والطلاب</div></div>
      </div>
      <div class="footer">— صادرة من المنصة الرقمية الرسمية لكلية الحاسبات والمعلومات — جامعة جنوب الوادي بقنا —</div>
      </body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.print();
    }
  };

  return (
    <section id="specialization" className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
              <GitFork className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
              ACADEMIC SPECIALIZATION & BRANCHING &bull; المادة (5) باللائحة
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              التشعيب الأكاديمي وتوزيع الأقسام
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950">
                المستوى الثالث
              </span>
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              تسجيل وترتيب رغبات التخصص للأقسام الأكاديمية الأربعة (CS - IT - IS - AI) وفقاً للائحة الكلية الداخلية
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSpecialization}
              title="تحديث"
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-900 transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-900 dark:border-white text-neutral-900 dark:text-white text-xs font-bold hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors bg-white dark:bg-neutral-900 shadow-sm">
              <Printer className="w-4 h-4" />
              طباعة استمارة الرغبات الرسمية
            </button>
          </div>
        </div>

        {/* Action Flash Message */}
        {message && (
          <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
            message.ok
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            {message.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        {/* Current Allocation Result Card (If already assigned or submitted) */}
        {existingPref && existingPref.assignedDepartment && (
          <div className="mb-8 p-5 rounded-2xl border-2 border-neutral-900 dark:border-white bg-white dark:bg-neutral-900 shadow-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xl shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-400">OFFICIAL ALLOCATION RESULT &bull; نتيجة التنسيق</div>
                  <div className="text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-white">
                    تم ترشيحك رسمياً لقسم: <span className="underline decoration-neutral-900 dark:decoration-white">{existingPref.assignedDepartment}</span>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    حالة الاعتماد: <span className="font-bold text-neutral-900 dark:text-white">{existingPref.status}</span> &bull; تم التنسيق بناءً على المعدل التراكمي ({existingPref.cgpa.toFixed(2)})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  رغبة معتمدة
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bylaws Article 5 Criteria Notice */}
        <div className="mb-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <strong className="text-neutral-950 dark:text-white block mb-1">
                قواعد التشعيب الأكاديمي بموجب المادة (5) من اللائحة الداخلية للكلية:
              </strong>
              يبدأ التخصص بالأقسام العلمية (علوم الحاسب CS، تكنولوجيا المعلومات IT، نظم المعلومات IS، الذكاء الاصطناعي AI) من المستوى الثالث (الفرقة الثالثة). ويتم توزيع الطلاب وفق المعايير الثلاثة المعتمدة:
              <span className="font-semibold text-neutral-900 dark:text-white"> (1) رغبة الطالب المرتبة </span> &bull; 
              <span className="font-semibold text-neutral-900 dark:text-white"> (2) المعدل التراكمي CGPA ({loggedStudent.cgpa.toFixed(2)}) </span> &bull; 
              <span className="font-semibold text-neutral-900 dark:text-white"> (3) السعة الاستيعابية المعتمدة لمجالس الأقسام والكلية.</span>
            </div>
          </div>
        </div>

        {/* Desires Sorter / Interactive Ranking */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                ترتيب رغباتك الأكاديمية (قم بتحريك الأقسام للأعلى أو الأسفل)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                الرغبة الأولى هي الأكثر تفضيلاً لديك ويتم البدء بالتنسيق بها أولاً
              </p>
            </div>
            {existingPref?.submittedAt && (
              <span className="text-xs text-neutral-400">
                آخر تحديث: {existingPref.submittedAt}
              </span>
            )}
          </div>

          {/* List of 4 Desires */}
          <div className="space-y-3 mb-6">
            {order.map((code, idx) => {
              const dept = DEPARTMENTS_INFO[code];
              if (!dept) return null;
              const isFirst = idx === 0;
              const isLast = idx === order.length - 1;

              return (
                <div
                  key={code}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150 ${
                    isFirst
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-950 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}>
                  {/* Rank Badge */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    isFirst
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Department Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-neutral-950 dark:text-white">
                        {dept.nameAr}
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        {dept.code}
                      </span>
                      <span className="text-xs text-neutral-400 hidden sm:inline">
                        &bull; {dept.nameEn}
                      </span>
                      {isFirst && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950">
                          الرغبة الأولى
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1 sm:line-clamp-none">
                      {dept.desc}
                    </p>
                  </div>

                  {/* Ordering Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={isFirst || !isOpen}
                      title="تحريك لأعلى"
                      className={`p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors ${
                        isFirst || !isOpen
                          ? 'opacity-30 cursor-not-allowed text-neutral-400'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200'
                      }`}>
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={isLast || !isOpen}
                      title="تحريك لأسفل"
                      className={`p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors ${
                        isLast || !isOpen
                          ? 'opacity-30 cursor-not-allowed text-neutral-400'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200'
                      }`}>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {isOpen ? (
                <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> باب تقديم وتعديل رغبات التشعيب مفتوح حالياً
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> باب التقديم للتشعيب مغلق حالياً من قِبل إدارة الكلية
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={saving || !isOpen}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  saving || !isOpen
                    ? 'opacity-50 cursor-not-allowed bg-neutral-400 text-white'
                    : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md'
                }`}>
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    جاري حفظ الرغبات...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {existingPref ? 'تحديث وحفظ الرغبات' : 'تسجيل الرغبات رسمياً'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
