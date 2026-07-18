# 🎯 TrueRank — Explainable AI Job Matching Platform

<div align="center">
  <h3><strong><a href="https://tr-kappa-vert.vercel.app/dashboard">🚀 View Live Demo: tr-kappa-vert.vercel.app</a></strong></h3>
  <p><em>Built for the CredX Hiring Challenge 2.0 (Problem Statement 1)</em></p>
</div>

---

## 📖 Overview

TrueRank is an **explainable job and internship matching platform** built for students. Instead of just showing a filtered list of jobs, TrueRank uses a weighted scoring algorithm to rank postings based on **Skill Overlap, GPA, and Work Authorization compatibility**. 

The core philosophy of TrueRank is **Transparency**. Every match comes with a detailed breakdown explaining exactly *why* a student matched with a role, what skills they are missing, and how they can improve their profile.

## ✨ Key Features (Hackathon Requirements Met)

✅ **Student Profile Creation:** Manage skills, GPA, Work Authorization, and Resume links.  
✅ **Job Listings:** Browse detailed job postings with role, location, remote/hybrid mode, and sponsorship availability.  
✅ **Explainable Matching Engine:** Calculates a Match Score (0-100%) and explains the breakdown.  
✅ **Advanced Filters:** Filter by Role, Location, Work Mode (Remote/Hybrid/Onsite), Visa Sponsorship, and 80%+ Matches.  
✅ **Match Score Indicators:** Visual Score Rings, Radar Charts, and Score DNA Strips.  
✅ **Application Tracking (Stretch Goal):** Students can apply to jobs and see a `✓ Applied` indicator on their dashboard.  
✅ **Side-by-Side Compare (Bonus):** Compare 2-3 jobs visually to see which is a better fit.  

---

## 🛠️ Technology Stack

**Frontend (Angular 17)**
- Standalone Components & Reactive Forms
- Custom "Obsidian" Glassmorphism UI Design System (CSS3 Variables, CSS Grid/Flexbox)
- Custom Pipes for Match-Score formatting
- `vercel.json` for SPA routing

**Backend (Spring Boot 3.2)**
- Java 17 + REST APIs
- Spring Data JPA
- Scoring Service (Runs algorithm logic in-memory)
- Configured for Docker-based deployment

**Database & Deployment**
- **H2 In-Memory Database:** Auto-seeded on startup with 5 Students and 15 Jobs for instant testing.
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render (Dockerized)

---

## 🧠 The Matching Engine Logic

The algorithm uses a rule-based weighting system:
`TotalScore = (SkillScore × 0.40) + (GPAScore × 0.30) + (AuthScore × 0.30)`

1. **Skill Score (40% Weight):**
   - Uses **Jaccard Similarity** `(|student ∩ required| / |student ∪ required|)`
   - Grants a **30% Bonus** for matching "Preferred/Nice-to-have" skills.
2. **GPA Score (30% Weight):**
   - Meets/Exceeds Requirement = 100%
   - Within 0.3 points = 60-99% (scaled linearly)
   - Within 0.5 points = 30-59%
3. **Work Authorization Score (30% Weight):**
   - US Citizen or Exact Match = 100%
   - Sponsorship Available & Needed = 70%
   - No Sponsorship & Needed = 10% (Hard penalty)

---

## 💻 Local Development Setup

### Prerequisites
- **Java 17+** and **Maven 3.6+**
- **Node.js 18+** and **Angular CLI 17+**

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
*The backend API will start at `http://localhost:8080/api`*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
```
*The frontend will open at `http://localhost:4200`*

---

## 📁 Repository Structure

- `/backend` - Spring Boot Application
  - `/controller` - REST API Endpoints
  - `/model` - Entities and DTOs (Job, Student, MatchResult, ScoreBreakdown)
  - `/service` - Core business logic (`MatchingService.java`)
  - `/config` - Data seeding and CORS configuration
- `/frontend` - Angular 17 Application
  - `/src/app/pages` - Dashboard, Job Detail, Profile, and Compare Views
  - `/src/app/components` - Reusable UI (Match Card, Score Ring, Radar Chart)
  - `/src/app/services` - HTTP clients communicating with backend
  - `/src/styles.css` - Global Obsidian UI Design System

---
<div align="center">
  <i>Developed for CredX Hiring Challenge 2.0</i>
</div>
