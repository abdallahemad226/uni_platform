import os

with open('scratch/server_original_recovered.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('scratch/replacement_435.txt', 'r', encoding='utf-8') as f:
    rep435 = f.read()

with open('scratch/replacement_445.txt', 'r', encoding='utf-8') as f:
    rep445 = f.read()

# In rep435, extract CURRICULUM_DATABASE and helpers
curriculum_start = rep435.find('const CURRICULUM_DATABASE: CurriculumCourse[] = [')
curriculum_end = rep435.find('let studentOverridesStore: StudentCourseOverride[] = [];') + len('let studentOverridesStore: StudentCourseOverride[] = [];')
curriculum_block = rep435[curriculum_start:curriculum_end]

print("Curriculum block extracted:", len(curriculum_block))

# Find original stores in orig
# In orig, find from "const SCHEDULES_DATABASE" to "const app = express();"
sched_start = orig.find('const SCHEDULES_DATABASE')
sched_to_app = orig[sched_start:orig.find('const app = express();')]
print("Original other stores extracted:", len(sched_to_app))

# Find original routes in orig
# In orig, find from "const app = express();" to "app.listen(PORT"
app_routes = orig[orig.find('const app = express();'):orig.find('app.listen(PORT')]
print("Original routes extracted:", len(app_routes))
