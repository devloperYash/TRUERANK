package com.truerank.service;

import com.truerank.model.*;
import com.truerank.repository.JobRepository;
import com.truerank.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the MatchingService algorithm.
 * Validates scoring logic, edge cases, and explainability output.
 */
@SpringBootTest
class MatchingServiceTest {

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    private Student testStudent;
    private Job perfectMatchJob;
    private Job partialMatchJob;
    private Job noMatchJob;

    @BeforeEach
    void setUp() {
        // Clear seeded data for controlled tests
        studentRepository.deleteAll();
        jobRepository.deleteAll();

        // Create test student
        testStudent = new Student(
                "Test User", "test@test.edu",
                "Test University", "Computer Science",
                3.7, 2025,
                "Java,Python,Angular,Spring Boot,SQL",
                "Java,Angular",
                "US_CITIZEN"
        );
        testStudent = studentRepository.save(testStudent);

        // Perfect match job
        perfectMatchJob = new Job(
                "Software Engineer", "TestCorp", "Remote", "FULL_TIME",
                "Java,Python,Angular,Spring Boot,SQL",
                "Docker,Git",
                3.5, "ANY", true,
                "Perfect match test job", "$100,000"
        );
        perfectMatchJob = jobRepository.save(perfectMatchJob);

        // Partial match job
        partialMatchJob = new Job(
                "ML Engineer", "DataCorp", "NYC", "FULL_TIME",
                "Python,TensorFlow,PyTorch,Machine Learning",
                "Spark,Scala",
                3.8, "US_CITIZEN", false,
                "Partial match test job", "$120,000"
        );
        partialMatchJob = jobRepository.save(partialMatchJob);

        // No match job
        noMatchJob = new Job(
                "iOS Developer", "AppleCorp", "Cupertino", "FULL_TIME",
                "Swift,Objective-C,iOS,Xcode",
                "SwiftUI,CoreData",
                3.9, "US_CITIZEN", false,
                "No match test job", "$130,000"
        );
        noMatchJob = jobRepository.save(noMatchJob);
    }

    @Test
    @DisplayName("Perfect skill match should score 100 on skills")
    void testPerfectSkillMatch() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), perfectMatchJob.getId());

        assertEquals(100.0, result.getSkillScore(), 1.0);
        assertTrue(result.getBreakdown().getMissingSkills().isEmpty());
        assertFalse(result.getBreakdown().getSkillExplanation().isEmpty());
    }

    @Test
    @DisplayName("Total score should be weighted sum of dimensions")
    void testWeightedScoring() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), perfectMatchJob.getId());

        double expected = (result.getSkillScore() * 0.40)
                        + (result.getGpaScore() * 0.30)
                        + (result.getAuthScore() * 0.30);

        assertEquals(expected, result.getTotalScore(), 1.0);
    }

    @Test
    @DisplayName("GPA above requirement should score 100")
    void testGpaAboveRequirement() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), perfectMatchJob.getId());

        assertEquals(100.0, result.getGpaScore(), 0.1);
        assertTrue(result.getBreakdown().getGpaDelta() > 0);
    }

    @Test
    @DisplayName("GPA below requirement should score < 100")
    void testGpaBelowRequirement() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), partialMatchJob.getId());

        assertTrue(result.getGpaScore() < 100.0);
        assertTrue(result.getBreakdown().getGpaDelta() < 0);
    }

    @Test
    @DisplayName("US Citizen should score high on any auth requirement")
    void testUsCitizenAuth() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), perfectMatchJob.getId());

        assertTrue(result.getAuthScore() >= 95.0);
    }

    @Test
    @DisplayName("Partial skill match should have missing skills listed")
    void testPartialSkillMatch() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), partialMatchJob.getId());

        assertFalse(result.getBreakdown().getMissingSkills().isEmpty());
        assertTrue(result.getSkillScore() > 0);
        assertTrue(result.getSkillScore() < 100);
    }

    @Test
    @DisplayName("No skill overlap should score very low on skills")
    void testNoSkillMatch() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), noMatchJob.getId());

        assertTrue(result.getSkillScore() < 20.0);
        assertEquals(4, result.getBreakdown().getMissingSkills().size());
    }

    @Test
    @DisplayName("Matches should be returned sorted by total score descending")
    void testMatchesSortedByScore() {
        List<MatchResult> results = matchingService.getMatchesForStudent(testStudent.getId());

        for (int i = 1; i < results.size(); i++) {
            assertTrue(results.get(i - 1).getTotalScore() >= results.get(i).getTotalScore());
        }
    }

    @Test
    @DisplayName("Ranks should be assigned 1, 2, 3...")
    void testRankAssignment() {
        List<MatchResult> results = matchingService.getMatchesForStudent(testStudent.getId());

        for (int i = 0; i < results.size(); i++) {
            assertEquals(i + 1, results.get(i).getRank());
        }
    }

    @Test
    @DisplayName("Every result should have a match summary")
    void testMatchSummaryGenerated() {
        List<MatchResult> results = matchingService.getMatchesForStudent(testStudent.getId());

        for (MatchResult result : results) {
            assertNotNull(result.getMatchSummary());
            assertFalse(result.getMatchSummary().isEmpty());
        }
    }

    @Test
    @DisplayName("Every result should have a confidence level")
    void testConfidenceLevel() {
        List<MatchResult> results = matchingService.getMatchesForStudent(testStudent.getId());

        for (MatchResult result : results) {
            assertTrue(List.of("HIGH", "MEDIUM", "LOW").contains(result.getConfidence()));
        }
    }

    @Test
    @DisplayName("Score tier should reflect total score ranges")
    void testScoreTier() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), perfectMatchJob.getId());

        String tier = result.getScoreTier();
        if (result.getTotalScore() >= 80) assertEquals("EXCELLENT", tier);
        else if (result.getTotalScore() >= 60) assertEquals("GOOD", tier);
        else if (result.getTotalScore() >= 40) assertEquals("FAIR", tier);
        else assertEquals("LOW", tier);
    }

    @Test
    @DisplayName("Compare should return results for specified job IDs")
    void testCompareJobs() {
        List<MatchResult> results = matchingService.compareJobs(
                testStudent.getId(),
                Arrays.asList(perfectMatchJob.getId(), partialMatchJob.getId()));

        assertEquals(2, results.size());
    }

    @Test
    @DisplayName("Improvement tips should be generated for non-perfect matches")
    void testImprovementTips() {
        MatchResult result = matchingService.getMatchForStudentAndJob(
                testStudent.getId(), partialMatchJob.getId());

        assertNotNull(result.getBreakdown().getImprovementTips());
        assertFalse(result.getBreakdown().getImprovementTips().isEmpty());
    }
}
