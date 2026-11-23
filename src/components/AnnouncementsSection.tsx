import React, { useState, useEffect } from 'react';
import { Announcement } from '../types';
import {
  Bell,
  Calendar,
  ChevronLeft,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export const AnnouncementsSection: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<string>('الكل');

  // Admin Dashboard States (Password: 1234)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isPublishingOpen, setIsPublishingOpen] = useState<boolean>(false);

  // New Announcement Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('شؤون التعليم والطلاب');
  const [date, setDate] = useState('12 نوفمبر 2026');
  const [summary, setSummary] = useState('');
  const [important, setImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
    // Check if session token exists
    if (sessionStorage.getItem('fci_admin_token') === 'fci-qena-admin-session-active') {
      setIsAdmin(true);
    }
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch {
      // quiet fallback
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        sessionStorage.setItem('fci_admin_token', data.token);
        setShowLoginModal(false);
        setAdminPassword('');
        setActionMessage('مرحباً بك في لوحة تحكم إدارة الأخبار');
        setTimeout(() => setActionMessage(null), 3500);
      } else {
        setLoginError(data.error || 'كلمة المرور غير صحيحة');
      }
    } catch {
      setLoginError('تعذر الاتصال بالخادم');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('fci_admin_token');
    setIsPublishingOpen(false);
    setEditingId(null);
    setActionMessage('تم تسجيل خروج المشرف بنجاح');
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Edit existing announcement
        const res = await fetch(`/api/announcements/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, date, summary, important })
        });
        if (res.ok) {
          setActionMessage('تم تحديث الخبر بنجاح');
          setEditingId(null);
        }
      } else {
        // Create new announcement
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, date, summary, important })
        });
        if (res.ok) {
          setActionMessage('تم نشر الخبر الجديد بنجاح على اللوحة الرسمية');
        }
      }

      // Reset form & reload
      setTitle('');
      setSummary('');
      setImportant(false);
      setIsPublishingOpen(false);
      fetchAnnouncements();
      setTimeout(() => setActionMessage(null), 3500);
    } catch {
      setActionMessage('حدث خطأ أثناء حفظ الإعلان');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setCategory(ann.category);
    setDate(ann.date);
    setSummary(ann.summary);
    setImportant(ann.important);
    setIsPublishingOpen(true);
    // Scroll to form smoothly
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر من لوحة الإعلانات الرسمية؟')) return;

    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMessage('تم حذف الخبر بنجاح');
        fetchAnnouncements();
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {
      // quiet
    }
  };

  const categories = ['الكل', 'شؤون التعليم والطلاب', 'الجداول والامتحانات', 'الأنشطة والمسابقات', 'التدريب والتطوير'];

  const filtered = filter === 'الكل'
    ? announcements
    : announcements.filter(a => a.category === filter);

  return (
    <section className="py-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Admin Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
              OFFICIAL ANNOUNCEMENTS & CIRCULARS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white mt-1">
              لوحة الإعلانات والأخبار الأكاديمية
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
              التعاميم الرسمية الصادرة عن عمادة الكلية وإدارة شؤون الطلاب بجامعة جنوب الوادي بقنا.
            </p>
          </div>

          {/* Admin Dashboard Trigger Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPublishingOpen(!isPublishingOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isPublishingOpen ? 'إغلاق نموذج النشر' : 'نشر إعلان جديد'}</span>
                </button>

                <button
                  onClick={handleAdminLogout}
                  title="تسجيل خروج المشرف"
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>لوحة تحكم المشرف (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Action message flash */}
        {actionMessage && (
          <div className="mt-4 p-3 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Admin Publish / Edit Dashboard Drawer */}
        {isAdmin && isPublishingOpen && (
          <div className="mt-6 p-6 rounded-lg border border-neutral-950 dark:border-white bg-white dark:bg-neutral-950 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-neutral-950 dark:text-white" />
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                  {editingId ? 'تعديل الإعلان الأكاديمي' : 'نشر إعلان أكاديمي رسمي جديد'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPublishingOpen(false);
                  setEditingId(null);
                }}
                className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                    عنوان الإعلان *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: فتح باب تسجيل رغبات الأقسام التخصصية للعام الجامعي 2026..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                    التصنيف الأكاديمي *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none"
                  >
                    <option>شؤون التعليم والطلاب</option>
                    <option>الجداول والامتحانات</option>
                    <option>الأنشطة والمسابقات</option>
                    <option>التدريب والتطوير</option>
                    <option>عمادة الكلية</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                    تاريخ الإعلان
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="12 نوفمبر 2026"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={important}
                      onChange={(e) => setImportant(e.target.checked)}
                      className="rounded border-neutral-400 text-neutral-900 focus:ring-neutral-400 w-4 h-4"
                    />
                    <span>تمييز كإعلان عاجل ومهم (يظهر بخط مميز)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  ملخص وتفاصيل الخبر أو التعميم الرسمي *
                </label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="اكتب تفاصيل الإعلان والتعليمات للطلاب..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPublishingOpen(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  {isSubmitting ? 'جاري الحفظ...' : editingId ? 'تأكيد تعديل الخبر' : 'نشر الخبر فوراً'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter categories */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filter === cat
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="mt-8 space-y-4">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              className="p-5 sm:p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-2 max-w-3xl">
                {/* Meta unboxed */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <span>{ann.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.date}
                  </span>
                  {ann.important && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-neutral-900 dark:text-white underline decoration-1">
                        إعلان عاجل
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {ann.summary}
                </p>
              </div>

              {/* Actions Right Side */}
              <div className="flex items-center gap-3 sm:self-center shrink-0">
                {isAdmin ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(ann)}
                      className="p-2 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
                      title="تعديل هذا الخبر"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(ann.id)}
                      className="p-2 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-red-500 transition-colors text-xs flex items-center gap-1"
                      title="حذف هذا الخبر"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-neutral-200 hover:underline cursor-pointer">
                    <span>التفاصيل والتعليمات</span>
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Admin Password Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-950 dark:text-white">
                <Lock className="w-4 h-4" />
                <span>تسجيل دخول المسؤول (Admin)</span>
              </div>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError(null);
                  setAdminPassword('');
                }}
                className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              يرجى إدخال كلمة المرور المخصصة لإدارة ونشر الأخبار الأكاديمية (كلمة المرور: <span className="font-mono font-bold text-neutral-950 dark:text-white">1234</span>).
            </p>

            {loginError && (
              <div className="p-3 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-neutral-900 dark:text-white" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="ادخل 1234"
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded text-neutral-950 dark:text-white focus:outline-none font-mono text-center tracking-widest text-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  تأكيد الدخول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
