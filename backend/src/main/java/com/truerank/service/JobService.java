package com.truerank.service;

import com.truerank.model.Job;
import com.truerank.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Job CRUD and filtering operations.
 */
@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public List<Job> getJobsByType(String jobType) {
        return jobRepository.findByJobType(jobType);
    }

    public List<Job> getJobsByLocation(String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Job> getJobsBySkill(String skill) {
        return jobRepository.findByRequiredSkillContaining(skill);
    }

    public List<Job> getJobsByCompany(String company) {
        return jobRepository.findByCompanyContainingIgnoreCase(company);
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
