import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Save,
  UserCheck
} from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
  onAvatarUpdated: (updatedStudent: StudentRecord) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80'
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onAvatarUpdated
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(student.avatar || PRESET_AVATARS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    const avatarToSave = customUrl.trim() || selectedAvatar;
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/students/${student.seatNumber}/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: avatarToSave })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('تم حفظ وتحديث صورتك الشخصية بنجاح');
        const updated = { ...student, avatar: avatarToSave };
        localStorage.setItem('fci_logged_student', JSON.stringify(updated));
        onAvatarUpdated(updated);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        alert(data.error || 'تعذر تحديث الصورة');
      }
    } catch {
      alert('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl p-6 sm:p-7 text-neutral-900 dark:text-neutral-100 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                الملف الشخصي للطالب (Student Profile)
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                السجل الأكاديمي الرقمي الرسمي المعتمد
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Info & Avatar Upload Section */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          
          {/* Avatar Column (5 cols) */}
          <div className="sm:col-span-5 flex flex-col items-center text-center p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
            <div className="relative group">
              <img
                src={selectedAvatar}
                alt={student.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-neutral-950 dark:border-white shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span>رفع صورة</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <h4 className="font-bold text-sm text-neutral-950 dark:text-white mt-3">
              {student.name}
            </h4>
            <div className="text-xs text-neutral-500 font-mono mt-0.5">
              رقم الجلوس: {student.seatNumber}
            </div>
            <div className="text-xs text-neutral-700 dark:text-neutral-300 font-medium mt-1">
              {student.department}
            </div>

            {/* Avatar presets */}
            <div className="w-full mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] text-neutral-500 block mb-2 font-semibold">
                اختر صورة جاهزة أو ارفع صورتك:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedAvatar(url);
                      setCustomUrl('');
                    }}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                      selectedAvatar === url ? 'border-neutral-950 dark:border-white scale-110' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Upload button directly */}
              <div className="mt-3">
                <label
                  htmlFor="avatar-upload-btn"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة من جهازك</span>
                </label>
                <input
                  id="avatar-upload-btn"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleSaveAvatar}
                disabled={isSaving}
                className="mt-3 w-full py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 transition-colors shadow-sm"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ الصورة الجديدة'}
              </button>
            </div>
          </div>

          {/* Academic Details Column (7 cols) */}
          <div className="sm:col-span-7 space-y-3">
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">الرقم القومي (كلمة المرور):</span>
                <span className="font-mono font-bold text-neutral-950 dark:text-white">{student.nationalId}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">الفرقة الدراسية:</span>
                <span className="font-bold">{student.level}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">المرشد الأكاديمي:</span>
                <span className="font-medium">{student.academicAdvisor}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">المعدل التراكمي CGPA:</span>
                <span className="font-mono font-extrabold text-sm text-neutral-950 dark:text-white">{student.cgpa.toFixed(2)} / 4.00</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">الساعات المجتازة:</span>
                <span className="font-mono font-bold">{student.totalCredits} ساعة معتمدة</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">لجنة الامتحان:</span>
                <span className="font-medium">{student.examHall}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">مكان المقعد:</span>
                <span className="font-mono">{student.seatLocation}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
              <span className="font-bold text-neutral-950 dark:text-white block">ميزة المحادثات والتواصل الداخلي:</span>
              <span>يمكنك الآن مراسلة زملائك بالكلية ومناقشة مشاريع التخرج وتدريبات ICPC عبر نظام المحادثات الداخلي بالضغط على أيقونة الرسائل في شريط التنقل.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
