with open('src/components/AdminDashboardModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the premature closing tag
target = """                        </div>
                      </form>
                    )}
                  </div>
{/* Filter by level */}"""

replacement = """                        </div>
                      </form>
                    )}

{/* Filter by level */}"""

if target in c:
    c = c.replace(target, replacement)
    print('Fixed nesting successfully!')
    with open('src/components/AdminDashboardModal.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
else:
    print('Target not found!')
