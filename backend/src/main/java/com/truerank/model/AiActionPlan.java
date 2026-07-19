package com.truerank.model;

import java.time.LocalDateTime;
import java.util.List;

/**
 * AiActionPlan — DTO for a structured AI-generated action plan.
 * Contains weekly milestones, tasks, and learning resources.
 */
public class AiActionPlan {

    /** Plan title (e.g., "4-Week Plan to Land the SDE Role at Google") */
    private String title;

    /** Brief summary of the plan's strategy */
    private String summary;

    /** Week-by-week breakdown */
    private List<PlanWeek> weeks;

    /** Recommended learning resources */
    private List<String> resources;

    /** Estimated total hours to complete the plan */
    private int estimatedTimeHours;

    /** Timestamp when the plan was generated */
    private LocalDateTime generatedAt;

    /** Source: "GEMINI_AI" */
    private String source;

    // ===== Constructors =====
    public AiActionPlan() {}

    public AiActionPlan(String title, String summary, List<PlanWeek> weeks,
                        List<String> resources, int estimatedTimeHours) {
        this.title = title;
        this.summary = summary;
        this.weeks = weeks;
        this.resources = resources;
        this.estimatedTimeHours = estimatedTimeHours;
        this.generatedAt = LocalDateTime.now();
        this.source = "GEMINI_AI";
    }

    // ===== Inner Class: PlanWeek =====
    public static class PlanWeek {
        private int weekNumber;
        private String theme;
        private List<String> goals;
        private List<String> tasks;

        public PlanWeek() {}

        public PlanWeek(int weekNumber, String theme, List<String> goals, List<String> tasks) {
            this.weekNumber = weekNumber;
            this.theme = theme;
            this.goals = goals;
            this.tasks = tasks;
        }

        public int getWeekNumber() { return weekNumber; }
        public void setWeekNumber(int weekNumber) { this.weekNumber = weekNumber; }

        public String getTheme() { return theme; }
        public void setTheme(String theme) { this.theme = theme; }

        public List<String> getGoals() { return goals; }
        public void setGoals(List<String> goals) { this.goals = goals; }

        public List<String> getTasks() { return tasks; }
        public void setTasks(List<String> tasks) { this.tasks = tasks; }
    }

    // ===== Getters & Setters =====
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<PlanWeek> getWeeks() { return weeks; }
    public void setWeeks(List<PlanWeek> weeks) { this.weeks = weeks; }

    public List<String> getResources() { return resources; }
    public void setResources(List<String> resources) { this.resources = resources; }

    public int getEstimatedTimeHours() { return estimatedTimeHours; }
    public void setEstimatedTimeHours(int estimatedTimeHours) { this.estimatedTimeHours = estimatedTimeHours; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
