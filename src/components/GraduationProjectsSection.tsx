import React, { useState, useEffect } from 'react';
import { ProjectRecord } from '../types';
import { Heart, Trophy, Users, UserCheck, ExternalLink, Code2 } from 'lucide-react';

export const GraduationProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedProjects, setVotedProjects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      // quiet fallback
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    if (votedProjects[id]) return;

    try {
      const res = await fetch(`/api/projects/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        setProjects(prev =>
          prev.map(p => (p.id === id ? { ...p, likes: result.likes } : p))
        );
        setVotedProjects(prev => ({ ...prev, [id]: true }));
      }
    } catch {
      // quiet
    }
  };

  return (
    <section id="projects" className="py-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
            CAPSTONE & GRADUATION INNOVATION GALLERY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white mt-1">
            معرض مشاريع التخرج والابتكارات البحثية
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            نماذج ومشاريع تطبيقية يقدمها خريجو كلية حاسبات قنا لخدمة قضايا الزراعة، الرعاية الصحية، الطاقة، والتحول الرقمي في صعيد مصر.
          </p>
        </div>

        {/* Featured Showcase Banner with B&W generated photo */}
        <div className="mt-8 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 grid grid-cols-1 lg:grid-cols-12 text-white">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
                <span>YEAR: 2025/2026</span>
                <span aria-hidden="true">·</span>
                <span>معرض بحوث التخرج السنوي</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                ملتقى الابتكار التكنولوجي لشباب حاسبات جامعة جنوب الوادي
              </h3>
              <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                يشارك طلاب السنة النهائية في مسابقات وطنية ودولية لتقديم حلول قائمة على أحدث تقنيات الرؤية الحاسوبية، النماذج اللغوية الكبيرة، والأنظمة المدمجة المخصصة لبيئة الصعيد.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-6 text-xs text-neutral-300">
              <span className="font-mono">310+ مشروع تخرج منذ التأسيس</span>
              <span className="font-mono">18 براءة اختراع ونموذج صناعي</span>
              <span className="font-mono">حاضنة أعمال تكنولوجية SVU</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[240px]">
            <img
              src="/src/assets/images/graduation_project_qena_1794493197939.jpg"
              alt="معرض مشاريع التخرج بكلية الحاسبات بقنا"
              className="w-full h-full object-cover grayscale contrast-125"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-4">
                
                {/* Meta unboxed */}
                <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                  <span>{proj.department}</span>
                  <span>{proj.year}</span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-lg font-bold text-neutral-950 dark:text-white leading-snug">
                    {proj.title}
                  </h4>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">
                    {proj.titleEn}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {proj.description}
                </p>

                {/* Award if present */}
                {proj.awards && (
                  <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Trophy className="w-4 h-4 shrink-0 text-neutral-900 dark:text-white" />
                    <span>{proj.awards}</span>
                  </div>
                )}

                {/* Technologies */}
                <div>
                  <div className="text-[11px] font-semibold text-neutral-500 mb-1.5">
                    التقنيات المستخدمة:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs font-mono bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-800 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Supervisor & Team */}
                <div className="text-xs text-neutral-500 space-y-1 pt-2 border-t border-neutral-150 dark:border-neutral-850">
                  <div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">الإشراف: </span>
                    <span>{proj.supervisor}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">فريق العمل: </span>
                    <span>{proj.teamMembers.join(' · ')}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Card Action: Vote / Like */}
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800">
                  الحالة: {proj.status}
                </span>

                <button
                  onClick={() => handleLike(proj.id)}
                  disabled={votedProjects[proj.id]}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                    votedProjects[proj.id]
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${votedProjects[proj.id] ? 'fill-current' : ''}`} />
                  <span>دعم المشروع</span>
                  <span className="font-mono tabular-nums">({proj.likes})</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
