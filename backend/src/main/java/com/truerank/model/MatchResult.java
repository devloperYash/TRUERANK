package com.truerank.model;

import java.util.List;
import java.util.Map;

/**
 * MatchResult — Represents the complete matching result between a student
 * and a job posting. This is a DTO (not persisted), calculated on-the-fly
 * by the MatchingService.
 *
 * Contains the total score, individual dimension scores, natural-language
 * explanations, and actionable improvement suggestions.
 */
public class MatchResult {

    /** The job being matched against */
    private Job job;

    /** Overall match score (0-100), weighted sum of dimensions */
    private double totalScore;

    /** Skill overlap score (0-100) */
    private double skillScore;

    /** GPA fit score (0-100) */
    private double gpaScore;

    /** Work authorization compatibility score (0-100) */
    private double authScore;

    /** Algorithm confidence level: HIGH, MEDIUM, LOW */
    private String confidence;

    /** Profile completeness of the student (0.0-1.0) */
    private double profileCompleteness;

    /** Detailed breakdown with explanations */
    private ScoreBreakdown breakdown;

    /** Natural-language summary of the match */
    private String matchSummary;

    /** Rank position among all matches for this student */
    private int rank;

    // ===== Constructors =====
    public MatchResult() {}

    public MatchResult(Job job, double totalScore, double skillScore,
                       double gpaScore, double authScore, String confidence,
                       ScoreBreakdown breakdown) {
        this.job = job;
        this.totalScore = Math.round(totalScore * 100.0) / 100.0;
        this.skillScore = Math.round(skillScore * 100.0) / 100.0;
        this.gpaScore = Math.round(gpaScore * 100.0) / 100.0;
        this.authScore = Math.round(authScore * 100.0) / 100.0;
        this.confidence = confidence;
        this.breakdown = breakdown;
    }

    /** Returns a color tier based on total score */
    public String getScoreTier() {
        if (totalScore >= 80) return "EXCELLENT";
        if (totalScore >= 60) return "GOOD";
        if (totalScore >= 40) return "FAIR";
        return "LOW";
    }

    // ===== Getters & Setters =====
    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public double getTotalScore() { return totalScore; }
    public void setTotalScore(double totalScore) { this.totalScore = totalScore; }

    public double getSkillScore() { return skillScore; }
    public void setSkillScore(double skillScore) { this.skillScore = skillScore; }

    public double getGpaScore() { return gpaScore; }
    public void setGpaScore(double gpaScore) { this.gpaScore = gpaScore; }

    public double getAuthScore() { return authScore; }
    public void setAuthScore(double authScore) { this.authScore = authScore; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }

    public double getProfileCompleteness() { return profileCompleteness; }
    public void setProfileCompleteness(double profileCompleteness) { this.profileCompleteness = profileCompleteness; }

    public ScoreBreakdown getBreakdown() { return breakdown; }
    public void setBreakdown(ScoreBreakdown breakdown) { this.breakdown = breakdown; }

    public String getMatchSummary() { return matchSummary; }
    public void setMatchSummary(String matchSummary) { this.matchSummary = matchSummary; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
}
