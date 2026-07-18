package com.truerank.repository;

import com.truerank.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA Repository for Job entities with custom filter queries.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByJobType(String jobType);

    List<Job> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT j FROM Job j WHERE LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<Job> findByRequiredSkillContaining(@Param("skill") String skill);

    @Query("SELECT j FROM Job j WHERE j.jobType = :jobType AND j.minGpa <= :gpa")
    List<Job> findByJobTypeAndMinGpaLessThanEqual(
            @Param("jobType") String jobType,
            @Param("gpa") Double gpa);

    List<Job> findByCompanyContainingIgnoreCase(String company);
}
