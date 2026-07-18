package com.truerank.controller;

import com.truerank.model.Job;
import com.truerank.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Job/Internship posting operations.
 */
@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Job and internship posting management")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Get all job postings")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job by ID")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter jobs by type, location, skill, or company")
    public ResponseEntity<List<Job>> filterJobs(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String company) {

        if (type != null) return ResponseEntity.ok(jobService.getJobsByType(type));
        if (location != null) return ResponseEntity.ok(jobService.getJobsByLocation(location));
        if (skill != null) return ResponseEntity.ok(jobService.getJobsBySkill(skill));
        if (company != null) return ResponseEntity.ok(jobService.getJobsByCompany(company));

        return ResponseEntity.ok(jobService.getAllJobs());
    }
}
