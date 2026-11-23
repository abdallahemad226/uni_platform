import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Faculty Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-neutral-950 dark:text-white font-bold text-sm">
              <GraduationCap className="w-5 h-5" />
              <span>حاسبات ومعلومات قنا</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              كلية الحاسبات والمعلومات والذكاء الاصطناعي بجامعة جنوب الوادي في قنا. صرح تعليمي وبحثي رائد في صعيد مصر.
            </p>
            <div className="text-[11px] font-mono text-neutral-400">
              FACULTY OF COMPUTERS & ARTIFICIAL INTELLIGENCE · SOUTH VALLEY UNIVERSITY
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
              الروابط الأكاديمية
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#departments" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  أقسام علوم الحاسب ونظم المعلومات
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  استعلام نتائج الطلاب وأماكن اللجان
                </a>
              </li>
              <li>
                <a href="#schedules" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  جداول المحاضرات والسكاشن
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  معرض مشاريع التخرج السنوي
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
              بوابات رسمية
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="https://www.svu.edu.eg" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  بوابة جامعة جنوب الوادي الرئيسية
                </a>
              </li>
              <li>
                <a href="https://www.ekb.eg" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  بنك المعرفة المصري (EKB)
                </a>
              </li>
              <li>
                <a href="http://scu.eg" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  المجلس الأعلى للجامعات المصرية
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                  بوابة الشكاوى والمقترحات
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Address & Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
              العنوان والتواصل
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>مقر جامعة جنوب الوادي، الكيلو 6، طريق قنا - سفاجا، محافظة قنا، جمهورية مصر العربية</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>+20 (96) 521-1281 / 521-1282</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>fci@svu.edu.eg</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            جميع الحقوق محفوظة © 2026 كلية الحاسبات والمعلومات والذكاء الاصطناعي - جامعة جنوب الوادي بقنا.
          </div>
          <div className="font-mono">
            نظام الإدارة الأكاديمية الموحد · FCI SVU v2.6
          </div>
        </div>
      </div>
    </footer>
  );
};
