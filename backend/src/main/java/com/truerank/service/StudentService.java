package com.truerank.service;

import com.truerank.model.Student;
import com.truerank.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Student CRUD operations and profile management.
 */
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        return studentRepository.findById(id)
                .map(student -> {
                    if (updatedStudent.getName() != null) student.setName(updatedStudent.getName());
                    if (updatedStudent.getEmail() != null) student.setEmail(updatedStudent.getEmail());
                    if (updatedStudent.getUniversity() != null) student.setUniversity(updatedStudent.getUniversity());
                    if (updatedStudent.getMajor() != null) student.setMajor(updatedStudent.getMajor());
                    if (updatedStudent.getGpa() != null) student.setGpa(updatedStudent.getGpa());
                    if (updatedStudent.getGraduationYear() != null) student.setGraduationYear(updatedStudent.getGraduationYear());
                    if (updatedStudent.getSkills() != null) student.setSkills(updatedStudent.getSkills());
                    if (updatedStudent.getStrongSkills() != null) student.setStrongSkills(updatedStudent.getStrongSkills());
                    if (updatedStudent.getWorkAuthorization() != null) student.setWorkAuthorization(updatedStudent.getWorkAuthorization());
                    if (updatedStudent.getProfileImageUrl() != null) student.setProfileImageUrl(updatedStudent.getProfileImageUrl());
                    if (updatedStudent.getResumeUrl() != null) student.setResumeUrl(updatedStudent.getResumeUrl());
                    if (updatedStudent.getBio() != null) student.setBio(updatedStudent.getBio());
                    return studentRepository.save(student);
                })
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Student applyForJob(Long studentId, Long jobId) {
        return studentRepository.findById(studentId).map(student -> {
            student.getAppliedJobIds().add(jobId);
            return studentRepository.save(student);
        }).orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
    }
}
