import React, { useState, useEffect } from 'react';
import { ScheduleDay } from '../types';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const SchedulesSection: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState('الفرقة الأولى');
  const [selectedDay, setSelectedDay] = useState('الأحد');
  const [schedules, setSchedules] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(false);

  const levels = ['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة'];
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  useEffect(() => {
    fetchSchedules();
  }, [selectedLevel, selectedDay]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/schedules?level=${encodeURIComponent(selectedLevel)}&day=${encodeURIComponent(selectedDay)}`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch {
      // quiet fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="schedules" className="py-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
            LECTURES & LAB TIMETABLE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white mt-1">
            جداول المحاضرات والسكاشن العملية
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            مواعيد المحاضرات وقاعات التدريس والمعامل التخصصية للفصل الدراسي الحالي للعام الجامعي 2026/2027.
          </p>
        </div>

        {/* Filter Controls (Segmented clean buttons) */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Level Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Day Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedDay === d
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

        </div>

        {/* Schedules Content */}
        <div className="mt-8">
          {loading ? (
            <div className="p-12 text-center text-sm text-neutral-500 font-mono">
              جاري تحميل الجدول الأكاديمي...
            </div>
          ) : schedules.length > 0 ? (
            <div className="space-y-6">
              {schedules.map((sched, idx) => (
                <div
                  key={idx}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-950"
                >
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-950 dark:text-white">
                        {sched.level} — {sched.department}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">({sched.day})</span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {sched.items.length} فترات دراسية
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-200 dark:divide-neutral-850">
                    {sched.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded">
                              {item.type}
                            </span>
                            <span className="font-bold text-base text-neutral-950 dark:text-white">
                              {item.title}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              {item.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-neutral-400" />
                              {item.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              {item.hall}
                            </span>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <span className="text-xs font-mono text-neutral-500 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded border border-neutral-200 dark:border-neutral-800">
                            حضور إلزامي
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg text-neutral-500 text-sm">
              لا توجد محاضرات أو سكاشن مجدولة لهذا اليوم المحدد ({selectedDay}) لـ {selectedLevel}.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
