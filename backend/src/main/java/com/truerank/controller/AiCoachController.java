package com.truerank.controller;

import com.truerank.model.*;
import com.truerank.repository.JobRepository;
import com.truerank.repository.StudentRepository;
import com.truerank.service.GeminiService;
import com.truerank.service.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AiCoachController — REST endpoints for the AI Career Coach feature.
 * Uses Gemini AI to generate personalized career tips and action plans.
 */
@RestController
@RequestMapping("/api/ai-coach")
@Tag(name = "AI Coach", description = "Gemini AI-powered career coaching and action plan generation")
public class AiCoachController {

    private final GeminiService geminiService;
    private final MatchingService matchingService;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public AiCoachController(GeminiService geminiService, MatchingService matchingService,
                              StudentRepository studentRepository, JobRepository jobRepository) {
        this.geminiService = geminiService;
        this.matchingService = matchingService;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    @GetMapping("/{studentId}/job/{jobId}/tips")
    @Operation(summary = "Get AI-generated career tips",
            description = "Returns personalized career tips from Gemini AI based on student-job match analysis")
    public ResponseEntity<AiTipsResponse> getAiTips(
            @PathVariable Long studentId,
            @PathVariable Long jobId) {
        try {
            MatchResult matchResult = matchingService.getMatchForStudentAndJob(studentId, jobId);
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

            AiTipsResponse tips = geminiService.generateCareerTips(student, job, matchResult);
            return ResponseEntity.ok(tips);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{studentId}/job/{jobId}/plan")
    @Operation(summary = "Generate AI action plan",
            description = "Creates a structured 4-week action plan using Gemini AI")
    public ResponseEntity<AiActionPlan> generatePlan(
            @PathVariable Long studentId,
            @PathVariable Long jobId) {
        try {
            MatchResult matchResult = matchingService.getMatchForStudentAndJob(studentId, jobId);
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

            AiActionPlan plan = geminiService.generateActionPlan(student, job, matchResult);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
