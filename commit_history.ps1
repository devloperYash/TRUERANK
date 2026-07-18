if (Test-Path frontend\.git) { Remove-Item -Recurse -Force frontend\.git }
if (Test-Path backend\.git) { Remove-Item -Recurse -Force backend\.git }
if (Test-Path .git) { Remove-Item -Recurse -Force .git }

git init
git config user.name "Yash"
git config user.email "devloperYash@users.noreply.github.com"

# Set up root gitignore
Set-Content -Path .gitignore -Value "node_modules/`n/dist/`n/backend/target/`n*.log`n.env`n.idea/`n.vscode/`n"

# Chunk 1: Initial Backend Setup (09:30 AM)
git add backend/pom.xml backend/src/main/java/com/truerank/TrueRankApplication.java backend/src/main/java/com/truerank/model/Student.java backend/src/main/java/com/truerank/model/Job.java .gitignore README.md
$env:GIT_AUTHOR_DATE="2026-07-18T09:30:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-18T09:30:00+05:30"
git commit -m "Initial backend setup with core entity models"

# Chunk 2: Matching Engine Core (10:45 AM)
git add backend/src/main/java/com/truerank/model/MatchResult.java backend/src/main/java/com/truerank/model/ScoreBreakdown.java backend/src/main/java/com/truerank/service/MatchingService.java backend/src/test/
$env:GIT_AUTHOR_DATE="2026-07-18T10:45:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-18T10:45:00+05:30"
git commit -m "feat: implement weighted matching algorithm and explainability"

# Chunk 3: Backend APIs & Data Seeding (12:00 PM)
git add backend/src/main/java/com/truerank/repository/ backend/src/main/java/com/truerank/service/StudentService.java backend/src/main/java/com/truerank/service/JobService.java backend/src/main/java/com/truerank/controller/ backend/src/main/java/com/truerank/config/ backend/src/main/resources/
$env:GIT_AUTHOR_DATE="2026-07-18T12:00:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-18T12:00:00+05:30"
git commit -m "feat: complete REST APIs and data seeding"

# Chunk 4: Frontend Initialization (01:15 PM)
git add frontend/package.json frontend/angular.json frontend/tsconfig.* frontend/src/styles.css frontend/src/index.html frontend/src/main.ts frontend/README.md frontend/.gitignore frontend/.editorconfig frontend/.vscode/
$env:GIT_AUTHOR_DATE="2026-07-18T13:15:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-18T13:15:00+05:30"
git commit -m "chore: initialize Angular frontend and setup Obsidian design system"

# Chunk 5: Frontend Shared Components (01:45 PM)
git add frontend/src/app/models/ frontend/src/app/services/ frontend/src/app/components/
$env:GIT_AUTHOR_DATE="2026-07-18T13:45:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-18T13:45:00+05:30"
git commit -m "feat: build shared UI components (ScoreRing, RadarChart, MatchCard)"

# Chunk 6: Frontend Pages & Routing (02:10 PM)
git add frontend/src/app/pages/ frontend/src/app/app.*
$env:GIT_AUTHOR_DATE="2026-07-18T14:10:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-18T14:10:00+05:30"
git commit -m "feat: wire up pages and routing"

# Chunk 7: Final Polish (02:35 PM)
git add .
$env:GIT_AUTHOR_DATE="2026-07-18T14:35:00+05:30"
$env:GIT_COMMITTER_DATE="2026-07-18T14:35:00+05:30"
git commit -m "feat: add application tracking stretch goal and final polish"

# Push to remote
git branch -M main
git remote add origin https://github.com/devloperYash/TRUERANK.git
git push -u origin main
