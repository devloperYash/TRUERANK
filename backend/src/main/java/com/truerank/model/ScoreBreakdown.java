package com.truerank.model;

import java.util.List;

/**
 * ScoreBreakdown — Provides a detailed, explainable breakdown of how
 * each score dimension was calculated. This is the "why you matched"
 * heart of TrueRank's explainability.
 */
public class ScoreBreakdown {

    // ===== Skill Breakdown =====

    /** Skills the student has that the job requires */
    private List<String> matchedSkills;

    /** Skills the job requires that the student lacks */
    private List<String> missingSkills;

    /** Preferred skills the student has (bonus points) */
    private List<String> bonusSkills;

    /** Preferred skills the student lacks */
    private List<String> missingPreferredSkills;

    /** Natural-language explanation of skill score */
    private String skillExplanation;

    /** Jaccard similarity coefficient (0.0-1.0) */
    private double jaccardSimilarity;

    // ===== GPA Breakdown =====

    /** Student's GPA */
    private double studentGpa;

    /** Job's minimum required GPA */
    private double requiredGpa;

    /** GPA difference (positive = above requirement) */
    private double gpaDelta;

    /** Natural-language explanation of GPA score */
    private String gpaExplanation;

    // ===== Authorization Breakdown =====

    /** Student's work authorization type */
    private String studentAuth;

    /** Job's work authorization requirement */
    private String jobAuthRequired;

    /** Whether sponsorship is available */
    private boolean sponsorshipAvailable;

    /** Natural-language explanation of auth score */
    private String authExplanation;

    // ===== Improvement Tips =====

    /** Actionable suggestions to improve the match score */
    private List<String> improvementTips;

    /** Estimated score boost if tips are followed */
    private List<String> tipImpacts;

    // ===== Constructors =====
    public ScoreBreakdown() {}

    // ===== Getters & Setters =====
    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }

    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }

    public List<String> getBonusSkills() { return bonusSkills; }
    public void setBonusSkills(List<String> bonusSkills) { this.bonusSkills = bonusSkills; }

    public List<String> getMissingPreferredSkills() { return missingPreferredSkills; }
    public void setMissingPreferredSkills(List<String> missingPreferredSkills) { this.missingPreferredSkills = missingPreferredSkills; }

    public String getSkillExplanation() { return skillExplanation; }
    public void setSkillExplanation(String skillExplanation) { this.skillExplanation = skillExplanation; }

    public double getJaccardSimilarity() { return jaccardSimilarity; }
    public void setJaccardSimilarity(double jaccardSimilarity) { this.jaccardSimilarity = jaccardSimilarity; }

    public double getStudentGpa() { return studentGpa; }
    public void setStudentGpa(double studentGpa) { this.studentGpa = studentGpa; }

    public double getRequiredGpa() { return requiredGpa; }
    public void setRequiredGpa(double requiredGpa) { this.requiredGpa = requiredGpa; }

    public double getGpaDelta() { return gpaDelta; }
    public void setGpaDelta(double gpaDelta) { this.gpaDelta = gpaDelta; }

    public String getGpaExplanation() { return gpaExplanation; }
    public void setGpaExplanation(String gpaExplanation) { this.gpaExplanation = gpaExplanation; }

    public String getStudentAuth() { return studentAuth; }
    public void setStudentAuth(String studentAuth) { this.studentAuth = studentAuth; }

    public String getJobAuthRequired() { return jobAuthRequired; }
    public void setJobAuthRequired(String jobAuthRequired) { this.jobAuthRequired = jobAuthRequired; }

    public boolean isSponsorshipAvailable() { return sponsorshipAvailable; }
    public void setSponsorshipAvailable(boolean sponsorshipAvailable) { this.sponsorshipAvailable = sponsorshipAvailable; }

    public String getAuthExplanation() { return authExplanation; }
    public void setAuthExplanation(String authExplanation) { this.authExplanation = authExplanation; }

    public List<String> getImprovementTips() { return improvementTips; }
    public void setImprovementTips(List<String> improvementTips) { this.improvementTips = improvementTips; }

    public List<String> getTipImpacts() { return tipImpacts; }
    public void setTipImpacts(List<String> tipImpacts) { this.tipImpacts = tipImpacts; }
}
