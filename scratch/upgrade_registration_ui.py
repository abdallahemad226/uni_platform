import sys

with open('src/components/AdminDashboardModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's inspect the Registration Status Control section in c
start_marker = "{/* Registration Status Control By Level & Department */}"
end_marker = "{/* Filter by level */}"

idx_start = c.find(start_marker)
idx_end = c.find(end_marker)

if idx_start == -1 or idx_end == -1:
    print('Markers not found!', idx_start, idx_end)
    sys.exit(1)

new_registration_section = """{/* Registration Status Control By Level & Department */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-6">
                    <div>
                      <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-1">
                        <Unlock className="w-4 h-4" />
                        التحكم المركزي في فتح وإغلاق التسجيل الأكاديمي وإضافة المقررات والدكاترة
                      </h3>
                      <p className="text-xs text-neutral-500">
                        يمكنك فتح أو إغلاق التسجيل لكل قسم، وإضافة المواد وأسماء الدكاترة والفصل الدراسي مباشرة لكل قسم بالكلية.
                      </p>
                    </div>

                    {/* Section 1: Common Levels */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>المرحلة العامة (مشترك لجميع الطلاب)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'الفرقة الأولى', label: 'الفرقة الأولى — المرحلة العامة', level: 'الفرقة الأولى', dept: 'المرحلة العامة' },
                          { key: 'الفرقة الثانية', label: 'الفرقة الثانية — المرحلة العامة', level: 'الفرقة الثانية', dept: 'المرحلة العامة' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          const slotsForDept = courseSlots.filter(s => s.level === item.level && (!s.department || s.department === 'عام' || s.department === 'المرحلة العامة'));
                          return (
                            <div key={item.key} className={`p-4 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/40 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white">{item.label}</span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  isOpen ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                }`}>
                                  {isOpen ? '🟢 مفتوح للتسجيل' : '🔴 مغلق'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{slotsForDept.length} مواد وشعب مضافة حالياً</span>
                              </div>

                              {/* Action Buttons: Add Course + Toggle Status */}
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSlotLevel(item.level);
                                    setSlotDepartment(item.dept);
                                    setEditingSlotId(null);
                                    setSlotCourseCode('');
                                    setSlotCourseName('');
                                    setIsSlotFormOpen(true);
                                  }}
                                  className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-lg font-bold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ إضافة مادة ودكتور</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await fetch('/api/admin/registration/toggle', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ level: item.key, open: !isOpen })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setRegStatus(data.status);
                                      showFlash(data.message);
                                    }
                                  }}
                                  className={`text-xs py-2 px-3 rounded-lg font-bold transition-colors ${
                                    isOpen
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                  }`}
                                >
                                  {isOpen ? 'إغلاق التسجيل' : 'فتح التسجيل'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Level 3 By Department */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>الفرقة الثالثة — فتح وإغلاق التسجيل وإضافة المقررات حسب القسم</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الثالثة - علوم الحاسب (CS)', 'الفرقة الثالثة - تكنولوجيا المعلومات (IT)', 'الفرقة الثالثة - نظم المعلومات (IS)', 'الفرقة الثالثة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: true }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم فتح التسجيل لجميع أقسام الفرقة الثالثة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/40">
                            فتح لجميع الأقسام
                          </button>
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الثالثة - علوم الحاسب (CS)', 'الفرقة الثالثة - تكنولوجيا المعلومات (IT)', 'الفرقة الثالثة - نظم المعلومات (IS)', 'الفرقة الثالثة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: false }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم إغلاق التسجيل لجميع أقسام الفرقة الثالثة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40">
                            إغلاق الكل
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { key: 'الفرقة الثالثة - علوم الحاسب (CS)', dept: 'علوم الحاسب (CS)', nameOnly: 'علوم الحاسب', code: 'CS' },
                          { key: 'الفرقة الثالثة - الذكاء الاصطناعي (AI)', dept: 'الذكاء الاصطناعي (AI)', nameOnly: 'الذكاء الاصطناعي', code: 'AI' },
                          { key: 'الفرقة الثالثة - تكنولوجيا المعلومات (IT)', dept: 'تكنولوجيا المعلومات (IT)', nameOnly: 'تكنولوجيا المعلومات', code: 'IT' },
                          { key: 'الفرقة الثالثة - نظم المعلومات (IS)', dept: 'نظم المعلومات (IS)', nameOnly: 'نظم المعلومات', code: 'IS' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          const slotsForDept = courseSlots.filter(s => s.level === 'الفرقة الثالثة' && (s.department && (s.department.includes(item.code) || item.dept.includes(s.department))));
                          return (
                            <div key={item.key} className={`p-3.5 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/40 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1 flex items-center justify-between">
                                <span>{item.nameOnly}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">{item.code}</span>
                              </div>
                              <div className={`text-[11px] font-semibold mb-2 ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                                {isOpen ? '🟢 التسجيل متاح' : '🔴 التسجيل مغلق'}
                              </div>

                              <div className="text-[11px] text-neutral-500 mb-2.5 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{slotsForDept.length} شعب ومقررات مضافة</span>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSlotLevel('الفرقة الثالثة');
                                    setSlotDepartment(item.dept);
                                    setEditingSlotId(null);
                                    setSlotCourseCode('');
                                    setSlotCourseName('');
                                    setIsSlotFormOpen(true);
                                  }}
                                  className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-lg font-bold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ إضافة مادة ودكتور</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await fetch('/api/admin/registration/toggle', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ level: item.key, open: !isOpen })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setRegStatus(data.status);
                                      showFlash(data.message);
                                    }
                                  }}
                                  className={`w-full text-[11px] py-1.5 rounded-lg font-bold transition-colors ${
                                    isOpen
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                >
                                  {isOpen ? 'إغلاق تسجيل القسم' : 'فتح تسجيل القسم'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3: Level 4 By Department */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>الفرقة الرابعة — فتح وإغلاق التسجيل وإضافة المقررات ومشاريع التخرج</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الرابعة - علوم الحاسب (CS)', 'الفرقة الرابعة - تكنولوجيا المعلومات (IT)', 'الفرقة الرابعة - نظم المعلومات (IS)', 'الفرقة الرابعة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: true }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم فتح التسجيل لجميع أقسام الفرقة الرابعة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/40">
                            فتح لجميع الأقسام
                          </button>
                          <button
                            onClick={async () => {
                              const depts = ['الفرقة الرابعة - علوم الحاسب (CS)', 'الفرقة الرابعة - تكنولوجيا المعلومات (IT)', 'الفرقة الرابعة - نظم المعلومات (IS)', 'الفرقة الرابعة - الذكاء الاصطناعي (AI)'];
                              for (const d of depts) {
                                await fetch('/api/admin/registration/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: d, open: false }) });
                              }
                              fetchRegistrationData();
                              showFlash('تم إغلاق التسجيل لجميع أقسام الفرقة الرابعة');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40">
                            إغلاق الكل
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { key: 'الفرقة الرابعة - علوم الحاسب (CS)', dept: 'علوم الحاسب (CS)', nameOnly: 'علوم الحاسب', code: 'CS' },
                          { key: 'الفرقة الرابعة - الذكاء الاصطناعي (AI)', dept: 'الذكاء الاصطناعي (AI)', nameOnly: 'الذكاء الاصطناعي', code: 'AI' },
                          { key: 'الفرقة الرابعة - تكنولوجيا المعلومات (IT)', dept: 'تكنولوجيا المعلومات (IT)', nameOnly: 'تكنولوجيا المعلومات', code: 'IT' },
                          { key: 'الفرقة الرابعة - نظم المعلومات (IS)', dept: 'نظم المعلومات (IS)', nameOnly: 'نظم المعلومات', code: 'IS' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          const slotsForDept = courseSlots.filter(s => s.level === 'الفرقة الرابعة' && (s.department && (s.department.includes(item.code) || item.dept.includes(s.department))));
                          return (
                            <div key={item.key} className={`p-3.5 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/40 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1 flex items-center justify-between">
                                <span>{item.nameOnly}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">{item.code}</span>
                              </div>
                              <div className={`text-[11px] font-semibold mb-2 ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                                {isOpen ? '🟢 التسجيل متاح' : '🔴 التسجيل مغلق'}
                              </div>

                              <div className="text-[11px] text-neutral-500 mb-2.5 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{slotsForDept.length} شعب ومقررات مضافة</span>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSlotLevel('الفرقة الرابعة');
                                    setSlotDepartment(item.dept);
                                    setEditingSlotId(null);
                                    setSlotCourseCode('');
                                    setSlotCourseName('');
                                    setIsSlotFormOpen(true);
                                  }}
                                  className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-lg font-bold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ إضافة مادة ودكتور</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = await fetch('/api/admin/registration/toggle', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ level: item.key, open: !isOpen })
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      setRegStatus(data.status);
                                      showFlash(data.message);
                                    }
                                  }}
                                  className={`w-full text-[11px] py-1.5 rounded-lg font-bold transition-colors ${
                                    isOpen
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                >
                                  {isOpen ? 'إغلاق تسجيل القسم' : 'فتح تسجيل القسم'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Add Slot Form Modal / Inline Box */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          إدارة شعب المقررات وأسماء الدكاترة ({courseSlots.length} شعبة مسجلة)
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          حدد الفرقة والقسم الأكاديمي، اختر المقرر من اللائحة وحدد اسم الدكتور والموعد والقاعة
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSlotFormOpen(!isSlotFormOpen);
                          setEditingSlotId(null);
                          if (!isSlotFormOpen) {
                            setSlotCourseName('');
                            setSlotCourseCode('');
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isSlotFormOpen ? 'إغلاق النموذج' : 'إضافة شعبة ومادة جديدة'}
                      </button>
                    </div>

                    {isSlotFormOpen && (
                      <form
                        className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-5 mb-5 border-2 border-neutral-900 dark:border-white shadow-lg space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const url = editingSlotId
                            ? `/api/admin/course-slots/${editingSlotId}`
                            : '/api/admin/course-slots';
                          const method = editingSlotId ? 'PUT' : 'POST';
                          const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              courseCode: slotCourseCode,
                              courseName: slotCourseName,
                              type: slotType,
                              instructor: slotInstructor,
                              hallNumber: slotHall,
                              capacity: parseInt(slotCapacity, 10),
                              day: slotDay,
                              time: slotTime,
                              level: slotLevel,
                              department: slotDepartment,
                              semester: slotSemester
                            })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            showFlash(data.message);
                            setIsSlotFormOpen(false);
                            setEditingSlotId(null);
                            fetchRegistrationData();
                          } else {
                            alert(data.error);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                            <Plus className="w-4 h-4 text-green-600" />
                            {editingSlotId ? 'تعديل بيانات الشعبة والمحاضر' : 'إضافة مادة وشعبة دراسية ومحاضر للقسم'}
                          </h4>
                          <span className="text-xs text-neutral-400">
                            القسم المستهدف: <strong className="text-neutral-900 dark:text-white">{slotLevel} — {slotDepartment}</strong>
                          </span>
                        </div>

                        {/* Smart Course Selector from Bylaws Curriculum */}
                        <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            اختيار مقرر رسمي من لائحة الكلية (يملأ الكود واسم المادة تلقائياً):
                          </label>
                          <select
                            onChange={(e) => {
                              const found = curriculumCourses.find(c => c.code === e.target.value);
                              if (found) {
                                setSlotCourseCode(found.code);
                                setSlotCourseName(found.nameAr);
                              }
                            }}
                            className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                          >
                            <option value="">-- اضغط هنا لاختيار مادة من اللائحة مباشرة --</option>
                            {curriculumCourses
                              .filter(c => {
                                const lvlNum = slotLevel.includes('الأولى') ? 1 : slotLevel.includes('الثانية') ? 2 : slotLevel.includes('الثالثة') ? 3 : 4;
                                if (c.level !== lvlNum) return false;
                                if (lvlNum >= 3) {
                                  const dCode = slotDepartment.includes('CS') ? 'CS' : slotDepartment.includes('AI') ? 'AI' : slotDepartment.includes('IT') ? 'IT' : slotDepartment.includes('IS') ? 'IS' : null;
                                  if (dCode && !c.departments.includes(dCode)) return false;
                                }
                                return true;
                              })
                              .map(c => (
                                <option key={c.code} value={c.code}>
                                  {c.code} &mdash; {c.nameAr} ({c.nameEn}) &bull; [{c.type} - {c.credits} ساعات]
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الفرقة الدراسية</label>
                            <select value={slotLevel} onChange={e => setSlotLevel(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              {['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة'].map(l => <option key={l}>{l}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">القسم الأكاديمي</label>
                            <select value={slotDepartment} onChange={e => setSlotDepartment(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              {['المرحلة العامة', 'علوم الحاسب (CS)', 'تكنولوجيا المعلومات (IT)', 'نظم المعلومات (IS)', 'الذكاء الاصطناعي (AI)'].map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">نوع الشعبة</label>
                            <select value={slotType} onChange={e => setSlotType(e.target.value as any)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              <option value="محاضرة">محاضرة نظري</option>
                              <option value="سكشن عملي">سكشن عملي</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">كود المقرر</label>
                            <input value={slotCourseCode} onChange={e => setSlotCourseCode(e.target.value)} required className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono" placeholder="AI413" />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">اسم المقرر بالعربية</label>
                            <input value={slotCourseName} onChange={e => setSlotCourseName(e.target.value)} required className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white" placeholder="تعلم الآلة" />
                          </div>

                          {/* Doctor / Instructor with Quick Autocomplete */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">اسم الدكتور / المعيد</label>
                            <div className="flex gap-2">
                              <input
                                value={slotInstructor}
                                onChange={e => setSlotInstructor(e.target.value)}
                                required
                                className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                placeholder="أ.د. عصام الدين فؤاد"
                              />
                              <select
                                onChange={e => { if (e.target.value) setSlotInstructor(e.target.value); }}
                                className="w-44 text-xs px-2 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                              >
                                <option value="">-- أساتذة الكلية --</option>
                                <option value="أ.د. عصام الدين فؤاد">أ.د. عصام الدين فؤاد (عميد الكلية)</option>
                                <option value="د. خالد الدندراوي">د. خالد الدندراوي (وكيل الكلية)</option>
                                <option value="أ.د. منال عبد الستار">أ.د. منال عبد الستار (رئيس قسم IS)</option>
                                <option value="د. أحمد رشوان">د. أحمد رشوان (قسم CS)</option>
                                <option value="د. وليد البصيلي">د. وليد البصيلي (قسم IT)</option>
                                <option value="د. مصطفى عبد اللطيف">د. مصطفى عبد اللطيف (قسم AI)</option>
                                <option value="د. منى عبد الفتاح">د. منى عبد الفتاح</option>
                                <option value="د. محمود عثمان">د. محمود عثمان</option>
                                <option value="د. سمير كمال">د. سمير كمال</option>
                                <option value="م. إسلام محمد">م. إسلام محمد (معيد عملي)</option>
                                <option value="م. سارة أحمد">م. سارة أحمد (معيدة عملي)</option>
                                <option value="م. نورهان علي">م. نورهان علي (معيدة عملي)</option>
                                <option value="م. مروة محمود">م. مروة محمود (معيدة عملي)</option>
                                <option value="م. أحمد عبد الرحيم">م. أحمد عبد الرحيم (معيد عملي)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">مكان القاعة أو المعمل</label>
                            <div className="flex gap-1.5">
                              <input value={slotHall} onChange={e => setSlotHall(e.target.value)} required className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white" placeholder="مدرج 2 الرئيسي" />
                              <select
                                onChange={e => { if (e.target.value) setSlotHall(e.target.value); }}
                                className="w-28 text-xs px-1.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                              >
                                <option value="">-- القاعات --</option>
                                <option value="مدرج 1 الرئيسي">مدرج 1</option>
                                <option value="مدرج 2 الرئيسي">مدرج 2</option>
                                <option value="مدرج 3">مدرج 3</option>
                                <option value="معمل الذكاء الاصطناعي">معمل AI</option>
                                <option value="معمل نظم المعلومات">معمل IS</option>
                                <option value="معمل شبكات الحاسب">معمل IT</option>
                                <option value="معمل البرمجيات 1">معمل برمجيات</option>
                                <option value="معمل الإلكترونيات">معمل إلكترونيات</option>
                                <option value="قاعة المؤتمرات">المؤتمرات</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الطاقة الاستيعابية (المقاعد)</label>
                            <input type="number" min="1" value={slotCapacity} onChange={e => setSlotCapacity(e.target.value)} required className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono" placeholder="50" />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">يوم المحاضرة / السكشن</label>
                            <select value={slotDay} onChange={e => setSlotDay(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              {['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الموعد والتوقيت</label>
                            <select value={slotTime} onChange={e => setSlotTime(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono">
                              {['08:30 - 10:15', '10:30 - 12:15', '12:30 - 02:15', '02:30 - 04:15'].map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>

                          <div className="sm:col-span-2 md:col-span-3">
                            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الفصل الدراسي</label>
                            <select value={slotSemester} onChange={e => setSlotSemester(e.target.value)} className="w-full text-xs px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                              <option value="الفصل الدراسي الأول 2026/2027">الفصل الدراسي الأول 2026/2027</option>
                              <option value="الفصل الدراسي الثاني 2026/2027">الفصل الدراسي الثاني 2026/2027</option>
                              <option value="الفصل الصيفي 2026/2027">الفصل الصيفي 2026/2027</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t border-neutral-200 dark:border-neutral-800">
                          <button
                            type="button"
                            onClick={() => { setIsSlotFormOpen(false); setEditingSlotId(null); }}
                            className="px-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 text-xs rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold hover:bg-neutral-800 shadow-md"
                          >
                            {editingSlotId ? 'تحديث وحفظ التعديلات' : 'حفظ وإضافة الشعبة والمقرر'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
"""

c = c[:idx_start] + new_registration_section + c[idx_end:]

with open('src/components/AdminDashboardModal.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated registration section successfully!')
