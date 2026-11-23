import React, { useState } from 'react';
import { X, Lock, User, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentRecord) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [identifier, setIdentifier] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !nationalId.trim()) {
      setError('يرجى إدخال اسم الطالب أو رقم الجلوس، والرقم القومي');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, nationalId })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('fci_logged_student', JSON.stringify(data.student));
        onLoginSuccess(data.student);
        onClose();
      } else {
        setError(data.error || 'فشل تسجيل الدخول. تأكد من صحة الاسم والرقم القومي');
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم الأكاديمي');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (name: string, natId: string) => {
    setIdentifier(name);
    setNationalId(natId);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl p-6 sm:p-7 text-neutral-900 dark:text-neutral-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                تسجيل دخول الطالب
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                بوابة الخدمات والمحادثات الأكاديمية · حاسبات قنا
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
              اسم الطالب أو رقم الجلوس *
            </label>
            <div className="relative">
              <User className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="مثال: أحمد محمود أو 1042"
                className="w-full pr-9 pl-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
              كلمة المرور (الرقم القومي - 14 رقم) *
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="أدخل الـ 14 رقماً للبطاقة القومية"
                className="w-full pr-9 pl-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 font-mono tracking-wider"
              />
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              ملاحظة: كلمة المرور الافتراضية لكل طالب مقيد هي رقمه القومي المعتمد بشؤون الطلاب.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 text-xs font-semibold text-white bg-neutral-950 dark:text-neutral-950 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-md transition-colors"
          >
            {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول إلى حسابي'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-850">
          <div className="text-[11px] font-semibold text-neutral-500 mb-2">
            حسابات تجريبية سريعة للتجربة الفورية:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('أحمد محمود', '30205122700145')}
              className="p-2 text-right rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="font-bold text-neutral-950 dark:text-white">أحمد محمود</div>
              <div className="text-[10px] text-neutral-500 font-mono">رابعة CS · 1042</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('فاطمة علي', '30308142700892')}
              className="p-2 text-right rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="font-bold text-neutral-950 dark:text-white">فاطمة علي</div>
              <div className="text-[10px] text-neutral-500 font-mono">ثالثة IS · 2058</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('عبد الله الصاوي', '30402192701123')}
              className="p-2 text-right rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="font-bold text-neutral-950 dark:text-white">عبد الله الصاوي</div>
              <div className="text-[10px] text-neutral-500 font-mono">ثانية AI · 3120</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('سارة إبراهيم', '30501102700388')}
              className="p-2 text-right rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="font-bold text-neutral-950 dark:text-white">سارة إبراهيم</div>
              <div className="text-[10px] text-neutral-500 font-mono">أولى عام · 4015</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
