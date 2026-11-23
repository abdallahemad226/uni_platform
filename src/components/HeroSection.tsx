import React from 'react';
import { Search, BookOpen, Layers, ArrowLeft, Award, Cpu, Users } from 'lucide-react';
import { FacultyStats } from '../types';

interface HeroSectionProps {
  stats: FacultyStats | null;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
  loggedStudent?: StudentRecord | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats, onNavigate, onOpenSearch, loggedStudent }) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left / Editorial Text Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Unboxed Metadata Header (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span>جامعة جنوب الوادي</span>
              <span aria-hidden="true">·</span>
              <span>مقر قنا الرئيسي</span>
              <span aria-hidden="true">·</span>
              <span>تأسست عام 2006</span>
              <span aria-hidden="true">·</span>
              <span>الاعتماد الأكاديمي للبرامج</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
                كلية الحاسبات والمعلومات والذكاء الاصطناعي
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-neutral-500 dark:text-neutral-400 mt-3 tracking-wide">
                Welcome!
              </p>
            </div>

            {/* Direct Action Hub */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-neutral-950 dark:text-neutral-950 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-md transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>{loggedStudent ? 'عرض سجلي الأكاديمي ودرجاتي' : 'دخول بوابة شؤون الطلاب والنتائج'}</span>
              </button>
            </div>



          </div>

          {/* Right / Visual Column (5 cols) with generated high-fidelity B&W photography */}
          <div className="lg:col-span-5 relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_faculty_qena_1794493197066.jpg"
              alt="المبنى الرئيسي لكلية الحاسبات والمعلومات جامعة جنوب الوادي بقنا"
              className="w-full h-full object-cover grayscale contrast-125 brightness-95"
              referrerPolicy="no-referrer"
            />
            {/* Subtle monochrome contrast gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <div className="text-xs uppercase tracking-wider text-neutral-300 font-mono">
                CAMPUS · QENA HEADQUARTERS
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                مبنى الحاسبات والذكاء الاصطناعي المركزي
              </div>
              <div className="text-xs text-neutral-300 mt-1">
                حرم جامعة جنوب الوادي - الكيلو 6 طريق قنا سفاجا
              </div>
            </div>
          </div>

        </div>



      </div>
    </section>
  );
};
