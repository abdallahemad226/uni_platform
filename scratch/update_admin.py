import sys

with open('src/components/AdminDashboardModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update Registration Control in AdminDashboardModal to include departments
old_reg_ctrl = """                  {/* Registration Status Control */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                      <Unlock className="w-4 h-4" />
                      التحكم في فتح/إغلاق التسجيل لكل فرقة
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة'] as const).map(lvl => (
                        <div key={lvl} className={`p-3 rounded-lg border-2 transition-colors ${
                          regStatus[lvl]
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                        }`}>
                          <div className="text-sm font-bold text-neutral-900 dark:text-white mb-2">{lvl}</div>
                          <div className={`text-xs font-medium mb-3 ${regStatus[lvl] ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                            {regStatus[lvl] ? '🟢 مفتوح' : '🔴 مغلق'}
                          </div>
                          <button
                            onClick={async () => {
                              const res = await fetch('/api/admin/registration/toggle', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ level: lvl, open: !regStatus[lvl] })
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setRegStatus(data.status);
                                showFlash(data.message);
                              }
                            }}
                            className={`w-full text-xs py-1.5 rounded font-semibold transition-colors ${
                              regStatus[lvl]
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {regStatus[lvl] ? 'إغلاق التسجيل' : 'فتح التسجيل'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>"""

new_reg_ctrl = """                  {/* Registration Status Control By Level & Department */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-6">
                    <div>
                      <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-1">
                        <Unlock className="w-4 h-4" />
                        التحكم المركزي في فتح وإغلاق التسجيل الأكاديمي (حسب الفرق والأقسام)
                      </h3>
                      <p className="text-xs text-neutral-500">
                        يمكنك فتح أو إغلاق التسجيل لمرحلة كاملة أو تخصيص الفتح لأقسام محددة في الفرقتين الثالثة والرابعة طبقاً للائحة الكلية.
                      </p>
                    </div>

                    {/* Section 1: Common Levels */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <span>المرحلة العامة (مشترك لجميع الطلاب)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'الفرقة الأولى', label: 'الفرقة الأولى — المرحلة العامة' },
                          { key: 'الفرقة الثانية', label: 'الفرقة الثانية — المرحلة العامة' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          return (
                            <div key={item.key} className={`p-3.5 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/50 dark:bg-green-950/20'
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
                              <button
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
                                className={`w-full text-xs py-2 rounded-lg font-bold transition-colors ${
                                  isOpen
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                }`}
                              >
                                {isOpen ? 'إغلاق التسجيل للفرقة' : 'فتح التسجيل للفرقة'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Level 3 By Department */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>الفرقة الثالثة — فتح وإغلاق التسجيل حسب القسم التخصصي</span>
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
                          { key: 'الفرقة الثالثة - علوم الحاسب (CS)', dept: 'علوم الحاسب', code: 'CS', color: 'blue' },
                          { key: 'الفرقة الثالثة - الذكاء الاصطناعي (AI)', dept: 'الذكاء الاصطناعي', code: 'AI', color: 'purple' },
                          { key: 'الفرقة الثالثة - تكنولوجيا المعلومات (IT)', dept: 'تكنولوجيا المعلومات', code: 'IT', color: 'emerald' },
                          { key: 'الفرقة الثالثة - نظم المعلومات (IS)', dept: 'نظم المعلومات', code: 'IS', color: 'amber' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          return (
                            <div key={item.key} className={`p-3 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/50 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1 flex items-center justify-between">
                                <span>{item.dept}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">{item.code}</span>
                              </div>
                              <div className={`text-[11px] font-semibold mb-2 ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                                {isOpen ? '🟢 التسجيل متاح' : '🔴 التسجيل مغلق'}
                              </div>
                              <button
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
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3: Level 4 By Department */}
                    <div>
                      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>الفرقة الرابعة — فتح وإغلاق التسجيل حسب القسم التخصصي ومشاريع التخرج</span>
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
                          { key: 'الفرقة الرابعة - علوم الحاسب (CS)', dept: 'علوم الحاسب', code: 'CS', color: 'blue' },
                          { key: 'الفرقة الرابعة - الذكاء الاصطناعي (AI)', dept: 'الذكاء الاصطناعي', code: 'AI', color: 'purple' },
                          { key: 'الفرقة الرابعة - تكنولوجيا المعلومات (IT)', dept: 'تكنولوجيا المعلومات', code: 'IT', color: 'emerald' },
                          { key: 'الفرقة الرابعة - نظم المعلومات (IS)', dept: 'نظم المعلومات', code: 'IS', color: 'amber' }
                        ].map(item => {
                          const isOpen = regStatus[item.key] ?? false;
                          return (
                            <div key={item.key} className={`p-3 rounded-xl border-2 transition-all ${
                              isOpen
                                ? 'border-green-500/70 bg-green-50/50 dark:bg-green-950/20'
                                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                            }`}>
                              <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1 flex items-center justify-between">
                                <span>{item.dept}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">{item.code}</span>
                              </div>
                              <div className={`text-[11px] font-semibold mb-2 ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'}`}>
                                {isOpen ? '🟢 التسجيل متاح' : '🔴 التسجيل مغلق'}
                              </div>
                              <button
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
                          );
                        })}
                      </div>
                    </div>
                  </div>"""

if old_reg_ctrl in c:
    c = c.replace(old_reg_ctrl, new_reg_ctrl)
    print('Replaced Registration Status Control!')
else:
    print('Failed to find old_reg_ctrl')

# 2. Add Department dropdown in Slot Form
old_slot_form_fields = """                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs text-neutral-500 mb-1">الفرقة</label>
                          <select value={slotLevel} onChange={e => setSlotLevel(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                            {['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة'].map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>"""

new_slot_form_fields = """                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs text-neutral-500 mb-1">الفرقة</label>
                          <select value={slotLevel} onChange={e => setSlotLevel(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                            {['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة'].map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs text-neutral-500 mb-1">القسم الأكاديمي</label>
                          <select value={slotDepartment} onChange={e => setSlotDepartment(e.target.value)} className="w-full text-xs px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                            {['المرحلة العامة', 'علوم الحاسب (CS)', 'تكنولوجيا المعلومات (IT)', 'نظم المعلومات (IS)', 'الذكاء الاصطناعي (AI)'].map(d => <option key={d}>{d}</option>)}
                          </select>
                        </div>"""

if old_slot_form_fields in c:
    c = c.replace(old_slot_form_fields, new_slot_form_fields)
    print('Replaced Slot Form fields!')
else:
    print('Failed to find old_slot_form_fields')

# Pass department in slot save
old_slot_save = """                              time: slotTime,
                              level: slotLevel,
                              semester: slotSemester"""

new_slot_save = """                              time: slotTime,
                              level: slotLevel,
                              department: slotDepartment,
                              semester: slotSemester"""

if old_slot_save in c:
    c = c.replace(old_slot_save, new_slot_save)
    print('Replaced Slot Save payload!')
else:
    print('Failed to find old_slot_save')

with open('src/components/AdminDashboardModal.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated AdminDashboardModal successfully!')
