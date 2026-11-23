import { Department } from '../types';

export const OFFICIAL_DEPARTMENTS: Department[] = [
  {
    id: 'cs',
    code: 'CS',
    name: 'قسم علوم الحاسب',
    nameEn: 'Computer Science (CS)',
    head: 'أ.د. عصام الدين فؤاد',
    description: 'يختص القسم بالأسس النظرية والتطبيقية للحوسبة، هندسة البرمجيات المعقدة، تصميم الخوارزميات المتقدمة، التعلم الآلي، ورؤية الحاسب والنظم الذكية.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (علوم الحاسب)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 42,
    creditHoursTotal: 144,
    labs: [
      'معمل الذكاء الاصطناعي والحوسبة المتقدمة',
      'معمل الخوارزميات وهندسة البرمجيات',
      'معمل معالجة الصور الرقمية والرؤية الحاسوبية',
      'معمل الحوسبة السحابية والموزعة'
    ],
    objectives: [
      'بناء برمجيات معقدة عالية الكفاءة والأمان والجودة وفق منهجيات هندسة البرمجيات الدولية',
      'تطوير وتطبيق نماذج الذكاء الاصطناعي والتعلم العميق والرؤية الحاسوبية لخدمة قضايا التنمية بصعيد مصر',
      'تأهيل الكوادر للمنافسة في مسابقات البرمجة العالمية ICPC وسوق العمل الإقليمي والدولي',
      'إجراء البحوث العلمية المتقدمة في النظم الذكية ومترجمات لغات البرمجة ونظم الحوسبة المتوازية'
    ],
    hoursBreakdown: {
      general: 15,
      collegeMathBasic: 27,
      collegeCSBasic: 36,
      specializationCompulsory: 39,
      specializationElective: 18,
      graduationProject: 6,
      fieldTraining: 3
    },
    scientificFields: [
      'برمجة الحاسبات',
      'لغات الحاسب ومترجماتها',
      'هياكل البيانات',
      'تحليل وتصميم الخوارزميات',
      'الخوارزميات الجينية',
      'نظم تشغيل الحاسبات',
      'بنية وتنظيم الحاسبات',
      'تشفير وأمن البيانات',
      'ضغط البيانات',
      'أمن الحاسب',
      'هندسة البرمجيات',
      'معالجة الصور الرقمية',
      'معالجة اللغات الطبيعية',
      'رؤية الحاسب (Computer Vision)',
      'الشبكات العصبية الاصطناعية',
      'الرسم بالحاسب والرسوميات',
      'نظم الوكلاء المتعددة (Multi-Agent Systems)',
      'نظم قواعد المعرفة',
      'المعالجة على التوازي والنظم الموزعة',
      'الحوسبة السحابية (Cloud Computing)',
      'نظم التعلم الذكية',
      'تعليم الحاسبات',
      'التعرف على النماذج (Pattern Recognition)',
      'تعريب الحاسبات',
      'النمذجة والمحاكاة ثنائية وثلاثية الأبعاد',
      'مواصفات الحاسبات'
    ],
    studyPlan: [
      {
        levelNumber: 1,
        levelName: 'المستوى الأول (مشترك عام)',
        semesters: [
          {
            semesterNumber: 1,
            semesterName: 'الفصل الدراسي الأول',
            totalCredits: 16,
            courses: [
              { code: 'HU111', nameAr: 'اللغة الإنجليزية I', nameEn: 'English Language I', credits: 2, type: 'إجباري' },
              { code: 'HU141', nameAr: 'الحاسبات والأخلاقيات', nameEn: 'Computers and Ethics', credits: 2, type: 'إجباري' },
              { code: 'MA111', nameAr: 'رياضيات I', nameEn: 'Math I', credits: 3, type: 'إجباري' },
              { code: 'EE101', nameAr: 'إلكترونيات', nameEn: 'Electronics', credits: 3, type: 'إجباري' },
              { code: 'CS121', nameAr: 'أساسيات علوم الحاسب', nameEn: 'Computer Science Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'HU151', nameAr: 'تاريخ الحوسبة', nameEn: 'History of Computing', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 2,
            semesterName: 'الفصل الدراسي الثاني',
            totalCredits: 16,
            courses: [
              { code: 'HU132', nameAr: 'الكتابة التقنية', nameEn: 'Technical Writing', credits: 2, type: 'إجباري' },
              { code: 'CS141', nameAr: 'أساسيات البرمجة', nameEn: 'Programming Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'MA112', nameAr: 'الهياكل المتقطعة', nameEn: 'Discrete Structures', credits: 3, type: 'إجباري' },
              { code: 'MA121', nameAr: 'الاحتمالات والإحصاء I', nameEn: 'Probability and Statistics I', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'MA113', nameAr: 'رياضيات II', nameEn: 'Math II', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'HU112', nameAr: 'اللغة الإنجليزية II', nameEn: 'English Language II', credits: 2, type: 'اختياري', prerequisites: ['HU111'] },
              { code: 'HU122', nameAr: 'التسويق والمبيعات', nameEn: 'Marketing and Sales', credits: 2, type: 'اختياري' },
              { code: 'HU153', nameAr: 'التفكير العلمي', nameEn: 'Scientific Thinking', credits: 2, type: 'اختياري' },
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        levelName: 'المستوى الثاني (مشترك عام)',
        semesters: [
          {
            semesterNumber: 3,
            semesterName: 'الفصل الدراسي الثالث',
            totalCredits: 18,
            courses: [
              { code: 'MA222', nameAr: 'الاحتمالات والإحصاء II', nameEn: 'Probability and Statistics II', credits: 3, type: 'إجباري', prerequisites: ['MA121'] },
              { code: 'CS241', nameAr: 'البرمجة كائنية التوجه', nameEn: 'Object-Oriented Programming', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'IT231', nameAr: 'شبكات الحاسب I', nameEn: 'Computer Networks I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
              { code: 'MA231', nameAr: 'بحوث العمليات', nameEn: 'Operations Research', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'EE201', nameAr: 'التصميم المنطقي', nameEn: 'Logic Design', credits: 3, type: 'إجباري', prerequisites: ['EE101'] },
              { code: 'IS221', nameAr: 'إدارة المشروعات', nameEn: 'Project Management', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
            ]
          },
          {
            semesterNumber: 4,
            semesterName: 'الفصل الدراسي الرابع',
            totalCredits: 18,
            courses: [
              { code: 'IS212', nameAr: 'تكنولوجيا الويب', nameEn: 'Web Technology', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS211', nameAr: 'هياكل البيانات I', nameEn: 'Data Structures I', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS291', nameAr: 'النمذجة والمحاكاة', nameEn: 'Modeling and Simulation', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'PH201', nameAr: 'فيزياء', nameEn: 'Physics', credits: 3, type: 'إجباري' },
              { code: 'IS211', nameAr: 'قواعد البيانات', nameEn: 'Databases', credits: 3, type: 'إجباري' },
              { code: 'CS242', nameAr: 'البرمجة المتوازية', nameEn: 'Parallel Programming', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
            ]
          }
        ]
      },
      {
        levelNumber: 3,
        levelName: 'المستوى الثالث (تخصص علوم الحاسب)',
        semesters: [
          {
            semesterNumber: 5,
            semesterName: 'الفصل الدراسي الخامس',
            totalCredits: 18,
            courses: [
              { code: 'CS312', nameAr: 'هياكل البيانات II', nameEn: 'Data Structures II', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'CS352', nameAr: 'معالجة الصور', nameEn: 'Image Processing', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS391', nameAr: 'هندسة البرمجيات', nameEn: 'Software Engineering', credits: 3, type: 'إجباري' },
              { code: 'AI301', nameAr: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'CS321', nameAr: 'نظم التشغيل I', nameEn: 'Operating Systems I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
              { code: 'CS311', nameAr: 'تحليل وتصميم الخوارزميات', nameEn: 'Algorithms Analysis and Design', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
            ]
          },
          {
            semesterNumber: 6,
            semesterName: 'الفصل الدراسي السادس',
            totalCredits: 18,
            courses: [
              { code: 'CS341', nameAr: 'مفاهيم لغات البرمجة', nameEn: 'Concepts of Programming Languages', credits: 3, type: 'إجباري', prerequisites: ['CS312'] },
              { code: 'CS351', nameAr: 'رسوميات الحاسب I', nameEn: 'Computer Graphics I', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'CS331', nameAr: 'البرمجة المرئية', nameEn: 'Visual Programming', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'CS322', nameAr: 'معمارية وتنظيم الحاسبات', nameEn: 'Computer Architecture and Organization', credits: 3, type: 'إجباري', prerequisites: ['EE201'] },
              { code: 'IT302', nameAr: 'التشفير', nameEn: 'Cryptography', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'TR301', nameAr: 'التدريب الميداني', nameEn: 'Field Training', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      },
      {
        levelNumber: 4,
        levelName: 'المستوى الرابع (تخصص علوم الحاسب وتخرج)',
        semesters: [
          {
            semesterNumber: 7,
            semesterName: 'الفصل الدراسي السابع',
            totalCredits: 18,
            courses: [
              { code: 'AI413', nameAr: 'تعلم الآلة', nameEn: 'Machine Learning', credits: 3, type: 'إجباري', prerequisites: ['MA113', 'MA222'] },
              { code: 'CS401', nameAr: 'نظرية الحوسبة', nameEn: 'Computation Theory', credits: 3, type: 'إجباري', prerequisites: ['MA112'] },
              { code: 'CS442', nameAr: 'برمجة الأنظمة المدمجة', nameEn: 'Embedded Systems Programming', credits: 3, type: 'اختياري' },
              { code: 'CS443', nameAr: 'برمجة الهواتف المحمولة', nameEn: 'Mobile Programming', credits: 3, type: 'اختياري' },
              { code: 'CS464', nameAr: 'اكتشاف المعرفة', nameEn: 'Knowledge Discovery', credits: 3, type: 'اختياري' },
              { code: 'CS481', nameAr: 'مشروع التخرج (الجزء الأول)', nameEn: 'Graduation Project (Part 1)', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 8,
            semesterName: 'الفصل الدراسي الثامن',
            totalCredits: 18,
            courses: [
              { code: 'CS441', nameAr: 'بناء المترجمات', nameEn: 'Compiler Construction', credits: 3, type: 'إجباري', prerequisites: ['CS322'] },
              { code: 'CS453', nameAr: 'رؤية الحاسب', nameEn: 'Computer Vision', credits: 3, type: 'إجباري', prerequisites: ['CS351', 'CS352'] },
              { code: 'CS431', nameAr: 'تحليل البيانات الضخمة', nameEn: 'Big Data Analysis', credits: 3, type: 'اختياري' },
              { code: 'AI401', nameAr: 'معالجة اللغات الطبيعية', nameEn: 'Natural Language Processing', credits: 3, type: 'اختياري' },
              { code: 'AI435', nameAr: 'الحوسبة الضبابية', nameEn: 'Fuzzy Computing', credits: 3, type: 'اختياري' },
              { code: 'CS481', nameAr: 'مشروع التخرج (الجزء الثاني)', nameEn: 'Graduation Project (Part 2)', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'it',
    code: 'IT',
    name: 'قسم تكنولوجيا المعلومات',
    nameEn: 'Information Technology (IT)',
    head: 'د. وليد البصيلي',
    description: 'يغطي شبكات الحاسب المتقدمة، اتصالات البيانات، إنترنت الأشياء (IoT)، الأمن السيبراني واختبار الاختراق، ومعالجة الإشارات والوسائط المتعددة.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (تكنولوجيا المعلومات)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 40,
    creditHoursTotal: 144,
    labs: [
      'معمل شبكات سيسكو Cisco المتطورة',
      'معمل الأمن السيبراني واختبار الاختراق',
      'معمل إنترنت الأشياء والمتحكمات الدقيقة',
      'معمل معالجة الإشارات والوسائط المتعددة'
    ],
    objectives: [
      'تصميم وإدارة الشبكات السلكية واللاسلكية المعقدة وحماية البنية التحتية الرقمية',
      'مكافحة التهديدات السيبرانية وتطبيق معايير التشفير والأمان المتقدمة',
      'بناء حلول الأنظمة المدمجة وإنترنت الأشياء والمدن الذكية',
      'تحليل ومعالجة إشارات الاتصالات الرقمية والوسائط المتعددة'
    ],
    hoursBreakdown: {
      general: 15,
      collegeMathBasic: 27,
      collegeCSBasic: 36,
      specializationCompulsory: 39,
      specializationElective: 18,
      graduationProject: 6,
      fieldTraining: 3
    },
    scientificFields: [
      'شبكات الحاسبات بأنواعها المختلفة',
      'شبكات المعلومات وتطبيقاتها',
      'تكنولوجيا الاتصالات',
      'تكنولوجيا الإنترنت',
      'بروتوكولات وبرمجة الإنترنت',
      'تأمين وسرية المعلومات والشبكات',
      'معالجة الإشارات الرقمية (DSP)',
      'نظم الزمن الحقيقي',
      'النظم الرقمية',
      'عمارة الحاسبات والمعالجات',
      'المعالجات الدقيقة وتطبيقاتها',
      'الأنظمة المدمجة (Embedded Systems)',
      'الحاسبات الذكية والكمية',
      'نظم الحاسبات ذات الأعطال المحتملة',
      'نظم الحاسبات الموزعة والمتوازية',
      'الأمن السيبراني والدفاع الرقمي',
      'النظم الديناميكية والإنسان الآلي',
      'التعلم الإلكتروني',
      'المكتبات الرقمية',
      'الأعمال والتجارة الإلكترونية'
    ],
    studyPlan: [
      {
        levelNumber: 1,
        levelName: 'المستوى الأول (مشترك عام)',
        semesters: [
          {
            semesterNumber: 1,
            semesterName: 'الفصل الدراسي الأول',
            totalCredits: 16,
            courses: [
              { code: 'HU111', nameAr: 'اللغة الإنجليزية I', nameEn: 'English Language I', credits: 2, type: 'إجباري' },
              { code: 'HU141', nameAr: 'الحاسبات والأخلاقيات', nameEn: 'Computers and Ethics', credits: 2, type: 'إجباري' },
              { code: 'MA111', nameAr: 'رياضيات I', nameEn: 'Math I', credits: 3, type: 'إجباري' },
              { code: 'EE101', nameAr: 'إلكترونيات', nameEn: 'Electronics', credits: 3, type: 'إجباري' },
              { code: 'CS121', nameAr: 'أساسيات علوم الحاسب', nameEn: 'Computer Science Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'HU151', nameAr: 'تاريخ الحوسبة', nameEn: 'History of Computing', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 2,
            semesterName: 'الفصل الدراسي الثاني',
            totalCredits: 16,
            courses: [
              { code: 'HU132', nameAr: 'الكتابة التقنية', nameEn: 'Technical Writing', credits: 2, type: 'إجباري' },
              { code: 'CS141', nameAr: 'أساسيات البرمجة', nameEn: 'Programming Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'MA112', nameAr: 'الهياكل المتقطعة', nameEn: 'Discrete Structures', credits: 3, type: 'إجباري' },
              { code: 'MA121', nameAr: 'الاحتمالات والإحصاء I', nameEn: 'Probability and Statistics I', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'MA113', nameAr: 'رياضيات II', nameEn: 'Math II', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'HU112', nameAr: 'اللغة الإنجليزية II', nameEn: 'English Language II', credits: 2, type: 'اختياري', prerequisites: ['HU111'] },
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        levelName: 'المستوى الثاني (مشترك عام)',
        semesters: [
          {
            semesterNumber: 3,
            semesterName: 'الفصل الدراسي الثالث',
            totalCredits: 18,
            courses: [
              { code: 'MA222', nameAr: 'الاحتمالات والإحصاء II', nameEn: 'Probability and Statistics II', credits: 3, type: 'إجباري', prerequisites: ['MA121'] },
              { code: 'CS241', nameAr: 'البرمجة كائنية التوجه', nameEn: 'Object-Oriented Programming', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'IT231', nameAr: 'شبكات الحاسب I', nameEn: 'Computer Networks I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
              { code: 'MA231', nameAr: 'بحوث العمليات', nameEn: 'Operations Research', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'EE201', nameAr: 'التصميم المنطقي', nameEn: 'Logic Design', credits: 3, type: 'إجباري', prerequisites: ['EE101'] },
              { code: 'IS221', nameAr: 'إدارة المشروعات', nameEn: 'Project Management', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
            ]
          },
          {
            semesterNumber: 4,
            semesterName: 'الفصل الدراسي الرابع',
            totalCredits: 18,
            courses: [
              { code: 'IS212', nameAr: 'تكنولوجيا الويب', nameEn: 'Web Technology', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS211', nameAr: 'هياكل البيانات I', nameEn: 'Data Structures I', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS291', nameAr: 'النمذجة والمحاكاة', nameEn: 'Modeling and Simulation', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'PH201', nameAr: 'فيزياء', nameEn: 'Physics', credits: 3, type: 'إجباري' },
              { code: 'IS211', nameAr: 'قواعد البيانات', nameEn: 'Databases', credits: 3, type: 'إجباري' },
              { code: 'CS242', nameAr: 'البرمجة المتوازية', nameEn: 'Parallel Programming', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
            ]
          }
        ]
      },
      {
        levelNumber: 3,
        levelName: 'المستوى الثالث (تخصص تكنولوجيا المعلومات)',
        semesters: [
          {
            semesterNumber: 5,
            semesterName: 'الفصل الدراسي الخامس',
            totalCredits: 18,
            courses: [
              { code: 'IT332', nameAr: 'اتصالات البيانات', nameEn: 'Data Communication', credits: 3, type: 'إجباري', prerequisites: ['IT231'] },
              { code: 'IT341', nameAr: 'الإشارات والأنظمة', nameEn: 'Signals and Systems', credits: 3, type: 'إجباري', prerequisites: ['MA121'] },
              { code: 'IT301', nameAr: 'المتحكمات الدقيقة', nameEn: 'Micro Controllers', credits: 3, type: 'إجباري', prerequisites: ['EE201'] },
              { code: 'CS351', nameAr: 'رسوميات الحاسب I', nameEn: 'Computer Graphics I', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'CS321', nameAr: 'نظم التشغيل I', nameEn: 'Operating Systems I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
              { code: 'CS311', nameAr: 'تحليل وتصميم الخوارزميات', nameEn: 'Algorithms Analysis and Design', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
            ]
          },
          {
            semesterNumber: 6,
            semesterName: 'الفصل الدراسي السادس',
            totalCredits: 18,
            courses: [
              { code: 'IT331', nameAr: 'شبكات الحاسب II', nameEn: 'Computer Networks II', credits: 3, type: 'إجباري', prerequisites: ['IT231'] },
              { code: 'IT342', nameAr: 'معالجة الإشارات الرقمية', nameEn: 'Digital Signal Processing', credits: 3, type: 'إجباري', prerequisites: ['IT341'] },
              { code: 'CS362', nameAr: 'التعرف على الأنماط I', nameEn: 'Pattern Recognition I', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'IT302', nameAr: 'التشفير', nameEn: 'Cryptography', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'CS322', nameAr: 'معمارية وتنظيم الحاسبات', nameEn: 'Computer Architecture and Organization', credits: 3, type: 'إجباري', prerequisites: ['EE201'] },
              { code: 'TR301', nameAr: 'التدريب الميداني', nameEn: 'Field Training', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      },
      {
        levelNumber: 4,
        levelName: 'المستوى الرابع (تخصص تكنولوجيا المعلومات وتخرج)',
        semesters: [
          {
            semesterNumber: 7,
            semesterName: 'الفصل الدراسي السابع',
            totalCredits: 18,
            courses: [
              { code: 'IT411', nameAr: 'أمن المعلومات وشبكات الحاسب', nameEn: 'Information and Computer Networks Security', credits: 3, type: 'إجباري', prerequisites: ['IT331'] },
              { code: 'IT421', nameAr: 'برمجة الإنترنت والبروتوكولات', nameEn: 'Internet Programming and Protocols', credits: 3, type: 'إجباري', prerequisites: ['IT231'] },
              { code: 'IT443', nameAr: 'الأنظمة المدمجة', nameEn: 'Embedded Systems', credits: 3, type: 'اختياري' },
              { code: 'IT472', nameAr: 'الحوسبة المتزامنة والمتوازية', nameEn: 'Concurrency and Parallel Computing', credits: 3, type: 'اختياري', prerequisites: ['CS322'] },
              { code: 'IT433', nameAr: 'شبكات الحوسبة السحابية', nameEn: 'Cloud Computing Networks', credits: 3, type: 'اختياري' },
              { code: 'IT461', nameAr: 'مشروع التخرج (الجزء الأول)', nameEn: 'Graduation Project (Part 1)', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 8,
            semesterName: 'الفصل الدراسي الثامن',
            totalCredits: 18,
            courses: [
              { code: 'IT431', nameAr: 'تكنولوجيا الاتصالات', nameEn: 'Communication Technology', credits: 3, type: 'إجباري', prerequisites: ['IT332'] },
              { code: 'IT441', nameAr: 'تنقيب الوسائط المتعددة', nameEn: 'Multimedia Mining', credits: 3, type: 'إجباري', prerequisites: ['IT342'] },
              { code: 'IT442', nameAr: 'علم الروبوت', nameEn: 'Robotics', credits: 3, type: 'اختياري' },
              { code: 'CS456', nameAr: 'معالجة الفيديو الرقمي', nameEn: 'Digital Video Processing', credits: 3, type: 'اختياري' },
              { code: 'IT412', nameAr: 'الأمن السيبراني', nameEn: 'Cyber Security', credits: 3, type: 'اختياري' },
              { code: 'IT461', nameAr: 'مشروع التخرج (الجزء الثاني)', nameEn: 'Graduation Project (Part 2)', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'is',
    code: 'IS',
    name: 'قسم نظم المعلومات',
    nameEn: 'Information Systems (IS)',
    head: 'أ.د. منال عبد الستار',
    description: 'يركز على تحليل وتصميم نظم المعلومات المؤسسية، إدارة قواعد البيانات الضخمة، ذكاء الأعمال، التنقيب في البيانات، وإدارة العمليات التجارية.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (نظم المعلومات)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 39,
    creditHoursTotal: 144,
    labs: [
      'معمل قواعد البيانات الضخمة والنظم الموزعة',
      'معمل ذكاء الأعمال وتحليل البيانات',
      'معمل نظم المعلومات المؤسسية والـ ERP',
      'معمل هندسة النظم السحابية'
    ],
    objectives: [
      'تطوير نظم معلومات مؤسسية لدعم اتخاذ القرارات في المؤسسات الحكومية والخاصة',
      'إدارة وتنقيب البيانات الضخمة واستخراج المعرفة من مستودعات البيانات',
      'حوكمة أمن المعلومات وضمان جودة البرمجيات والأنظمة الحيوية',
      'قيادة مشروعات التحول الرقمي وتصميم الحلول المبنية على الويب'
    ],
    hoursBreakdown: {
      general: 15,
      collegeMathBasic: 27,
      collegeCSBasic: 36,
      specializationCompulsory: 39,
      specializationElective: 18,
      graduationProject: 6,
      fieldTraining: 3
    },
    scientificFields: [
      'تحليل وتصميم نظم المعلومات',
      'منهجيات تطوير نظم المعلومات',
      'معماريات نظم المعلومات (Enterprise Architecture)',
      'نظم تخزين واسترجاع المعلومات',
      'نظم قواعد البيانات المتقدمة',
      'نظم المعلومات الذكية',
      'نظم معلومات الوسائط المتعددة',
      'نظم المعلومات الموزعة',
      'هندسة المعلومات',
      'اكتشاف المعرفة في قواعد البيانات',
      'قواعد البيانات الشيئية',
      'اقتصاديات نظم المعلومات',
      'التنقيب في البيانات (Data Mining)',
      'مستودعات البيانات (Data Warehousing)',
      'إدارة مراكز المعلومات',
      'نظم المعلومات المتكاملة',
      'نظم المعلومات الحيوية (Bioinformatics)',
      'نظم البيانات كبيرة الحجم (Big Data)',
      'تأكيد جودة البرمجيات ونظم المعلومات',
      'تطبيقات نظم المعلومات في المجالات الحيوية'
    ],
    studyPlan: [
      {
        levelNumber: 1,
        levelName: 'المستوى الأول (مشترك عام)',
        semesters: [
          {
            semesterNumber: 1,
            semesterName: 'الفصل الدراسي الأول',
            totalCredits: 16,
            courses: [
              { code: 'HU111', nameAr: 'اللغة الإنجليزية I', nameEn: 'English Language I', credits: 2, type: 'إجباري' },
              { code: 'HU141', nameAr: 'الحاسبات والأخلاقيات', nameEn: 'Computers and Ethics', credits: 2, type: 'إجباري' },
              { code: 'MA111', nameAr: 'رياضيات I', nameEn: 'Math I', credits: 3, type: 'إجباري' },
              { code: 'EE101', nameAr: 'إلكترونيات', nameEn: 'Electronics', credits: 3, type: 'إجباري' },
              { code: 'CS121', nameAr: 'أساسيات علوم الحاسب', nameEn: 'Computer Science Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'HU151', nameAr: 'تاريخ الحوسبة', nameEn: 'History of Computing', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 2,
            semesterName: 'الفصل الدراسي الثاني',
            totalCredits: 16,
            courses: [
              { code: 'HU132', nameAr: 'الكتابة التقنية', nameEn: 'Technical Writing', credits: 2, type: 'إجباري' },
              { code: 'CS141', nameAr: 'أساسيات البرمجة', nameEn: 'Programming Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'MA112', nameAr: 'الهياكل المتقطعة', nameEn: 'Discrete Structures', credits: 3, type: 'إجباري' },
              { code: 'MA121', nameAr: 'الاحتمالات والإحصاء I', nameEn: 'Probability and Statistics I', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'MA113', nameAr: 'رياضيات II', nameEn: 'Math II', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'HU112', nameAr: 'اللغة الإنجليزية II', nameEn: 'English Language II', credits: 2, type: 'اختياري', prerequisites: ['HU111'] },
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        levelName: 'المستوى الثاني (مشترك عام)',
        semesters: [
          {
            semesterNumber: 3,
            semesterName: 'الفصل الدراسي الثالث',
            totalCredits: 18,
            courses: [
              { code: 'MA222', nameAr: 'الاحتمالات والإحصاء II', nameEn: 'Probability and Statistics II', credits: 3, type: 'إجباري', prerequisites: ['MA121'] },
              { code: 'CS241', nameAr: 'البرمجة كائنية التوجه', nameEn: 'Object-Oriented Programming', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'IT231', nameAr: 'شبكات الحاسب I', nameEn: 'Computer Networks I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
              { code: 'MA231', nameAr: 'بحوث العمليات', nameEn: 'Operations Research', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'EE201', nameAr: 'التصميم المنطقي', nameEn: 'Logic Design', credits: 3, type: 'إجباري', prerequisites: ['EE101'] },
              { code: 'IS221', nameAr: 'إدارة المشروعات', nameEn: 'Project Management', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
            ]
          },
          {
            semesterNumber: 4,
            semesterName: 'الفصل الدراسي الرابع',
            totalCredits: 18,
            courses: [
              { code: 'IS212', nameAr: 'تكنولوجيا الويب', nameEn: 'Web Technology', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS211', nameAr: 'هياكل البيانات I', nameEn: 'Data Structures I', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS291', nameAr: 'النمذجة والمحاكاة', nameEn: 'Modeling and Simulation', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'PH201', nameAr: 'فيزياء', nameEn: 'Physics', credits: 3, type: 'إجباري' },
              { code: 'IS211', nameAr: 'قواعد البيانات', nameEn: 'Databases', credits: 3, type: 'إجباري' },
              { code: 'CS242', nameAr: 'البرمجة المتوازية', nameEn: 'Parallel Programming', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
            ]
          }
        ]
      },
      {
        levelNumber: 3,
        levelName: 'المستوى الثالث (تخصص نظم المعلومات)',
        semesters: [
          {
            semesterNumber: 5,
            semesterName: 'الفصل الدراسي الخامس',
            totalCredits: 18,
            courses: [
              { code: 'IS331', nameAr: 'تحليل وتصميم نظم المعلومات', nameEn: 'Analysis and Design of Information Systems', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'AI301', nameAr: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'IS312', nameAr: 'مستودعات البيانات', nameEn: 'Data Warehousing', credits: 3, type: 'إجباري', prerequisites: ['IS211'] },
              { code: 'IS313', nameAr: 'إدارة الملفات ومعالجتها', nameEn: 'File Management and Processing', credits: 3, type: 'إجباري', prerequisites: ['IS211'] },
              { code: 'CS321', nameAr: 'نظم التشغيل I', nameEn: 'Operating Systems I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
              { code: 'CS311', nameAr: 'تحليل وتصميم الخوارزميات', nameEn: 'Algorithms Analysis and Design', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
            ]
          },
          {
            semesterNumber: 6,
            semesterName: 'الفصل الدراسي السادس',
            totalCredits: 18,
            courses: [
              { code: 'IS342', nameAr: 'إدارة العمليات التجارية', nameEn: 'Business Process Management', credits: 3, type: 'إجباري', prerequisites: ['IS331'] },
              { code: 'IS341', nameAr: 'استرجاع المعلومات', nameEn: 'Information Retrieval', credits: 3, type: 'إجباري', prerequisites: ['IS211'] },
              { code: 'IS314', nameAr: 'تطوير نظم المعلومات المبنية على الويب', nameEn: 'Web-based Information Systems Development', credits: 3, type: 'إجباري', prerequisites: ['IS212'] },
              { code: 'CS391', nameAr: 'هندسة البرمجيات', nameEn: 'Software Engineering', credits: 3, type: 'إجباري' },
              { code: 'IS311', nameAr: 'نظم إدارة قواعد البيانات', nameEn: 'Database Management Systems', credits: 3, type: 'إجباري', prerequisites: ['IS211'] },
              { code: 'TR301', nameAr: 'التدريب الميداني', nameEn: 'Field Training', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      },
      {
        levelNumber: 4,
        levelName: 'المستوى الرابع (تخصص نظم المعلومات وتخرج)',
        semesters: [
          {
            semesterNumber: 7,
            semesterName: 'الفصل الدراسي السابع',
            totalCredits: 18,
            courses: [
              { code: 'AI413', nameAr: 'تعلم الآلة', nameEn: 'Machine Learning', credits: 3, type: 'إجباري', prerequisites: ['MA113', 'MA222'] },
              { code: 'IS411', nameAr: 'تنقيب البيانات', nameEn: 'Data Mining', credits: 3, type: 'إجباري', prerequisites: ['IS311'] },
              { code: 'IS415', nameAr: 'تطبيقات الحوسبة المتنقلة', nameEn: 'Mobile Computing Applications', credits: 3, type: 'اختياري' },
              { code: 'IS443', nameAr: 'أمن نظم المعلومات وإدارة المخاطر', nameEn: 'Information Systems Security and Risk Management', credits: 3, type: 'اختياري' },
              { code: 'IS414', nameAr: 'قواعد البيانات الموزعة', nameEn: 'Distributed Database', credits: 3, type: 'اختياري' },
              { code: 'IS451', nameAr: 'مشروع التخرج (الجزء الأول)', nameEn: 'Graduation Project (Part 1)', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 8,
            semesterName: 'الفصل الدراسي الثامن',
            totalCredits: 18,
            courses: [
              { code: 'IS431', nameAr: 'إدارة ونمذجة البيانات الضخمة', nameEn: 'Managing and Modeling Big Data', credits: 3, type: 'إجباري', prerequisites: ['IS411'] },
              { code: 'IS412', nameAr: 'المعمارية الموجهة بالخدمات', nameEn: 'Service-Oriented Architecture', credits: 3, type: 'إجباري', prerequisites: ['IS314'] },
              { code: 'IS442', nameAr: 'ضمان جودة نظم المعلومات', nameEn: 'Information Systems Quality Assurance', credits: 3, type: 'اختياري' },
              { code: 'IS445', nameAr: 'نظم المعلومات المؤسسية', nameEn: 'Enterprise Information Systems', credits: 3, type: 'اختياري' },
              { code: 'IS447', nameAr: 'الأعمال الإلكترونية', nameEn: 'E-Business', credits: 3, type: 'اختياري' },
              { code: 'IS451', nameAr: 'مشروع التخرج (الجزء الثاني)', nameEn: 'Graduation Project (Part 2)', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai',
    code: 'AI',
    name: 'قسم الذكاء الاصطناعي',
    nameEn: 'Artificial Intelligence (AI)',
    head: 'د. خالد الدندراوي',
    description: 'يختص القسم بتعلم الآلة، التعلم العميق، الروبوتات الذكية، معالجة اللغات الطبيعية، الرؤية الحاسوبية، والأنظمة الخبيرة لخدمة الثورة الصناعية الرابعة.',
    degree: 'بكالوريوس في الحاسبات والمعلومات (الذكاء الاصطناعي)',
    bylawsArticle: 'المادة (2) والمادة (3) من اللائحة الداخلية لمرحلة البكالوريوس بنظام الساعات المعتمدة',
    coursesCount: 38,
    creditHoursTotal: 144,
    labs: [
      'معمل الحوسبة فائقة الأداء HPC للذكاء الاصطناعي',
      'معمل الروبوتات والأنظمة الذاتية المستقلة',
      'معمل معالجة اللغات الطبيعية واللهجات العربية',
      'معمل الرؤية الحاسوبية والواقع الافتراضي'
    ],
    objectives: [
      'بناء خوارزميات الذكاء الاصطناعي المتقدمة ونماذج التعلم العميق عالية الكفاءة',
      'تطوير حلول ذكية لمعالجة اللغة العربية ولهجات صعيد مصر والرعاية الصحية والزراعة الدقيقة',
      'تصميم الروبوتات الذكية والأنظمة الذاتية والواقع الافتراضي والمعزز',
      'تأهيل المتخصصين لقيادة التحول في تطبيقات الثورة الصناعية الرابعة وعلم البيانات'
    ],
    hoursBreakdown: {
      general: 15,
      collegeMathBasic: 27,
      collegeCSBasic: 36,
      specializationCompulsory: 39,
      specializationElective: 18,
      graduationProject: 6,
      fieldTraining: 3
    },
    scientificFields: [
      'أساسيات وأدوات الذكاء الاصطناعي',
      'القدرة على التعلم والاستنتاج ورد الفعل',
      'دراسة وتصميم العملاء الأذكياء',
      'نظم الذكاء الاصطناعي التوليدي',
      'محاكاة الإدراك البشري',
      'النظم الخبيرة (Expert Systems)',
      'علم البيانات التطبيقية (Data Science)',
      'تعلم الآلة (Machine Learning)',
      'الأنظمة الذكية والمستقلة',
      'المنطق الرياضي للحوسبة',
      'نظرية التحكم والأنظمة',
      'إثبات النظريات آلياً',
      'علم الروبوت (Robotics)',
      'الواقع الافتراضي والمعزز (VR/AR)',
      'الوسائط المتعددة التفاعلية',
      'التصوير ثلاثي الأبعاد والرؤية',
      'تفاعل الإنسان والحاسب (HCI)',
      'طرق اتصال الإنسان بالحاسب',
      'تمثيل المعارف آلياً (Knowledge Representation)',
      'التعليم والتعلم باستخدام الذكاء الاصطناعي',
      'الويب الدلالي والأونطولوجيا',
      'الحوسبة التطورية والضبابية'
    ],
    studyPlan: [
      {
        levelNumber: 1,
        levelName: 'المستوى الأول (مشترك عام)',
        semesters: [
          {
            semesterNumber: 1,
            semesterName: 'الفصل الدراسي الأول',
            totalCredits: 16,
            courses: [
              { code: 'HU111', nameAr: 'اللغة الإنجليزية I', nameEn: 'English Language I', credits: 2, type: 'إجباري' },
              { code: 'HU141', nameAr: 'الحاسبات والأخلاقيات', nameEn: 'Computers and Ethics', credits: 2, type: 'إجباري' },
              { code: 'MA111', nameAr: 'رياضيات I', nameEn: 'Math I', credits: 3, type: 'إجباري' },
              { code: 'EE101', nameAr: 'إلكترونيات', nameEn: 'Electronics', credits: 3, type: 'إجباري' },
              { code: 'CS121', nameAr: 'أساسيات علوم الحاسب', nameEn: 'Computer Science Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'HU151', nameAr: 'تاريخ الحوسبة', nameEn: 'History of Computing', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 2,
            semesterName: 'الفصل الدراسي الثاني',
            totalCredits: 16,
            courses: [
              { code: 'HU132', nameAr: 'الكتابة التقنية', nameEn: 'Technical Writing', credits: 2, type: 'إجباري' },
              { code: 'CS141', nameAr: 'أساسيات البرمجة', nameEn: 'Programming Fundamentals', credits: 3, type: 'إجباري' },
              { code: 'MA112', nameAr: 'الهياكل المتقطعة', nameEn: 'Discrete Structures', credits: 3, type: 'إجباري' },
              { code: 'MA121', nameAr: 'الاحتمالات والإحصاء I', nameEn: 'Probability and Statistics I', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'MA113', nameAr: 'رياضيات II', nameEn: 'Math II', credits: 3, type: 'إجباري', prerequisites: ['MA111'] },
              { code: 'HU112', nameAr: 'اللغة الإنجليزية II', nameEn: 'English Language II', credits: 2, type: 'اختياري', prerequisites: ['HU111'] },
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        levelName: 'المستوى الثاني (مشترك عام)',
        semesters: [
          {
            semesterNumber: 3,
            semesterName: 'الفصل الدراسي الثالث',
            totalCredits: 18,
            courses: [
              { code: 'MA222', nameAr: 'الاحتمالات والإحصاء II', nameEn: 'Probability and Statistics II', credits: 3, type: 'إجباري', prerequisites: ['MA121'] },
              { code: 'CS241', nameAr: 'البرمجة كائنية التوجه', nameEn: 'Object-Oriented Programming', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'IT231', nameAr: 'شبكات الحاسب I', nameEn: 'Computer Networks I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
              { code: 'MA231', nameAr: 'بحوث العمليات', nameEn: 'Operations Research', credits: 3, type: 'إجباري', prerequisites: ['MA113'] },
              { code: 'EE201', nameAr: 'التصميم المنطقي', nameEn: 'Logic Design', credits: 3, type: 'إجباري', prerequisites: ['EE101'] },
              { code: 'IS221', nameAr: 'إدارة المشروعات', nameEn: 'Project Management', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
            ]
          },
          {
            semesterNumber: 4,
            semesterName: 'الفصل الدراسي الرابع',
            totalCredits: 18,
            courses: [
              { code: 'IS212', nameAr: 'تكنولوجيا الويب', nameEn: 'Web Technology', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS211', nameAr: 'هياكل البيانات I', nameEn: 'Data Structures I', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
              { code: 'CS291', nameAr: 'النمذجة والمحاكاة', nameEn: 'Modeling and Simulation', credits: 3, type: 'إجباري', prerequisites: ['CS141'] },
              { code: 'PH201', nameAr: 'فيزياء', nameEn: 'Physics', credits: 3, type: 'إجباري' },
              { code: 'IS211', nameAr: 'قواعد البيانات', nameEn: 'Databases', credits: 3, type: 'إجباري' },
              { code: 'CS242', nameAr: 'البرمجة المتوازية', nameEn: 'Parallel Programming', credits: 3, type: 'إجباري', prerequisites: ['CS241'] },
            ]
          }
        ]
      },
      {
        levelNumber: 3,
        levelName: 'المستوى الثالث (تخصص الذكاء الاصطناعي)',
        semesters: [
          {
            semesterNumber: 5,
            semesterName: 'الفصل الدراسي الخامس',
            totalCredits: 18,
            courses: [
              { code: 'MA301', nameAr: 'التفكير الاحتمالي', nameEn: 'Probabilistic Reasoning', credits: 3, type: 'إجباري', prerequisites: ['MA222'] },
              { code: 'AI321', nameAr: 'الذكاء الحسابي', nameEn: 'Computational Intelligence', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'AI312', nameAr: 'علم البيانات', nameEn: 'Data Science', credits: 3, type: 'إجباري', prerequisites: ['MA222'] },
              { code: 'AI301', nameAr: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'CS311', nameAr: 'تحليل وتصميم الخوارزميات', nameEn: 'Algorithms Analysis and Design', credits: 3, type: 'إجباري', prerequisites: ['CS211'] },
              { code: 'CS321', nameAr: 'نظم التشغيل I', nameEn: 'Operating Systems I', credits: 3, type: 'إجباري', prerequisites: ['CS121'] },
            ]
          },
          {
            semesterNumber: 6,
            semesterName: 'الفصل الدراسي السادس',
            totalCredits: 18,
            courses: [
              { code: 'IS312', nameAr: 'مستودعات البيانات', nameEn: 'Data Warehousing', credits: 3, type: 'إجباري', prerequisites: ['IS211'] },
              { code: 'AI311', nameAr: 'تحليل البيانات', nameEn: 'Data Analytics', credits: 3, type: 'إجباري', prerequisites: ['AI312'] },
              { code: 'MA302', nameAr: 'البرمجة الخطية والصحيحة', nameEn: 'Linear and Integer Programming', credits: 3, type: 'إجباري', prerequisites: ['MA231', 'MA113'] },
              { code: 'AI313', nameAr: 'الشبكات العصبية', nameEn: 'Neural Networks', credits: 3, type: 'إجباري', prerequisites: ['AI301'] },
              { code: 'IS341', nameAr: 'استرجاع المعلومات', nameEn: 'Information Retrieval', credits: 3, type: 'إجباري', prerequisites: ['IS211'] },
              { code: 'TR301', nameAr: 'التدريب الميداني', nameEn: 'Field Training', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      },
      {
        levelNumber: 4,
        levelName: 'المستوى الرابع (تخصص الذكاء الاصطناعي وتخرج)',
        semesters: [
          {
            semesterNumber: 7,
            semesterName: 'الفصل الدراسي السابع',
            totalCredits: 18,
            courses: [
              { code: 'AI421', nameAr: 'الويب الدلالي والأونطولوجيا', nameEn: 'Semantic Web and Ontology', credits: 3, type: 'إجباري', prerequisites: ['AI301', 'IS212'] },
              { code: 'AI413', nameAr: 'تعلم الآلة', nameEn: 'Machine Learning', credits: 3, type: 'إجباري', prerequisites: ['MA113', 'MA222'] },
              { code: 'AI425', nameAr: 'الأنظمة الخبيرة', nameEn: 'Expert Systems', credits: 3, type: 'اختياري' },
              { code: 'AI412', nameAr: 'تصور البيانات', nameEn: 'Data Visualization', credits: 3, type: 'اختياري', prerequisites: ['MA222', 'MA112'] },
              { code: 'AI431', nameAr: 'إدارة مشروعات الذكاء الاصطناعي', nameEn: 'AI Project Management', credits: 3, type: 'اختياري' },
              { code: 'AI434', nameAr: 'مشروع التخرج (الجزء الأول)', nameEn: 'Graduation Project (Part 1)', credits: 3, type: 'إجباري' },
            ]
          },
          {
            semesterNumber: 8,
            semesterName: 'الفصل الدراسي الثامن',
            totalCredits: 18,
            courses: [
              { code: 'AI435', nameAr: 'الحوسبة الضبابية', nameEn: 'Fuzzy Computing', credits: 3, type: 'إجباري', prerequisites: ['MA121', 'MA113'] },
              { code: 'AI411', nameAr: 'التعلم العميق', nameEn: 'Deep Learning', credits: 3, type: 'إجباري', prerequisites: ['AI312', 'AI301'] },
              { code: 'IT442', nameAr: 'علم الروبوت', nameEn: 'Robotics', credits: 3, type: 'اختياري' },
              { code: 'AI432', nameAr: 'إنترنت الأشياء', nameEn: 'Internet of Things', credits: 3, type: 'اختياري' },
              { code: 'AI426', nameAr: 'الحوسبة التطورية', nameEn: 'Evolutionary Computing', credits: 3, type: 'اختياري' },
              { code: 'AI434', nameAr: 'مشروع التخرج (الجزء الثاني)', nameEn: 'Graduation Project (Part 2)', credits: 3, type: 'إجباري' },
            ]
          }
        ]
      }
    ]
  }
];
