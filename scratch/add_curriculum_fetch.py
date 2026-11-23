import sys

with open('src/components/AdminDashboardModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add curriculumCourses state and doctors list
state_target = "  const [courseSlots, setCourseSlots] = useState<any[]>([]);"
state_replacement = """  const [courseSlots, setCourseSlots] = useState<any[]>([]);
  const [curriculumCourses, setCurriculumCourses] = useState<any[]>([]);
  const [activeSlotDeptModal, setActiveSlotDeptModal] = useState<string | null>(null);"""

if state_target in c:
    c = c.replace(state_target, state_replacement)
    print('Added curriculumCourses state!')
else:
    print('Failed state_target')

# 2. Add fetch /api/curriculum in fetchRegistrationData
fetch_reg_target = """  const fetchRegistrationData = async () => {
    try {
      const [statusRes, slotsRes, regsRes] = await Promise.all([
        fetch('/api/registration/status'),
        fetch('/api/admin/course-slots'),
        fetch('/api/admin/registrations')
      ]);"""

fetch_reg_replacement = """  const fetchRegistrationData = async () => {
    try {
      const [statusRes, slotsRes, regsRes, currRes] = await Promise.all([
        fetch('/api/registration/status'),
        fetch('/api/admin/course-slots'),
        fetch('/api/admin/registrations'),
        fetch('/api/curriculum')
      ]);
      if (currRes && currRes.ok) {
        const currData = await currRes.json();
        setCurriculumCourses(Array.isArray(currData) ? currData : []);
      }"""

if fetch_reg_target in c:
    c = c.replace(fetch_reg_target, fetch_reg_replacement)
    print('Added curriculum fetch in fetchRegistrationData!')
else:
    print('Failed fetch_reg_target')

with open('src/components/AdminDashboardModal.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
