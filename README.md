# 🎯 TrueRank — Explainable AI Job Matching Platform

<div align="center">
  <img src="https://img.shields.io/badge/Angular-17.3-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 17" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot 3" />
  <img src="https://img.shields.io/badge/Gemini%20AI-2.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/H2-Database-003545?style=for-the-badge&logo=databricks&logoColor=white" alt="H2 DB" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Vercel-Hosted-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

<div align="center">
  <h3><strong><a href="https://tr-kappa-vert.vercel.app/dashboard">🚀 View Live Production Demo: tr-kappa-vert.vercel.app</a></strong></h3>
  <p><em>An explainable recruitment matching engine developed for the CredX Hiring Challenge 2.0 (Problem Statement 1)</em></p>
</div>

---

## 🔗 Quick Access Live Links

* **Live Frontend UI (Vercel):** [https://tr-kappa-vert.vercel.app/dashboard](https://tr-kappa-vert.vercel.app/dashboard)
* **Live Backend REST API (Render):** [https://truerank.onrender.com](https://truerank.onrender.com)
* **API Documentation (Swagger UI):** [https://truerank.onrender.com/swagger-ui/index.html](https://truerank.onrender.com/swagger-ui/index.html)

### 👤 Default Demo Profile (Used for Initial Login)
By default, the live frontend loads using the context of the primary test student:
* **Default Student:** **Arjun Mehta** (ID: 1)
  * **University:** Stanford University (CS)
  * **GPA:** 3.85
  * **Work Authorization:** F1-OPT (Requires Sponsorship)
  * **Skills:** Java, Spring Boot, Angular, TypeScript, Python, React, SQL, Docker, Git, REST APIs
  * **Strong Skills:** Java, Angular, Spring Boot

*To test different scoring results, navigate to the **Profile** tab in the app and modify these parameters (e.g., change work auth to US Citizen, change GPA, or edit skills). The engine will recalculate all match scores instantly.*


---

## 📖 Project Vision & Overview

In modern recruiting, students are often matching with jobs through "black-box" systems. TrueRank solves this by providing **explainable job and internship matching**. Instead of displaying a generic list of job recommendations, TrueRank calculates a transparent **Match Score (0-100%)** based on three dimensions: **Skill Overlap, GPA Requirements, and Work Authorization Compatibility**.

Crucially, the platform breaks down the score down to the decimal point, explaining exactly *why* a student matched, what specific skills are missing, and providing actionable improvement tips to help them bridge the gap.

---

## ✨ Core Features & Functionality

### 1. Transparent Ranked Dashboard
- **Ranked Match Grid:** Displays jobs in order of matching compatibility (High to Low).
- **Match Card DNA Strip:** A horizontal bar showing the relative contribution of Skills, GPA, and Work Auth to the overall score.
- **Why-Matched Tooltips:** Direct in-card summaries highlighting top matching aspects (e.g., *“Matched on Java, Spring Boot + GPA above threshold”*).
- **Applied Status Indicators:** Dynamically marks roles as `✓ Applied` if the student has applied to them.

### 2. Multi-Dimensional Filters
- **Visa Sponsorship Filter:** Allows students to filter exclusively for roles that sponsor work visas.
- **Work Mode Filter:** Easily segment jobs by Remote, Hybrid, or Onsite.
- **Job Type Filter:** Filter by Full-Time, Internship, Part-Time, or Co-Op roles.
- **Tier-Based Filter:** Filter for "Excellent Matches" (80%+ total match score).

### 3. Detailed Match Breakdown
- **Radar Charts:** A 5-axis visual representation of the student's profile vs. the job requirements.
- **Color-Coded Skill Pills:** Categorizes skills into matched (Green ✅), missing (Red ❌), and bonus (Purple ⭐).
- **Actionable Tips:** Gives clear tips on how to improve the match score (e.g., *“Earn 8% by adding TypeScript to your profile”*).

### 4. 🤖 Gemini AI Career Coach (New!)
- **AI Tips Panel:** Uses Google Gemini 2.0 Flash to analyze the match and provide hyper-personalized, actionable career advice (with typing animations).
- **Action Plan Generator:** Generates a structured 4-week timeline with weekly milestones, specific tasks, and recommended resources to improve candidacy.
- **Secure Backend Integration:** Prompts are engineered on the Spring Boot backend, keeping API keys secure. Fallbacks to rule-based tips if AI is unavailable.

### 5. Interactive Side-by-Side Comparison
- Compare 2 or 3 job offers side-by-side.
- Highlights visual diffs in required skills, GPA requirements, salaries, and locations.

### 6. Profile Customizer & Live Analytics
- Complete editor for student profile details (Name, GPA, Graduation Year, Skills, Strong Skills, and Work Authorization).
- Features a **Completeness Score Ring** that updates live as the student adds details.

---

## 🧠 Matching Engine & Algorithm Design

The core of TrueRank is its mathematical scoring service, which weights dimensions to compile the final score:

$$\text{Total Score} = (\text{Skill Score} \times 0.40) + (\text{GPA Score} \times 0.30) + (\text{Work Auth Score} \times 0.30)$$

### 1. Skill Score (40% Weight)
- Calculates **Jaccard Similarity** between student skills and job required skills:
  $$J(S, R) = \frac{|S \cap R|}{|S \cup R|}$$
- Adds a **30% bonus** multiplier for matching any **Preferred/Nice-to-have** skills listed on the job posting, capped at 100%.

### 2. GPA Score (30% Weight)
- If the student's GPA meets or exceeds the requirement: **100%**
- If the student's GPA is within `0.3` points of the requirement: **60% - 99%** (scaled linearly)
- If the student's GPA is within `0.5` points of the requirement: **30% - 59%** (scaled linearly)
- Below `0.5` points: **0% - 29%**

### 3. Work Authorization Score (30% Weight)
- Exact Match (e.g., US Citizen matching a role requiring US Citizenship): **100%**
- US Citizen applying to any role: **95%**
- Student requires sponsorship + Job provides sponsorship: **70%**
- Student requires sponsorship + Job does **NOT** provide sponsorship: **10%** (Hard penalty)

---

## 🎨 Obsidian Design System (UI/UX) & Theme Engine

TrueRank implements the custom **Obsidian Design System**, configured directly using Vanilla CSS custom variables:
- **Aesthetic:** Glassmorphism with deep space violet, emerald green, and neon cyan accents.
- **🌗 Light/Dark Mode:** Full theme engine with smooth 400ms transitions. Animated sun/moon toggle in the navbar.
- **Persistence & Auto-Detection:** Automatically detects system preference (`prefers-color-scheme`) and persists user choice via `localStorage`.
- **Effects:** Backdrop filters (`blur(16px)`), micro-interactions on hover, and smooth scaling animations.
- **Responsiveness:** Fluid grid layout adapting seamlessly from wide-screen desktops to mobile viewports.

---

## 📁 Repository Structure

```text
TrueRank/
├── backend/                              # Spring Boot 3.2 Application
│   ├── src/main/java/com/truerank/
│   │   ├── TrueRankApplication.java      # Main Application Entry Point
│   │   ├── config/
│   │   │   ├── CorsConfig.java           # Cross-Origin configurations for frontend integration
│   │   │   └── DataInitializer.java      # Seeds 5 Students and 15 Jobs into H2 DB on startup
│   │   ├── controller/                   # REST API Endpoints
│   │   │   ├── JobController.java        # /api/jobs
│   │   │   ├── MatchController.java      # /api/matches (Explainable AI Engine)
│   │   │   └── StudentController.java    # /api/students (Profiles & Applications)
│   │   ├── model/                        # Entities & Data Transfer Objects (DTOs)
│   │   │   ├── Job.java                  # Job posting JPA Entity
│   │   │   ├── Student.java              # Student profile JPA Entity
│   │   │   ├── MatchResult.java          # Match score and rank DTO
│   │   │   └── ScoreBreakdown.java       # Granular explainability metrics DTO
│   │   ├── repository/                   # Spring Data JPA Interfaces
│   │   │   ├── JobRepository.java
│   │   │   └── StudentRepository.java
│   │   └── service/                      # Core Business Logic
│   │       ├── JobService.java
│   │       ├── StudentService.java
│   │       └── MatchingService.java      # The Matching Algorithm implementation
│   ├── src/main/resources/
│   │   └── application.properties        # In-memory H2 DB & Hibernate configurations
│   ├── Dockerfile                        # Multi-stage Docker config for Render hosting
│   └── pom.xml                           # Maven Dependencies
│
├── frontend/                             # Angular 17 Single Page Application
│   ├── src/app/
│   │   ├── components/                   # Reusable UI Elements
│   │   │   ├── confidence-badge/         # Algorithmic confidence level
│   │   │   ├── match-card/               # Job match cards in dashboard grid
│   │   │   ├── navbar/                   # Navigation component
│   │   │   ├── particle-bg/              # Interactive canvas background particles
│   │   │   ├── radar-chart/              # Canvas match profile visualizer
│   │   │   ├── score-breakdown/          # Tabular explanation layout
│   │   │   ├── score-dna-strip/          # Score proportion indicators
│   │   │   ├── score-ring/               # Animated SVG Circular Progress Rings
│   │   │   └── skill-pills/              # Color-coded skill badges
│   │   ├── pages/                        # Routable Views
│   │   │   ├── compare/                  # Side-by-side job matching comparison
│   │   │   ├── dashboard/                # Main interface with filters
│   │   │   ├── job-detail/               # In-depth matching analysis screen
│   │   │   └── profile/                  # Student profile management
│   │   ├── models/                       # Type safety interfaces
│   │   │   ├── job.model.ts
│   │   │   ├── match.model.ts
│   │   │   └── student.model.ts
│   │   ├── services/                     # API Communication Services
│   │   │   ├── job.service.ts
│   │   │   ├── match.service.ts
│   │   │   └── student.service.ts
│   │   ├── app.routes.ts                 # Route definitions
│   │   └── app.component.ts              # Entry layout wrapper
│   ├── src/environments/                 # Build environment targets
│   │   ├── environment.ts                # Dev config
│   │   └── environment.prod.ts           # Production API endpoints (pointing to Render)
│   ├── src/styles.css                    # Global Obsidian Design System CSS
│   ├── vercel.json                       # Vercel configuration for SPA URL routing
│   └── angular.json                      # Workspace configurations
└── README.md                             # Global documentation
```

## 👤 Additional Demo Profiles for Testing

Apart from Arjun, you can also test the algorithm using these pre-seeded student profiles (which can be simulated by changing values in the **Profile** editor):

1. **Emily Chen** (ID: 2) — MIT (Data Science)
   * GPA: 3.92 | US Citizen | Skills: Python, TensorFlow, PyTorch, SQL, Pandas
2. **Rahul Sharma** (ID: 3) — UC Berkeley (EECS)
   * GPA: 3.45 | F1-CPT (Internship Visa) | Skills: C++, Python, MATLAB, Linux

---

## 📊 Database Schema & Auto-Seeding

TrueRank uses a relational schema containing:
* **Student:** Stores contact info, academic details (GPA), work authorization status, resume links, and a collection of applied job IDs.
* **Job:** Stores company details, description, salary, location, work mode, sponsorship policies, required skills, and preferred skills.

On application startup, `DataInitializer.java` seeds **5 realistic students** (ranging from Stanford CS graduates on F1-OPT visas to local university students with varying GPAs) and **15 job postings** from top tech companies (Google, Stripe, Microsoft, Netflix, Tesla, Databricks, CrowdStrike, and more) to demonstrate the algorithm's scoring variance.

---

## 💻 Local Installation & Setup

### Prerequisites
* **Java 17+**
* **Maven 3.6+**
* **Node.js 18+** & **npm 9+**

### 1. Launch the Backend
```bash
cd backend
# Set your Gemini API key as an environment variable (Required for AI features)
export GEMINI_API_KEY="your_api_key_here"

mvn clean package -DskipTests
mvn spring-boot:run
```
- The REST API will be available at `http://localhost:8080`
- You can access the local H2 Console at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:truerankdb`, Username: `sa`, Password: *empty*)

### 2. Launch the Frontend
```bash
cd frontend
npm install
npm start
```
- The frontend client will run at `http://localhost:4200/`

---

## 🚀 Deployment Guide

### Backend (Docker on Render.com)
The backend contains a custom multi-stage `Dockerfile` to handle dependencies and compile Java packages inside a secure container:
1. Create a new **Web Service** on Render.
2. Link your repository and set the Root Directory to `backend`.
3. Set the Runtime to **Docker**.
4. **Crucial:** Go to the Environment tab and add your `GEMINI_API_KEY` variable.
5. Click deploy. Render will automatically build the image and serve the API.

### Frontend (Vercel)
1. Add a new project on Vercel and link your repository.
2. Select the **Root Directory** as `frontend`.
3. Under **Build & Development Settings**, toggle **Override** on the **Output Directory** and set it to: `dist/frontend/browser`
4. Click Deploy. Vercel's Edge network will host your compiled Angular assets.

---
<div align="center">
  <strong>Developed with ❤️ for the CredX Hiring Challenge 2.0</strong>
</div>
