# TrueRank — Explainable Job Matching Platform

> **"See exactly why you matched."**

TrueRank is an explainable job/internship matching platform for students. It ranks postings by skill overlap, GPA, and work-authorization fit, with a transparent breakdown of **why** each match scored the way it did.

Built for **CredX Hiring Challenge 2.0** — Problem Statement 1.

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Matching Engine** | Weighted scoring: 40% skill overlap (Jaccard similarity), 30% GPA fit, 30% work authorization compatibility |
| **Explainable Scores** | Natural-language explanations for every dimension — "You match 4/5 required skills" |
| **Score DNA Strip** | Horizontal bar showing proportional contribution of each dimension |
| **Animated Score Rings** | SVG circular progress with gradient strokes |
| **Radar Chart** | Canvas-based 5-axis visualization |
| **Skill Gap Analysis** | ✅ matched, ❌ missing, ⭐ bonus skills with actionable tips |
| **Side-by-Side Compare** | Compare 2-3 jobs with visual diff highlighting |
| **Profile Management** | Edit skills, GPA, work-auth with live completeness indicator |
| **Search & Filters** | By role type, company, skills, work mode (remote/hybrid/onsite) |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 17 (standalone components, TypeScript) |
| **Backend** | Spring Boot 3.2 (Java 17+, REST APIs) |
| **Database** | H2 In-Memory (auto-seeded with demo data) |
| **API Docs** | SpringDoc OpenAPI / Swagger UI |
| **Design** | Custom CSS "Obsidian" design system (glassmorphism, dark theme) |

## 📁 Project Structure

```
Credx/
├── backend/                    # Spring Boot 3 API
│   ├── src/main/java/com/truerank/
│   │   ├── TrueRankApplication.java    # Main entry
│   │   ├── config/
│   │   │   ├── CorsConfig.java         # CORS for Angular
│   │   │   └── DataInitializer.java    # Seeds 5 students + 15 jobs
│   │   ├── controller/
│   │   │   ├── StudentController.java  # /api/students
│   │   │   ├── JobController.java      # /api/jobs
│   │   │   └── MatchController.java    # /api/matches
│   │   ├── model/
│   │   │   ├── Student.java            # Student entity
│   │   │   ├── Job.java                # Job entity
│   │   │   ├── MatchResult.java        # Match result DTO
│   │   │   └── ScoreBreakdown.java     # Explainability DTO
│   │   ├── repository/                 # JPA repositories
│   │   └── service/
│   │       ├── MatchingService.java    # Core algorithm
│   │       ├── StudentService.java
│   │       └── JobService.java
│   ├── src/test/                       # Unit tests
│   └── pom.xml
│
├── frontend/                   # Angular 17 SPA
│   ├── src/app/
│   │   ├── components/         # 8 shared components
│   │   │   ├── navbar/         # Glassmorphism navigation
│   │   │   ├── score-ring/     # Animated SVG score ring
│   │   │   ├── radar-chart/    # Canvas radar visualization
│   │   │   ├── skill-pills/    # Color-coded skill tags
│   │   │   ├── score-dna-strip/# Score composition bar
│   │   │   ├── match-card/     # Match result card
│   │   │   ├── score-breakdown/# Detailed explanation panel
│   │   │   ├── confidence-badge/# Algorithm confidence
│   │   │   └── particle-bg/    # Canvas particle animation
│   │   ├── pages/              # 4 page components
│   │   │   ├── dashboard/      # Hero + ranked match grid
│   │   │   ├── profile/        # Profile editor
│   │   │   ├── job-detail/     # Full match breakdown
│   │   │   └── compare/        # Side-by-side comparison
│   │   ├── services/           # HTTP API services
│   │   └── models/             # TypeScript interfaces
│   └── src/styles.css          # Obsidian design system
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (JDK)
- **Maven 3.6+**
- **Node.js 18+** and **npm 9+**

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at **http://localhost:8080**
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

### 2. Start the Frontend

```bash
cd frontend
npm install
ng serve
```

The app opens at **http://localhost:4200**

## 📊 Matching Algorithm

```
TotalScore = (SkillScore × 0.40) + (GPAScore × 0.30) + (AuthScore × 0.30)
```

### Skill Score (0–100)
- **Jaccard Similarity**: `|studentSkills ∩ requiredSkills| / |studentSkills ∪ requiredSkills|`
- **Preferred Bonus**: 30% weight for matching nice-to-have skills
- **Output**: Matched ✅, missing ❌, and bonus ⭐ skills listed

### GPA Score (0–100)
- ≥ requirement → 100%
- Within 0.3 → 60-99% (linear)
- Within 0.5 → 30-59%
- Below → 0-29%

### Work Authorization Score (0–100)
- Exact match → 100%
- US Citizen (any requirement) → 95%
- Sponsorship available + needed → 70%
- No sponsorship + needed → 10%

### Confidence Level
Based on profile completeness:
- **HIGH**: 80%+ profile complete
- **MEDIUM**: 50-80%
- **LOW**: < 50%

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | List all students |
| `GET` | `/api/students/{id}` | Get student by ID |
| `PUT` | `/api/students/{id}` | Update student profile |
| `GET` | `/api/jobs` | List all jobs |
| `GET` | `/api/jobs/filter?type=INTERNSHIP` | Filter jobs |
| `GET` | `/api/matches/{studentId}` | Get ranked matches |
| `GET` | `/api/matches/{studentId}/job/{jobId}` | Detailed match |
| `GET` | `/api/matches/{studentId}/compare?jobIds=1,2,3` | Compare jobs |

## 🧪 Running Tests

```bash
cd backend
mvn test
```

## 👤 Demo Data

Pre-seeded with 5 students and 15 jobs from Google, Microsoft, Stripe, Meta, Airbnb, Amazon, Netflix, Spotify, Tesla, Figma, CrowdStrike, Uber, Databricks, Adobe, and Twilio.

Default student: **Arjun Mehta** (ID: 1) — CS @ Stanford, GPA 3.85, F1-OPT

---

**Built with ❤️ for CredX Hiring Challenge 2.0**
