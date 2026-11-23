import urllib.request, json

BASE = 'http://localhost:3000'

def test(name, url, method='GET', data=None):
    headers = {'Content-Type': 'application/json'} if data else {}
    req = urllib.request.Request(BASE + url, data=json.dumps(data).encode('utf-8') if data else None, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8')
            print(f'✅ [PASS] {name}: HTTP {resp.status}')
            return json.loads(content) if 'application/json' in resp.headers.get('Content-Type', '') else content
    except urllib.error.HTTPError as e:
        err = e.read().decode('utf-8')
        print(f'❌ [FAIL] {name}: HTTP {e.code} - {err}')
        return None

# 1. HTML home
test('Homepage load', '/')

# 2. Registration Status
status = test('Registration status', '/api/registration/status')
print('   Status keys count:', len(status) if status else 0)

# 3. Student 1042 (Level 4 CS)
s1042 = test('Student 1042 (Year 4 CS) Eligibility', '/api/registration/eligible?seatNumber=1042&semester=1')
if s1042:
    print(f'   Student: {s1042["student"]["name"]} - {s1042["student"]["department"]}')
    print(f'   Courses count: {len(s1042["courses"])}')
    print('   Eligible courses:', [c['code'] + ' (' + c['nameAr'] + ')' for c in s1042['courses'] if c['finalEligible']])

# 4. Student 2058 (Level 3 IS)
s2058 = test('Student 2058 (Year 3 IS) Eligibility', '/api/registration/eligible?seatNumber=2058&semester=1')
if s2058:
    print(f'   Student: {s2058["student"]["name"]} - {s2058["student"]["department"]}')
    print('   Eligible courses:', [c['code'] + ' (' + c['nameAr'] + ')' for c in s2058['courses'] if c['finalEligible']])

# 5. Student 3120 (Year 2) Specialization Submission
s3120 = test('Specialization Submit (Student 3120)', '/api/specialization/submit', method='POST', data={
    'studentSeat': '3120',
    'preferences': ['AI', 'CS', 'IT', 'IS']
})
if s3120:
    print('   Specialization submitted:', s3120['message'])

# 6. Admin Run Allocation
alloc = test('Admin Run Allocation', '/api/admin/specialization/run-allocation', method='POST')
if alloc:
    print('   Allocation distribution:', alloc['distribution'])

# 7. Admin Assign Department
assign = test('Admin Assign & Promote Student', '/api/admin/specialization/assign', method='POST', data={
    'studentSeat': '3120',
    'department': 'الذكاء الاصطناعي (AI)',
    'status': 'معتمد',
    'applyToStudent': True
})
if assign:
    print('   Assign result:', assign['message'])
