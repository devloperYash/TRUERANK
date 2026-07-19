package com.truerank.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.truerank.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * GeminiService — Integrates Google Gemini AI (2.0 Flash) for
 * personalized career coaching and action plan generation.
 *
 * Sends structured prompts with full match context to Gemini
 * and parses the response into usable DTOs. Falls back to
 * rule-based tips on any failure.
 */
@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // ================================================================
    //  CAREER TIPS GENERATION
    // ================================================================

    /**
     * Generate personalized AI career tips for a student-job match.
     */
    public AiTipsResponse generateCareerTips(Student student, Job job, MatchResult matchResult) {
        try {
            String prompt = buildTipsPrompt(student, job, matchResult);
            String aiResponse = callGemini(prompt);

            if (aiResponse != null && !aiResponse.isBlank()) {
                return new AiTipsResponse(aiResponse, true, "GEMINI_AI");
            }
        } catch (Exception e) {
            System.err.println("Gemini AI tips generation failed: " + e.getMessage());
        }

        // Fallback to rule-based tips
        return buildFallbackTips(matchResult);
    }

    // ================================================================
    //  ACTION PLAN GENERATION
    // ================================================================

    /**
     * Generate a structured action plan for a student targeting a specific job.
     */
    public AiActionPlan generateActionPlan(Student student, Job job, MatchResult matchResult) {
        try {
            String prompt = buildPlanPrompt(student, job, matchResult);
            String aiResponse = callGemini(prompt);

            if (aiResponse != null && !aiResponse.isBlank()) {
                return parseActionPlan(aiResponse, student, job);
            }
        } catch (Exception e) {
            System.err.println("Gemini AI plan generation failed: " + e.getMessage());
        }

        // Fallback to a basic plan
        return buildFallbackPlan(student, job, matchResult);
    }

    // ================================================================
    //  GEMINI API CALL
    // ================================================================

    /**
     * Call the Gemini API with a text prompt and return the generated text.
     */
    private String callGemini(String prompt) {
        try {
            String url = apiUrl + "?key=" + apiKey;

            // Build request body
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", List.of(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(parts));

            // Generation config for better results
            Map<String, Object> genConfig = new HashMap<>();
            genConfig.put("temperature", 0.7);
            genConfig.put("topP", 0.9);
            genConfig.put("maxOutputTokens", 2048);
            requestBody.put("generationConfig", genConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return extractTextFromResponse(response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Gemini API call failed: " + e.getMessage());
            throw e;
        }
        return null;
    }

    /**
     * Extract the generated text from Gemini's JSON response.
     */
    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to parse Gemini response: " + e.getMessage());
        }
        return null;
    }

    // ================================================================
    //  PROMPT ENGINEERING
    // ================================================================

    private String buildTipsPrompt(Student student, Job job, MatchResult matchResult) {
        ScoreBreakdown bd = matchResult.getBreakdown();

        return String.format("""
            You are an expert AI career coach analyzing a student's compatibility with a job posting.
            Provide personalized, actionable career tips based on the match analysis below.

            === STUDENT PROFILE ===
            Name: %s
            University: %s | Major: %s
            GPA: %.2f / 4.0
            Skills: %s
            Strong Skills: %s
            Work Authorization: %s

            === JOB POSTING ===
            Title: %s at %s
            Location: %s | Type: %s | Mode: %s
            Required Skills: %s
            Preferred Skills: %s
            Min GPA: %.2f
            Work Auth Required: %s | Sponsorship: %s
            Salary: %s

            === MATCH ANALYSIS ===
            Overall Match Score: %.1f%% (Tier: %s)
            - Skill Score: %.1f%% (Matched: %s | Missing: %s)
            - GPA Score: %.1f%% (Delta: %+.2f)
            - Work Auth Score: %.1f%%
            - Jaccard Similarity: %.3f
            - Confidence: %s

            === INSTRUCTIONS ===
            Based on this analysis, provide 4-5 specific, actionable career tips.
            Format each tip as a clear bullet point.
            Be specific — mention actual skill names, courses, and strategies.
            Include estimated impact on their match score where possible.
            Keep the tone encouraging but honest.
            Do NOT use markdown headers. Use bullet points (•) for each tip.
            Keep total response under 300 words.
            """,
                student.getName(),
                student.getUniversity(), student.getMajor(),
                student.getGpa() != null ? student.getGpa() : 0.0,
                student.getSkills() != null ? student.getSkills() : "None",
                student.getStrongSkills() != null ? student.getStrongSkills() : "None",
                student.getWorkAuthorization() != null ? student.getWorkAuthorization() : "Unknown",
                job.getTitle(), job.getCompany(),
                job.getLocation(), job.getJobType(),
                job.getWorkMode() != null ? job.getWorkMode() : "Not specified",
                job.getRequiredSkills(),
                job.getPreferredSkills() != null ? job.getPreferredSkills() : "None",
                job.getMinGpa() != null ? job.getMinGpa() : 0.0,
                job.getWorkAuthRequired(),
                job.getSponsorshipAvailable() != null && job.getSponsorshipAvailable() ? "Yes" : "No",
                job.getSalary() != null ? job.getSalary() : "Not disclosed",
                matchResult.getTotalScore(), matchResult.getScoreTier(),
                matchResult.getSkillScore(),
                bd.getMatchedSkills() != null ? String.join(", ", bd.getMatchedSkills()) : "None",
                bd.getMissingSkills() != null ? String.join(", ", bd.getMissingSkills()) : "None",
                matchResult.getGpaScore(), bd.getGpaDelta(),
                matchResult.getAuthScore(),
                bd.getJaccardSimilarity(),
                matchResult.getConfidence()
        );
    }

    private String buildPlanPrompt(Student student, Job job, MatchResult matchResult) {
        ScoreBreakdown bd = matchResult.getBreakdown();

        return String.format("""
            You are an expert AI career coach. Create a structured 4-week action plan for a student
            to improve their candidacy for a specific job posting.

            === STUDENT ===
            Name: %s | University: %s | Major: %s | GPA: %.2f
            Current Skills: %s
            Work Authorization: %s

            === TARGET JOB ===
            %s at %s (%s, %s)
            Required Skills: %s
            Preferred Skills: %s
            Min GPA: %.2f

            === CURRENT MATCH ===
            Score: %.1f%% | Missing Skills: %s

            === INSTRUCTIONS ===
            Create a 4-week action plan in this EXACT format:

            TITLE: [A motivating plan title]
            SUMMARY: [One sentence summary of the strategy]
            ESTIMATED_HOURS: [total number, just the number]

            WEEK 1: [Theme]
            GOALS:
            - [goal 1]
            - [goal 2]
            TASKS:
            - [specific task 1]
            - [specific task 2]
            - [specific task 3]

            WEEK 2: [Theme]
            GOALS:
            - [goal 1]
            - [goal 2]
            TASKS:
            - [specific task 1]
            - [specific task 2]
            - [specific task 3]

            WEEK 3: [Theme]
            GOALS:
            - [goal 1]
            - [goal 2]
            TASKS:
            - [specific task 1]
            - [specific task 2]
            - [specific task 3]

            WEEK 4: [Theme]
            GOALS:
            - [goal 1]
            - [goal 2]
            TASKS:
            - [specific task 1]
            - [specific task 2]
            - [specific task 3]

            RESOURCES:
            - [resource 1]
            - [resource 2]
            - [resource 3]
            - [resource 4]

            Be specific with real skill names, real platforms, and practical tasks.
            """,
                student.getName(), student.getUniversity(), student.getMajor(),
                student.getGpa() != null ? student.getGpa() : 0.0,
                student.getSkills() != null ? student.getSkills() : "None",
                student.getWorkAuthorization() != null ? student.getWorkAuthorization() : "Unknown",
                job.getTitle(), job.getCompany(), job.getLocation(), job.getJobType(),
                job.getRequiredSkills(),
                job.getPreferredSkills() != null ? job.getPreferredSkills() : "None",
                job.getMinGpa() != null ? job.getMinGpa() : 0.0,
                matchResult.getTotalScore(),
                bd.getMissingSkills() != null ? String.join(", ", bd.getMissingSkills()) : "None"
        );
    }

    // ================================================================
    //  RESPONSE PARSING
    // ================================================================

    /**
     * Parse Gemini's structured text response into an AiActionPlan object.
     */
    private AiActionPlan parseActionPlan(String aiResponse, Student student, Job job) {
        String title = extractField(aiResponse, "TITLE:");
        String summary = extractField(aiResponse, "SUMMARY:");
        String hoursStr = extractField(aiResponse, "ESTIMATED_HOURS:");
        int hours = 40; // default
        try {
            hours = Integer.parseInt(hoursStr.replaceAll("[^0-9]", ""));
        } catch (Exception ignored) {}

        List<AiActionPlan.PlanWeek> weeks = new ArrayList<>();
        for (int w = 1; w <= 4; w++) {
            String weekHeader = "WEEK " + w + ":";
            String nextWeekHeader = w < 4 ? "WEEK " + (w + 1) + ":" : "RESOURCES:";

            int weekStart = aiResponse.indexOf(weekHeader);
            int weekEnd = aiResponse.indexOf(nextWeekHeader);

            if (weekStart >= 0) {
                String weekBlock = weekEnd > weekStart
                        ? aiResponse.substring(weekStart, weekEnd)
                        : aiResponse.substring(weekStart);

                String theme = weekBlock.substring(weekHeader.length()).split("\n")[0].trim();
                List<String> goals = extractBulletPoints(weekBlock, "GOALS:");
                List<String> tasks = extractBulletPoints(weekBlock, "TASKS:");

                weeks.add(new AiActionPlan.PlanWeek(w, theme, goals, tasks));
            }
        }

        List<String> resources = extractBulletPoints(aiResponse, "RESOURCES:");

        if (title.isBlank()) {
            title = String.format("Action Plan: %s at %s", job.getTitle(), job.getCompany());
        }
        if (summary.isBlank()) {
            summary = String.format("A personalized 4-week plan to improve %s's match for the %s role.",
                    student.getName(), job.getTitle());
        }

        return new AiActionPlan(title, summary, weeks, resources, hours);
    }

    private String extractField(String text, String fieldName) {
        int idx = text.indexOf(fieldName);
        if (idx < 0) return "";
        String after = text.substring(idx + fieldName.length());
        String line = after.split("\n")[0].trim();
        return line;
    }

    private List<String> extractBulletPoints(String text, String sectionName) {
        List<String> items = new ArrayList<>();
        int idx = text.indexOf(sectionName);
        if (idx < 0) return items;

        String after = text.substring(idx + sectionName.length());
        String[] lines = after.split("\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("- ")) {
                items.add(trimmed.substring(2).trim());
            } else if (!trimmed.isEmpty() && !trimmed.startsWith("-")
                    && !trimmed.equals(sectionName.trim()) && items.size() > 0
                    && (trimmed.startsWith("WEEK") || trimmed.startsWith("GOALS:")
                    || trimmed.startsWith("TASKS:") || trimmed.startsWith("RESOURCES:")
                    || trimmed.startsWith("TITLE:") || trimmed.startsWith("SUMMARY:")
                    || trimmed.startsWith("ESTIMATED_HOURS:"))) {
                break;
            }
        }
        return items;
    }

    // ================================================================
    //  FALLBACKS
    // ================================================================

    private AiTipsResponse buildFallbackTips(MatchResult matchResult) {
        ScoreBreakdown bd = matchResult.getBreakdown();
        StringBuilder tips = new StringBuilder();

        tips.append("Here are some tips to improve your match:\n\n");

        if (bd.getImprovementTips() != null) {
            for (int i = 0; i < bd.getImprovementTips().size(); i++) {
                tips.append("• ").append(bd.getImprovementTips().get(i));
                if (bd.getTipImpacts() != null && i < bd.getTipImpacts().size()) {
                    tips.append(" (").append(bd.getTipImpacts().get(i)).append(")");
                }
                tips.append("\n\n");
            }
        }

        if (tips.toString().equals("Here are some tips to improve your match:\n\n")) {
            tips.append("• Your profile is a strong match! Keep your skills updated and apply early.\n");
        }

        return new AiTipsResponse(tips.toString().trim(), true, "RULE_BASED");
    }

    private AiActionPlan buildFallbackPlan(Student student, Job job, MatchResult matchResult) {
        ScoreBreakdown bd = matchResult.getBreakdown();
        List<AiActionPlan.PlanWeek> weeks = new ArrayList<>();

        // Week 1: Skills Assessment
        List<String> w1Goals = List.of("Identify skill gaps", "Set up learning environment");
        List<String> w1Tasks = new ArrayList<>();
        w1Tasks.add("Review the job's required skills and identify your gaps");
        if (bd.getMissingSkills() != null && !bd.getMissingSkills().isEmpty()) {
            w1Tasks.add("Start learning: " + String.join(", ", bd.getMissingSkills()));
        }
        w1Tasks.add("Set up a project portfolio on GitHub");
        weeks.add(new AiActionPlan.PlanWeek(1, "Skills Assessment & Setup", w1Goals, w1Tasks));

        // Week 2: Deep Learning
        weeks.add(new AiActionPlan.PlanWeek(2, "Core Skill Building",
                List.of("Master key required skills", "Build sample projects"),
                List.of("Complete online courses for missing skills",
                        "Build a small project demonstrating each skill",
                        "Practice coding challenges daily")));

        // Week 3: Portfolio & Practice
        weeks.add(new AiActionPlan.PlanWeek(3, "Portfolio Development",
                List.of("Complete portfolio projects", "Practice interview skills"),
                List.of("Finish and polish your portfolio project",
                        "Write clear README documentation",
                        "Practice behavioral and technical interviews")));

        // Week 4: Application
        weeks.add(new AiActionPlan.PlanWeek(4, "Application & Outreach",
                List.of("Submit a strong application", "Network with employees"),
                List.of("Tailor your resume to match the job description",
                        "Write a compelling cover letter",
                        "Connect with current employees on LinkedIn")));

        List<String> resources = List.of(
                "LeetCode/HackerRank for coding practice",
                "Coursera/Udemy for skill courses",
                "GitHub for portfolio hosting",
                "LinkedIn for networking");

        String title = String.format("4-Week Plan: %s at %s", job.getTitle(), job.getCompany());
        String summary = String.format("A structured plan to improve %s's candidacy for the %s role.",
                student.getName(), job.getTitle());

        return new AiActionPlan(title, summary, weeks, resources, 40);
    }
}
