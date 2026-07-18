package com.truerank.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Job entity — represents a job/internship posting with required skills,
 * GPA thresholds, and work authorization requirements.
 */
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Company is required")
    @Column(nullable = false)
    private String company;

    private String companyLogoUrl;

    @NotBlank
    private String location;

    /**
     * Job type: INTERNSHIP, FULL_TIME, PART_TIME, CO_OP
     */
    @NotBlank
    private String jobType;

    /** Comma-separated required skills */
    @Column(length = 2000, nullable = false)
    private String requiredSkills;

    /** Comma-separated preferred/nice-to-have skills */
    @Column(length = 2000)
    private String preferredSkills;

    @DecimalMin("0.0") @DecimalMax("4.0")
    private Double minGpa;

    /**
     * Work authorization requirement:
     * US_CITIZEN, PERMANENT_RESIDENT, ANY, F1_OPT_ELIGIBLE
     */
    @NotBlank
    private String workAuthRequired;

    /** Whether the employer offers visa sponsorship */
    private Boolean sponsorshipAvailable;

    @Column(length = 5000)
    private String description;

    private String salary;

    private LocalDate postedDate;

    private LocalDate deadline;

    /**
     * Work mode: REMOTE, ONSITE, HYBRID
     */
    private String workMode;

    /** Number of openings */
    private Integer openings;

    // ===== Constructors =====
    public Job() {}

    public Job(String title, String company, String location, String jobType,
               String requiredSkills, String preferredSkills, Double minGpa,
               String workAuthRequired, Boolean sponsorshipAvailable,
               String description, String salary) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.jobType = jobType;
        this.requiredSkills = requiredSkills;
        this.preferredSkills = preferredSkills;
        this.minGpa = minGpa;
        this.workAuthRequired = workAuthRequired;
        this.sponsorshipAvailable = sponsorshipAvailable;
        this.description = description;
        this.salary = salary;
        this.postedDate = LocalDate.now();
    }

    // ===== Helper Methods =====

    public List<String> getRequiredSkillList() {
        if (requiredSkills == null || requiredSkills.isBlank()) return Collections.emptyList();
        return Arrays.stream(requiredSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public List<String> getPreferredSkillList() {
        if (preferredSkills == null || preferredSkills.isBlank()) return Collections.emptyList();
        return Arrays.stream(preferredSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    // ===== Getters & Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public Double getMinGpa() { return minGpa; }
    public void setMinGpa(Double minGpa) { this.minGpa = minGpa; }

    public String getWorkAuthRequired() { return workAuthRequired; }
    public void setWorkAuthRequired(String workAuthRequired) { this.workAuthRequired = workAuthRequired; }

    public Boolean getSponsorshipAvailable() { return sponsorshipAvailable; }
    public void setSponsorshipAvailable(Boolean sponsorshipAvailable) { this.sponsorshipAvailable = sponsorshipAvailable; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public LocalDate getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDate postedDate) { this.postedDate = postedDate; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }
}
