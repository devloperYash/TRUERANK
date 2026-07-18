package com.truerank.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Student entity — represents a student profile with skills, GPA,
 * and work authorization data used for job matching.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Email(message = "Valid email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "University is required")
    private String university;

    @NotBlank(message = "Major is required")
    private String major;

    @DecimalMin(value = "0.0") @DecimalMax(value = "4.0")
    @Column(nullable = false)
    private Double gpa;

    @Min(2020) @Max(2030)
    private Integer graduationYear;

    /** Comma-separated list of skills (e.g., "Java,Spring Boot,Angular") */
    @Column(length = 2000)
    private String skills;

    /** Comma-separated list of preferred/strong skills */
    @Column(length = 2000)
    private String strongSkills;

    /**
     * Work authorization type:
     * US_CITIZEN, PERMANENT_RESIDENT, F1_OPT, F1_CPT, H1B, OTHER
     */
    @NotBlank
    private String workAuthorization;

    private String profileImageUrl;

    /** URL to uploaded resume (PDF) */
    private String resumeUrl;

    @Column(length = 1000)
    private String bio;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_applications", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "job_id")
    private Set<Long> appliedJobIds = new HashSet<>();

    // ===== Constructors =====
    public Student() {}

    public Student(String name, String email, String university, String major,
                   Double gpa, Integer graduationYear, String skills,
                   String strongSkills, String workAuthorization) {
        this.name = name;
        this.email = email;
        this.university = university;
        this.major = major;
        this.gpa = gpa;
        this.graduationYear = graduationYear;
        this.skills = skills;
        this.strongSkills = strongSkills;
        this.workAuthorization = workAuthorization;
    }

    // ===== Helper Methods =====

    /** Returns skills as a list */
    public List<String> getSkillList() {
        if (skills == null || skills.isBlank()) return Collections.emptyList();
        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    /** Returns strong skills as a list */
    public List<String> getStrongSkillList() {
        if (strongSkills == null || strongSkills.isBlank()) return Collections.emptyList();
        return Arrays.stream(strongSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    /** Calculates profile completeness (0.0 - 1.0) */
    public double getProfileCompleteness() {
        int filled = 0;
        int total = 8;
        if (name != null && !name.isBlank()) filled++;
        if (email != null && !email.isBlank()) filled++;
        if (university != null && !university.isBlank()) filled++;
        if (major != null && !major.isBlank()) filled++;
        if (gpa != null) filled++;
        if (skills != null && !skills.isBlank()) filled++;
        if (workAuthorization != null && !workAuthorization.isBlank()) filled++;
        if (bio != null && !bio.isBlank()) filled++;
        return (double) filled / total;
    }

    // ===== Getters & Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }

    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getStrongSkills() { return strongSkills; }
    public void setStrongSkills(String strongSkills) { this.strongSkills = strongSkills; }

    public String getWorkAuthorization() { return workAuthorization; }
    public void setWorkAuthorization(String workAuthorization) { this.workAuthorization = workAuthorization; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Set<Long> getAppliedJobIds() { return appliedJobIds; }
    public void setAppliedJobIds(Set<Long> appliedJobIds) { this.appliedJobIds = appliedJobIds; }
}
