package com.truerank.service;

import com.truerank.model.*;
import com.truerank.repository.JobRepository;
import com.truerank.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * MatchingService — The core algorithm engine of TrueRank.
 *
 * Calculates a weighted match score between a student and each job posting,
 * then produces human-readable explanations for every dimension.
 *
 * Formula:  TotalScore = (SkillScore × 0.40) + (GPAScore × 0.30) + (AuthScore × 0.30)
 *
 * Each sub-score ranges from 0–100 and comes with a natural-language explanation,
 * matched/missing item lists, and actionable improvement tips.
 */
@Service
public class MatchingService {

    private static final double SKILL_WEIGHT = 0.40;
    private static final double GPA_WEIGHT   = 0.30;
    private static final double AUTH_WEIGHT   = 0.30;

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public MatchingService(StudentRepository studentRepository, JobRepository jobRepository) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    // ================================================================
    //  PUBLIC API
    // ================================================================

    /**
     * Compute ranked match results for a student against all jobs.
     */
    public List<MatchResult> getMatchesForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        List<Job> jobs = jobRepository.findAll();
        List<MatchResult> results = new ArrayList<>();

        for (Job job : jobs) {
            results.add(computeMatch(student, job));
        }

        // Sort by total score descending
        results.sort((a, b) -> Double.compare(b.getTotalScore(), a.getTotalScore()));

        // Assign ranks
        for (int i = 0; i < results.size(); i++) {
            results.get(i).setRank(i + 1);
        }

