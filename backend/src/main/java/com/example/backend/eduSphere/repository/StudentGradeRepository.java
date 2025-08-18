package com.example.backend.eduSphere.repository;

import com.example.backend.eduSphere.entity.StudentGrade;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentGradeRepository extends MongoRepository<StudentGrade, String> {

    /**
     * Find a single student grade record by student ID and course ID
     * Uses findFirst to handle potential duplicates gracefully
     */
    Optional<StudentGrade> findFirstByStudentIdAndCourseIdOrderByUpdatedAtDesc(String studentId, String courseId);

    /**
     * Find all grades for a course
     */
    List<StudentGrade> findByCourseId(String courseId);

    /**
     * Find all grades for a student
     */
    List<StudentGrade> findByStudentId(String studentId);

    /**
     * Delete grades by student and course
     */
    void deleteByStudentIdAndCourseId(String studentId, String courseId);

    /**
     * Check if a grade record exists
     */
    boolean existsByStudentIdAndCourseId(String studentId, String courseId);

    /**
     * Find duplicate records (for cleanup)
     */
    @Query("{ 'studentId': ?0, 'courseId': ?1 }")
    List<StudentGrade> findAllByStudentIdAndCourseId(String studentId, String courseId);
}