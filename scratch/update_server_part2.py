with open('server.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find studentsStore in server.ts
idx_start = text.find('let studentsStore: StudentRecord[] = [')
idx_end = text.find('// In-Memory Course Schedule Timetable Database')

old_students_block = text[idx_start:idx_end]

new_students_block = """let studentsStore: StudentRecord[] = [
  {
    seatNumber: '1042',
    nationalId: '30205122700145',
    name: 'أحمد محمود قناوي عبد الرحيم',
    level: 'الفرقة الرابعة',
    department: 'علوم الحاسب (CS)',
    academicAdvisor: 'أ.د. عصام الدين فؤاد',
    cgpa: 3.86,
    totalCredits: 132,
    status: 'مقيد - منتظم (ممتاز مع مرتبة الشرف)',
    examHall: 'مدرج 2 - الدور الثالث',
    seatLocation: 'الصف B - مقعد 14',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    courses: [
      // Level 1 passed
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A', points: 4.0, score: 90, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'A', points: 4.0, score: 92, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'A', points: 3.7, score: 89, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'A-', points: 3.5, score: 86, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'HU132', name: 'الكتابة التقنية', credits: 2, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS141', name: 'أساسيات البرمجة', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'MA112', name: 'الهياكل المتقطعة', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'MA121', name: 'الاحتمالات والإحصاء I', credits: 3, grade: 'A-', points: 3.5, score: 88, status: 'ناجح' },
      { code: 'MA113', name: 'رياضيات II', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'HU112', name: 'اللغة الإنجليزية II', credits: 2, grade: 'A', points: 3.7, score: 89, status: 'ناجح' },
      // Level 2 passed
      { code: 'MA222', name: 'الاحتمالات والإحصاء II', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'CS241', name: 'البرمجة كائنية التوجه', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'IT231', name: 'شبكات الحاسب I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'MA231', name: 'بحوث العمليات', credits: 3, grade: 'B+', points: 3.2, score: 83, status: 'ناجح' },
      { code: 'EE201', name: 'التصميم المنطقي', credits: 3, grade: 'A-', points: 3.5, score: 87, status: 'ناجح' },
      { code: 'IS221', name: 'إدارة المشروعات', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'IS212', name: 'تكنولوجيا الويب', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'CS211', name: 'هياكل البيانات I', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'CS291', name: 'النمذجة والمحاكاة', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'PH201', name: 'فيزياء', credits: 3, grade: 'B+', points: 3.2, score: 84, status: 'ناجح' },
      { code: 'IS211', name: 'قواعد البيانات', credits: 3, grade: 'A', points: 3.7, score: 94, status: 'ناجح' },
      { code: 'CS242', name: 'البرمجة المتوازية', credits: 3, grade: 'A-', points: 3.5, score: 88, status: 'ناجح' },
      // Level 3 CS passed
      { code: 'CS312', name: 'هياكل البيانات II', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'CS352', name: 'معالجة الصور', credits: 3, grade: 'A+', points: 4.0, score: 95, status: 'ناجح' },
      { code: 'CS391', name: 'هندسة البرمجيات', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'AI301', name: 'الذكاء الاصطناعي', credits: 3, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'CS321', name: 'نظم التشغيل I', credits: 3, grade: 'A-', points: 3.5, score: 87, status: 'ناجح' },
      { code: 'CS311', name: 'تحليل وتصميم الخوارزميات', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'CS341', name: 'مفاهيم لغات البرمجة', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'CS351', name: 'رسوميات الحاسب I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS331', name: 'البرمجة المرئية', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'CS322', name: 'معمارية وتنظيم الحاسبات', credits: 3, grade: 'A-', points: 3.5, score: 88, status: 'ناجح' },
      { code: 'IT302', name: 'التشفير', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'TR301', name: 'التدريب الميداني', credits: 3, grade: 'A+', points: 4.0, score: 99, status: 'ناجح' }
    ]
  },
  {
    seatNumber: '2058',
    nationalId: '30308142700892',
    name: 'فاطمة علي حسن النجار',
    level: 'الفرقة الثالثة',
    department: 'نظم المعلومات (IS)',
    academicAdvisor: 'أ.د. منال عبد الستار',
    cgpa: 3.68,
    totalCredits: 96,
    status: 'مقيد - منتظم (جيد جداً مرتفع)',
    examHall: 'مدرج 1 - الدور الأرضي',
    seatLocation: 'الصف D - مقعد 08',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    courses: [
      // Level 1 passed
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A', points: 4.0, score: 92, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'A', points: 4.0, score: 90, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'B+', points: 3.3, score: 84, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'B', points: 3.0, score: 79, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A', points: 3.7, score: 89, status: 'ناجح' },
      { code: 'HU132', name: 'الكتابة التقنية', credits: 2, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS141', name: 'أساسيات البرمجة', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'MA112', name: 'الهياكل المتقطعة', credits: 3, grade: 'B+', points: 3.3, score: 83, status: 'ناجح' },
      { code: 'MA121', name: 'الاحتمالات والإحصاء I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'MA113', name: 'رياضيات II', credits: 3, grade: 'B+', points: 3.3, score: 85, status: 'ناجح' },
      // Level 2 passed
      { code: 'MA222', name: 'الاحتمالات والإحصاء II', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS241', name: 'البرمجة كائنية التوجه', credits: 3, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'IT231', name: 'شبكات الحاسب I', credits: 3, grade: 'B+', points: 3.3, score: 84, status: 'ناجح' },
      { code: 'MA231', name: 'بحوث العمليات', credits: 3, grade: 'A', points: 3.7, score: 91, status: 'ناجح' },
      { code: 'EE201', name: 'التصميم المنطقي', credits: 3, grade: 'B+', points: 3.3, score: 83, status: 'ناجح' },
      { code: 'IS221', name: 'إدارة المشروعات', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'IS212', name: 'تكنولوجيا الويب', credits: 3, grade: 'A', points: 3.7, score: 94, status: 'ناجح' },
      { code: 'CS211', name: 'هياكل البيانات I', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'CS291', name: 'النمذجة والمحاكاة', credits: 3, grade: 'B+', points: 3.3, score: 85, status: 'ناجح' },
      { code: 'PH201', name: 'فيزياء', credits: 3, grade: 'B', points: 3.0, score: 78, status: 'ناجح' },
      { code: 'IS211', name: 'قواعد البيانات', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'CS242', name: 'البرمجة المتوازية', credits: 3, grade: 'B+', points: 3.3, score: 84, status: 'ناجح' }
    ]
  },
  {
    seatNumber: '3120',
    nationalId: '30402192701123',
    name: 'عبد الله محمد عبد الباسط الصاوي',
    level: 'الفرقة الثانية',
    department: 'المرحلة العامة (General)',
    academicAdvisor: 'د. خالد الدندراوي',
    cgpa: 3.92,
    totalCredits: 64,
    status: 'مقيد - منتظم (امتياز)',
    examHall: 'قاعة 3B - مبنى المعامل المركزية',
    seatLocation: 'الصف A - مقعد 03',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    courses: [
      // Level 1 passed
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'A+', points: 4.0, score: 99, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'A', points: 3.7, score: 93, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A+', points: 4.0, score: 100, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A+', points: 4.0, score: 96, status: 'ناجح' },
      { code: 'HU132', name: 'الكتابة التقنية', credits: 2, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'CS141', name: 'أساسيات البرمجة', credits: 3, grade: 'A+', points: 4.0, score: 99, status: 'ناجح' },
      { code: 'MA112', name: 'الهياكل المتقطعة', credits: 3, grade: 'A+', points: 4.0, score: 98, status: 'ناجح' },
      { code: 'MA121', name: 'الاحتمالات والإحصاء I', credits: 3, grade: 'A', points: 3.7, score: 94, status: 'ناجح' },
      { code: 'MA113', name: 'رياضيات II', credits: 3, grade: 'A+', points: 4.0, score: 97, status: 'ناجح' },
      { code: 'HU112', name: 'اللغة الإنجليزية II', credits: 2, grade: 'A', points: 3.7, score: 91, status: 'ناجح' }
    ]
  },
  {
    seatNumber: '4015',
    nationalId: '30501102700388',
    name: 'سارة إبراهيم محمد الدندراوي',
    level: 'الفرقة الأولى',
    department: 'المرحلة العامة (General)',
    academicAdvisor: 'د. مصطفى عبد اللطيف',
    cgpa: 3.55,
    totalCredits: 32,
    status: 'مقيد - منتظم (جيد جداً)',
    examHall: 'مدرج 3 - الدور الثاني',
    seatLocation: 'الصف C - مقعد 21',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    courses: [
      { code: 'HU111', name: 'اللغة الإنجليزية I', credits: 2, grade: 'A', points: 3.7, score: 92, status: 'ناجح' },
      { code: 'HU141', name: 'الحاسبات والأخلاقيات', credits: 2, grade: 'B+', points: 3.3, score: 83, status: 'ناجح' },
      { code: 'MA111', name: 'رياضيات I', credits: 3, grade: 'A-', points: 3.5, score: 86, status: 'ناجح' },
      { code: 'EE101', name: 'إلكترونيات', credits: 3, grade: 'B', points: 3.0, score: 78, status: 'ناجح' },
      { code: 'CS121', name: 'أساسيات علوم الحاسب', credits: 3, grade: 'A', points: 3.7, score: 90, status: 'ناجح' },
      { code: 'HU151', name: 'تاريخ الحوسبة', credits: 3, grade: 'A+', points: 4.0, score: 95, status: 'ناجح' }
    ]
  }
];

"""

text = text[:idx_start] + new_students_block + text[idx_end:]

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Students store updated with complete passed courses!')
