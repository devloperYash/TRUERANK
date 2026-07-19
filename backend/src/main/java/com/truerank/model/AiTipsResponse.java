package com.truerank.model;

import java.time.LocalDateTime;

/**
 * AiTipsResponse — DTO for AI-generated career tips.
 * Returned by the AI Coach endpoint when a student views a job match.
 */
public class AiTipsResponse {

    /** AI-generated career tips (may contain markdown formatting) */
    private String tips;

    /** Whether an action plan can be generated for this match */
    private boolean planAvailable;

    /** Timestamp when the tips were generated */
    private LocalDateTime generatedAt;

    /** Source of the tips: "GEMINI_AI" or "RULE_BASED" */
    private String source;

    // ===== Constructors =====
    public AiTipsResponse() {}

    public AiTipsResponse(String tips, boolean planAvailable, String source) {
        this.tips = tips;
        this.planAvailable = planAvailable;
        this.generatedAt = LocalDateTime.now();
        this.source = source;
    }

    // ===== Getters & Setters =====
    public String getTips() { return tips; }
    public void setTips(String tips) { this.tips = tips; }

    public boolean isPlanAvailable() { return planAvailable; }
    public void setPlanAvailable(boolean planAvailable) { this.planAvailable = planAvailable; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
