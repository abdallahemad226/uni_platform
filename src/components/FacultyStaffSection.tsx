import React, { useState, useEffect } from 'react';
import { StaffMember } from '../types';
import { Mail, MapPin, Clock, BookOpen, GraduationCap } from 'lucide-react';

export const FacultyStaffSection: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filterDept, setFilterDept] = useState<string>('الكل');

  useEffect(() => {
    fetch('/api/staff')
      .then(r => r.json())
      .then(d => setStaff(d))
      .catch(() => {});
  }, []);

  const departments = ['الكل', 'علوم الحاسب', 'نظم المعلومات', 'تكنولوجيا المعلومات', 'الذكاء الاصطناعي'];

  const filteredStaff = filterDept === 'الكل'
    ? staff
    : staff.filter(s => s.department.includes(filterDept));

  return (
    <section id="staff" className="py-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
            ACADEMIC LEADERSHIP & PROFESSORS DIRECTORY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white mt-1">
            عمادة الكلية وهيئة التدريس والبحث العلمي
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            نخبة من الأساتذة والباحثين المتخصصين في علوم الحاسب والذكاء الاصطناعي ونظم المعلومات بجامعة جنوب الوادي بقنا.
          </p>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 w-fit">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterDept === dept
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Staff Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member, index) => (
            <div
              key={index}
              className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-4">
                
                {/* Header with avatar initial */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-950 dark:text-white leading-snug">
                      {member.name}
                    </h3>
                    <div className="text-xs text-neutral-500 font-medium mt-0.5">
                      {member.department}
                    </div>
                  </div>
                </div>

                {/* Role */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                  {member.role}
                </p>

                {/* Details list */}
                <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-neutral-850">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <a
                      href={`mailto:${member.email}`}
                      className="font-mono hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{member.office}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>الساعات المكتبية: {member.officeHours}</span>
                  </div>
                </div>

                {/* Research Focus */}
                <div className="pt-2 text-xs">
                  <div className="text-[11px] font-semibold text-neutral-500 mb-1">
                    الاهتمامات البحثية:
                  </div>
                  <p className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                    {member.research}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