        return results;
    }

    /**
     * Compute a single match result between a student and a specific job.
     */
    public MatchResult getMatchForStudentAndJob(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        return computeMatch(student, job);
    }

    /**
     * Compare multiple jobs side-by-side for a student.
     */
    public List<MatchResult> compareJobs(Long studentId, List<Long> jobIds) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        List<MatchResult> results = new ArrayList<>();
        for (Long jobId : jobIds) {
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
            results.add(computeMatch(student, job));
        }

        results.sort((a, b) -> Double.compare(b.getTotalScore(), a.getTotalScore()));
        for (int i = 0; i < results.size(); i++) {
            results.get(i).setRank(i + 1);
        }

        return results;
    }

    // ================================================================
    //  CORE ALGORITHM
    // ================================================================

    private MatchResult computeMatch(Student student, Job job) {
        ScoreBreakdown breakdown = new ScoreBreakdown();

        // 1. Skill Score
        double skillScore = calculateSkillScore(student, job, breakdown);

        // 2. GPA Score
        double gpaScore = calculateGpaScore(student, job, breakdown);

        // 3. Authorization Score
        double authScore = calculateAuthScore(student, job, breakdown);

        // Weighted total
        double totalScore = (skillScore * SKILL_WEIGHT)
                          + (gpaScore * GPA_WEIGHT)
                          + (authScore * AUTH_WEIGHT);

        // Confidence
        String confidence = calculateConfidence(student, breakdown);

        // Improvement tips
        generateImprovementTips(student, job, skillScore, gpaScore, authScore, breakdown);

        // Build result
        MatchResult result = new MatchResult(job, totalScore, skillScore, gpaScore, authScore, confidence, breakdown);
        result.setProfileCompleteness(student.getProfileCompleteness());

        // Generate summary
        result.setMatchSummary(generateMatchSummary(student, job, totalScore, skillScore, gpaScore, authScore));

        return result;
    }

    // ================================================================
    //  SKILL SCORING
    // ================================================================

    /**
     * Skill Overlap Score (0–100)
     *
     * Uses Jaccard similarity for required skills and adds a bonus for
     * matching preferred skills. This is the most nuanced dimension.
     */
    private double calculateSkillScore(Student student, Job job, ScoreBreakdown breakdown) {
        List<String> studentSkills = student.getSkillList();
        List<String> requiredSkills = job.getRequiredSkillList();
        List<String> preferredSkills = job.getPreferredSkillList();

        if (requiredSkills.isEmpty()) {
            breakdown.setSkillExplanation("This role has no specific skill requirements — automatic full score.");
            breakdown.setMatchedSkills(Collections.emptyList());
            breakdown.setMissingSkills(Collections.emptyList());
            breakdown.setBonusSkills(Collections.emptyList());
            breakdown.setMissingPreferredSkills(Collections.emptyList());
            breakdown.setJaccardSimilarity(1.0);
            return 100.0;
        }

        // Matched required skills
        Set<String> studentSet = new HashSet<>(studentSkills);
        List<String> matched = requiredSkills.stream()
                .filter(studentSet::contains)
                .collect(Collectors.toList());
        List<String> missing = requiredSkills.stream()
                .filter(s -> !studentSet.contains(s))
                .collect(Collectors.toList());

        // Jaccard similarity on required skills
        Set<String> union = new HashSet<>(studentSkills);
        union.addAll(requiredSkills);
        Set<String> intersection = new HashSet<>(studentSkills);
        intersection.retainAll(new HashSet<>(requiredSkills));
        double jaccard = union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();

        // Preferred skill bonus
        List<String> bonusSkills = preferredSkills.stream()
                .filter(studentSet::contains)
                .collect(Collectors.toList());
        List<String> missingPreferred = preferredSkills.stream()
                .filter(s -> !studentSet.contains(s))
                .collect(Collectors.toList());

        double preferredRatio = preferredSkills.isEmpty() ? 0.0
                : (double) bonusSkills.size() / preferredSkills.size();

        // Composite: 70% required match, 30% preferred bonus
        double score = ((jaccard * 0.70) + (preferredRatio * 0.30)) * 100.0;

        // Populate breakdown
        breakdown.setMatchedSkills(matched);
        breakdown.setMissingSkills(missing);
        breakdown.setBonusSkills(bonusSkills);
        breakdown.setMissingPreferredSkills(missingPreferred);
        breakdown.setJaccardSimilarity(Math.round(jaccard * 1000.0) / 1000.0);

        // Generate explanation
        String explanation;
        if (matched.size() == requiredSkills.size()) {
            explanation = String.format("Perfect skill match! You have all %d required skills (%s).",
                    requiredSkills.size(), String.join(", ", matched));
        } else if (matched.isEmpty()) {
            explanation = String.format("No matching skills found. The role requires: %s.",
                    String.join(", ", requiredSkills));
        } else {
            explanation = String.format("You match %d of %d required skills (%s). Missing: %s.",
                    matched.size(), requiredSkills.size(),
                    String.join(", ", matched),
                    String.join(", ", missing));
        }

        if (!bonusSkills.isEmpty()) {
            explanation += String.format(" Bonus: You also have %d preferred skills (%s).",
                    bonusSkills.size(), String.join(", ", bonusSkills));
        }

        breakdown.setSkillExplanation(explanation);
        return Math.min(100.0, score);
    }

    // ================================================================
    //  GPA SCORING
    // ================================================================

    /**
     * GPA Fit Score (0–100)
     *
     * Rewards students who meet or exceed the GPA threshold. Uses a
     * graduated scale for students who fall slightly below.
     */
    private double calculateGpaScore(Student student, Job job, ScoreBreakdown breakdown) {
        double studentGpa = student.getGpa() != null ? student.getGpa() : 0.0;
        double requiredGpa = job.getMinGpa() != null ? job.getMinGpa() : 0.0;
        double delta = studentGpa - requiredGpa;

        breakdown.setStudentGpa(studentGpa);
        breakdown.setRequiredGpa(requiredGpa);
        breakdown.setGpaDelta(Math.round(delta * 100.0) / 100.0);

        double score;
        String explanation;

        if (requiredGpa <= 0.0) {
            score = 100.0;
            explanation = "This role has no GPA requirement — automatic full score.";
        } else if (delta >= 0) {
            score = 100.0;
            explanation = String.format("Excellent! Your GPA (%.2f) meets or exceeds the requirement (%.2f) by +%.2f.",
                    studentGpa, requiredGpa, delta);
        } else if (delta >= -0.3) {
            // Slightly below — linear 60-99
            score = 60.0 + (delta + 0.3) / 0.3 * 39.0;
            explanation = String.format("Close! Your GPA (%.2f) is just %.2f below the requirement (%.2f). " +
                    "Strong in other areas can compensate.", studentGpa, Math.abs(delta), requiredGpa);
        } else if (delta >= -0.5) {
            // Moderately below — linear 30-59
            score = 30.0 + (delta + 0.5) / 0.2 * 29.0;
            explanation = String.format("Your GPA (%.2f) is %.2f below the requirement (%.2f). " +
                    "This may affect your candidacy.", studentGpa, Math.abs(delta), requiredGpa);
        } else {
            // Significantly below — linear 0-29
            score = Math.max(0.0, 29.0 + (delta + 0.5) * 58.0);
            explanation = String.format("Your GPA (%.2f) is significantly below the requirement (%.2f). " +
                    "Consider roles with lower GPA thresholds.", studentGpa, requiredGpa);
        }

        breakdown.setGpaExplanation(explanation);
        return Math.max(0.0, Math.min(100.0, score));
    }

    // ================================================================
    //  WORK AUTHORIZATION SCORING
    // ================================================================

    /**
     * Work Authorization Score (0–100)
     *
     * Evaluates compatibility between student's authorization status and
     * job requirements. Considers sponsorship availability.
     */
    private double calculateAuthScore(Student student, Job job, ScoreBreakdown breakdown) {
        String studentAuth = student.getWorkAuthorization() != null
                ? student.getWorkAuthorization().toUpperCase().trim() : "OTHER";
        String jobAuth = job.getWorkAuthRequired() != null
                ? job.getWorkAuthRequired().toUpperCase().trim() : "ANY";
        boolean sponsorship = job.getSponsorshipAvailable() != null && job.getSponsorshipAvailable();

        breakdown.setStudentAuth(studentAuth);
        breakdown.setJobAuthRequired(jobAuth);
        breakdown.setSponsorshipAvailable(sponsorship);

        double score;
        String explanation;

        // Job accepts anyone
        if (jobAuth.equals("ANY") || jobAuth.equals("NONE")) {
            score = 100.0;
            explanation = "This role has no specific work authorization requirement — you're fully eligible.";
        }
        // Exact match
        else if (studentAuth.equals(jobAuth)) {
            score = 100.0;
            explanation = String.format("Perfect match! Your authorization (%s) matches the requirement exactly.",
                    formatAuth(studentAuth));
        }
        // Student is citizen — always compatible
        else if (studentAuth.equals("US_CITIZEN")) {
            score = 95.0;
            explanation = String.format("As a US Citizen, you're eligible for this role requiring %s.",
                    formatAuth(jobAuth));
        }
        // Student is permanent resident — mostly compatible
        else if (studentAuth.equals("PERMANENT_RESIDENT")) {
            if (jobAuth.equals("US_CITIZEN")) {
                score = 40.0;
                explanation = "This role specifically requires US Citizenship. As a Permanent Resident, " +
                        "you may not be eligible.";
            } else {
                score = 90.0;
                explanation = String.format("As a Permanent Resident, you're generally eligible for roles requiring %s.",
                        formatAuth(jobAuth));
            }
        }
        // Student needs sponsorship (F1, H1B, etc.)
        else if (studentAuth.contains("F1") || studentAuth.contains("OPT")
                || studentAuth.contains("CPT") || studentAuth.equals("H1B")) {
            if (sponsorship) {
                score = 70.0;
                explanation = String.format("Your authorization (%s) requires sponsorship, and this employer " +
                        "does offer visa sponsorship. Good fit!", formatAuth(studentAuth));
            } else {
                score = 10.0;
                explanation = String.format("Your authorization (%s) requires sponsorship, but this employer " +
                        "does NOT offer sponsorship. This is a significant barrier.", formatAuth(studentAuth));
            }
        }
        // Other / unknown
        else {
            if (sponsorship) {
                score = 50.0;
                explanation = String.format("Your authorization status (%s) may require additional verification. " +
                        "The employer does offer sponsorship.", formatAuth(studentAuth));
            } else {
                score = 20.0;
                explanation = String.format("Your authorization status (%s) may not be compatible with this role's " +
                        "requirement (%s). No sponsorship is available.", formatAuth(studentAuth), formatAuth(jobAuth));
            }
        }

        breakdown.setAuthExplanation(explanation);
        return score;
    }

    // ================================================================
    //  CONFIDENCE & EXPLANATIONS
    // ================================================================

    private String calculateConfidence(Student student, ScoreBreakdown breakdown) {
        double completeness = student.getProfileCompleteness();
        int dataPoints = 0;

        if (student.getSkills() != null && !student.getSkills().isBlank()) dataPoints++;
        if (student.getGpa() != null) dataPoints++;
        if (student.getWorkAuthorization() != null) dataPoints++;
        if (student.getMajor() != null) dataPoints++;
        if (student.getUniversity() != null) dataPoints++;

        if (completeness >= 0.8 && dataPoints >= 4) return "HIGH";
        if (completeness >= 0.5 && dataPoints >= 3) return "MEDIUM";
        return "LOW";
    }

    private void generateImprovementTips(Student student, Job job,
                                          double skillScore, double gpaScore, double authScore,
                                          ScoreBreakdown breakdown) {
        List<String> tips = new ArrayList<>();
        List<String> impacts = new ArrayList<>();

        // Skill improvement tips
        if (skillScore < 100 && breakdown.getMissingSkills() != null && !breakdown.getMissingSkills().isEmpty()) {
            List<String> missing = breakdown.getMissingSkills();
            if (missing.size() <= 3) {
                tips.add(String.format("Learn %s to match all required skills.", String.join(" and ", missing)));
                int potentialBoost = (int) Math.min(40, missing.size() * 12);
                impacts.add(String.format("+%d%% potential skill score boost", potentialBoost));
            } else {
                tips.add(String.format("Focus on learning %s first — these are high-demand skills.",
                        String.join(", ", missing.subList(0, 2))));
                impacts.add("+15-25% potential skill score boost");
            }
        }

        // Preferred skill tips
        if (breakdown.getMissingPreferredSkills() != null && !breakdown.getMissingPreferredSkills().isEmpty()) {
            tips.add(String.format("Adding %s (preferred skills) could give you a competitive edge.",
                    String.join(", ", breakdown.getMissingPreferredSkills())));
            impacts.add("+5-10% bonus score from preferred skills");
        }

        // GPA tips (if significantly low)
        if (gpaScore < 60) {
            tips.add("Strengthen other areas of your profile to compensate for the GPA gap — " +
                    "projects, certifications, and relevant experience can help.");
            impacts.add("Focus on demonstrating practical competence");
        }

        // Profile completeness tip
        if (student.getProfileCompleteness() < 0.8) {
            tips.add("Complete your profile to increase match confidence. " +
                    "Add a bio, strong skills, and profile photo.");
            impacts.add("Improves confidence from " + (student.getProfileCompleteness() < 0.5 ? "LOW" : "MEDIUM") + " to HIGH");
        }

        breakdown.setImprovementTips(tips);
        breakdown.setTipImpacts(impacts);
    }

    private String generateMatchSummary(Student student, Job job,
                                         double total, double skill, double gpa, double auth) {
        String tier = total >= 80 ? "excellent" : total >= 60 ? "good" : total >= 40 ? "moderate" : "low";
        String strongest = skill >= gpa && skill >= auth ? "skills"
                : gpa >= auth ? "GPA" : "work authorization";

        return String.format("%s has a %s match (%.0f%%) with the %s role at %s. " +
                        "Strongest dimension: %s (%.0f%%).",
                student.getName(), tier, total, job.getTitle(), job.getCompany(),
                strongest, Math.max(skill, Math.max(gpa, auth)));
    }

    // ================================================================
    //  HELPERS
    // ================================================================

    private String formatAuth(String auth) {
        if (auth == null) return "Unknown";
        return switch (auth.toUpperCase()) {
            case "US_CITIZEN" -> "US Citizen";
            case "PERMANENT_RESIDENT" -> "Permanent Resident";
            case "F1_OPT" -> "F1-OPT";
            case "F1_CPT" -> "F1-CPT";
            case "H1B" -> "H1-B Visa";
            case "ANY" -> "Any";
            default -> auth;
        };
    }
}
