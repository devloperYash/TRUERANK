package com.truerank.controller;

import com.truerank.model.MatchResult;
import com.truerank.service.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for the core matching API.
 * Returns ranked, explainable match results.
 */
@RestController
@RequestMapping("/api/matches")
@Tag(name = "Matches", description = "Explainable job matching engine")
public class MatchController {

    private final MatchingService matchingService;

    public MatchController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/{studentId}")
    @Operation(summary = "Get ranked matches for a student",
            description = "Returns all jobs ranked by match score with full explainability breakdown")
    public ResponseEntity<List<MatchResult>> getMatches(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok(matchingService.getMatchesForStudent(studentId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{studentId}/job/{jobId}")
    @Operation(summary = "Get match details for a specific student-job pair",
            description = "Returns detailed match result with score breakdown and improvement tips")
    public ResponseEntity<MatchResult> getMatchDetail(
            @PathVariable Long studentId,
            @PathVariable Long jobId) {
        try {
            return ResponseEntity.ok(matchingService.getMatchForStudentAndJob(studentId, jobId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{studentId}/compare")
    @Operation(summary = "Compare multiple jobs for a student",
            description = "Side-by-side comparison of match scores for selected jobs")
    public ResponseEntity<List<MatchResult>> compareJobs(
            @PathVariable Long studentId,
            @RequestParam List<Long> jobIds) {
        try {
            return ResponseEntity.ok(matchingService.compareJobs(studentId, jobIds));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
