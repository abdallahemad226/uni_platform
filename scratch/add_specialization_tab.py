import sys

with open('src/components/AdminDashboardModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = "{/* TAB 8: COURSE REGISTRATION SYSTEM */}"

specialization_panel = """              {/* TAB: ACADEMIC SPECIALIZATION & BRANCHING SYSTEM (التشعيب الأكاديمي) */}
              {adminTab === 'specialization' && (
                <div className="p-4 sm:p-6 space-y-6">

                  {/* Header & Main Controls */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="text-xs font-mono uppercase text-neutral-400 mb-1 flex items-center gap-1.5">
                          <GitFork className="w-3.5 h-3.5" />
                          ARTICLE (5) OF FACULTY BYLAWS &bull; التنسيق والتشعيب الأكاديمي
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                          إدارة رغبات التشعيب والتوزيع على الأقسام الأكاديمية
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          توزيع طلاب الفرقة الثانية على الأقسام الأربعة (CS, IT, IS, AI) استناداً إلى الرغبات، المعدل التراكمي CGPA، والسعات المعتمدة
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Open/Close toggle */}
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/admin/specialization/toggle', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ open: !specializationOpen })
                            });
                            if (res.ok) {
                              const data = await res.json();
                              setSpecializationOpen(data.status.isOpen);
                              showFlash(data.message);
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                            specializationOpen
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                          }`}
                        >
                          {specializationOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          {specializationOpen ? 'إغلاق باب التقديم' : 'فتح باب التقديم للطلاب'}
                        </button>

                        {/* Run Auto-Allocation Button */}
                        <button
                          disabled={specializationRunning || specializationApplicants.length === 0}
                          onClick={async () => {
                            if (!confirm('هل تريد تشغيل التنسيق الإلكتروني الذكي لتوزيع الطلاب حسب المعدل التراكمي ورغباتهم؟')) return;
                            setSpecializationRunning(true);
                            try {
                              const res = await fetch('/api/admin/specialization/run-allocation', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' }
                              });
                              const data = await res.json();
                              if (res.ok) {
                                showFlash(data.message);
                                setSpecializationApplicants(data.applicants || []);
                                fetchSpecializationData();
                              } else {
                                alert(data.error || 'حدث خطأ أثناء تشغيل التنسيق');
                              }
                            } catch {
                              alert('فشل الاتصال بالسيرفر');
                            } finally {
                              setSpecializationRunning(false);
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
                            specializationRunning || specializationApplicants.length === 0
                              ? 'opacity-40 cursor-not-allowed bg-neutral-400 text-white'
                              : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800'
                          }`}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${specializationRunning ? 'animate-spin' : ''}`} />
                          {specializationRunning ? 'جاري تشغيل التنسيق...' : 'تشغيل التنسيق الإلكتروني للتشعيب'}
                        </button>

                        <button
                          onClick={fetchSpecializationData}
                          title="تحديث البيانات"
                          className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Department Capacities Configuration */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        السعة الاستيعابية المعتمدة للأقسام وتوزيع الطلاب
                      </h4>
                      <button
                        onClick={async () => {
                          const res = await fetch('/api/admin/specialization/capacities', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(specializationCapacities)
                          });
                          if (res.ok) {
                            showFlash('تم حفظ السعات الاستيعابية للأقسام بنجاح');
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800"
                      >
                        حفظ السعات
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { code: 'CS', name: 'علوم الحاسب (CS)', color: 'blue' },
                        { code: 'AI', name: 'الذكاء الاصطناعي (AI)', color: 'purple' },
                        { code: 'IT', name: 'تكنولوجيا المعلومات (IT)', color: 'emerald' },
                        { code: 'IS', name: 'نظم المعلومات (IS)', color: 'amber' },
                      ].map(dept => {
                        const count = specializationApplicants.filter(a => a.assignedDepartment && a.assignedDepartment.includes(dept.code)).length;
                        const cap = (specializationCapacities as any)[dept.code] || 40;
                        return (
                          <div key={dept.code} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-neutral-900 dark:text-white">{dept.name}</span>
                              <span className="font-mono text-xs font-bold text-neutral-500">{dept.code}</span>
                            </div>
                            <div className="text-2xl font-black text-neutral-900 dark:text-white mb-2">
                              {count} <span className="text-xs font-normal text-neutral-400">/ {cap} طالب</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] text-neutral-500 whitespace-nowrap">السعة القصوى:</label>
                              <input
                                type="number"
                                min="1"
                                max="200"
                                value={cap}
                                onChange={e => {
                                  const val = parseInt(e.target.value, 10) || 1;
                                  setSpecializationCapacities(prev => ({ ...prev, [dept.code]: val }));
                                }}
                                className="w-16 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Applicants List & Merit Allocation Table */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          كشف الطلاب المتقدمين للتشعيب ({specializationApplicants.length} طالب)
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          مرتبين حسب المعدل التراكمي CGPA ويمكن تعديل الترشيح واعتماد الترقية للفرقة الثالثة
                        </p>
                      </div>

                      {/* Filter by Department */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(['all', 'CS', 'AI', 'IT', 'IS'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setSpecializationFilter(f)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              specializationFilter === f
                                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                                : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                          >
                            {f === 'all' ? 'جميع المتقدمين' : f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table */}
                    {specializationApplicants.length === 0 ? (
                      <div className="text-center py-12 text-sm text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                        لم يقم أي طالب بتقديم رغبات التشعيب بعد
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-right">
                          <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold">
                            <tr>
                              <th className="p-3">م</th>
                              <th className="p-3">رقم الجلوس</th>
                              <th className="p-3">اسم الطالب</th>
                              <th className="p-3">المعدل CGPA</th>
                              <th className="p-3">ترتيب الرغبات (1 &larr; 4)</th>
                              <th className="p-3">القسم المرشح له</th>
                              <th className="p-3">الحالة</th>
                              <th className="p-3 text-center">الاعتماد والترقية</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {specializationApplicants
                              .filter(a => {
                                if (specializationFilter === 'all') return true;
                                return a.assignedDepartment && a.assignedDepartment.includes(specializationFilter);
                              })
                              .sort((a, b) => b.cgpa - a.cgpa)
                              .map((app, idx) => (
                                <tr key={app.id || app.studentSeat} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                                  <td className="p-3 font-mono font-bold text-neutral-400">{idx + 1}</td>
                                  <td className="p-3 font-mono font-bold text-neutral-900 dark:text-white">{app.studentSeat}</td>
                                  <td className="p-3 font-semibold text-neutral-900 dark:text-white">{app.studentName}</td>
                                  <td className="p-3">
                                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                      app.cgpa >= 3.5 ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300' :
                                      app.cgpa >= 3.0 ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' :
                                      'bg-neutral-100 dark:bg-neutral-800 text-neutral-700'
                                    }`}>
                                      {app.cgpa.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1">
                                      {Array.isArray(app.preferences) && app.preferences.map((p: string, pIdx: number) => (
                                        <span key={p} className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                          pIdx === 0
                                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                        }`}>
                                          {pIdx + 1}:{p}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <select
                                      value={app.assignedDepartment || ''}
                                      onChange={async (e) => {
                                        const newDept = e.target.value;
                                        const res = await fetch('/api/admin/specialization/assign', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            studentSeat: app.studentSeat,
                                            department: newDept,
                                            status: 'تم الترشيح'
                                          })
                                        });
                                        if (res.ok) {
                                          showFlash(`تم تغيير ترشيح الطالب ${app.studentName} إلى ${newDept}`);
                                          fetchSpecializationData();
                                        }
                                      }}
                                      className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                                    >
                                      <option value="">لم يُحدد</option>
                                      <option value="علوم الحاسب (CS)">علوم الحاسب (CS)</option>
                                      <option value="الذكاء الاصطناعي (AI)">الذكاء الاصطناعي (AI)</option>
                                      <option value="تكنولوجيا المعلومات (IT)">تكنولوجيا المعلومات (IT)</option>
                                      <option value="نظم المعلومات (IS)">نظم المعلومات (IS)</option>
                                    </select>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      app.status === 'معتمد' ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300' :
                                      app.status === 'تم الترشيح' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' :
                                      'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                                    }`}>
                                      {app.status || 'قيد المراجعة'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      disabled={!app.assignedDepartment || app.status === 'معتمد'}
                                      onClick={async () => {
                                        if (!confirm(`هل أنت متأكد من اعتماد ترشيح الطالب ${app.studentName} نهائياً وترقيته للفرقة الثالثة قسم ${app.assignedDepartment}؟`)) return;
                                        const res = await fetch('/api/admin/specialization/assign', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            studentSeat: app.studentSeat,
                                            department: app.assignedDepartment,
                                            status: 'معتمد',
                                            applyToStudent: true
                                          })
                                        });
                                        if (res.ok) {
                                          showFlash(`تم اعتماد وترقية الطالب ${app.studentName} بنجاح`);
                                          fetchSpecializationData();
                                          fetchStudents();
                                        }
                                      }}
                                      className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                                        app.status === 'معتمد'
                                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-default'
                                          : !app.assignedDepartment
                                          ? 'opacity-30 cursor-not-allowed bg-neutral-200 text-neutral-500'
                                          : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                      }`}
                                    >
                                      {app.status === 'معتمد' ? '✓ معتمد نهائياً' : 'اعتماد وترقية'}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}

"""

if target in c:
    c = c.replace(target, specialization_panel + target)
    with open('src/components/AdminDashboardModal.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Inserted Specialization Panel successfully!')
else:
    print('Target TAB 8 not found!')
