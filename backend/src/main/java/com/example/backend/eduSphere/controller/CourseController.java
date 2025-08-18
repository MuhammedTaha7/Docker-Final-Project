package com.example.backend.eduSphere.controller;

import com.example.backend.eduSphere.dto.request.CourseRequestDto;
import com.example.backend.eduSphere.dto.request.EnrollmentRequest;
import com.example.backend.eduSphere.dto.request.EnrollmentRequestDto;
import com.example.backend.eduSphere.dto.request.UnenrollmentRequest;
import com.example.backend.eduSphere.dto.response.CourseDetailsResponse;
import com.example.backend.eduSphere.dto.response.CourseResponseDto;
import com.example.backend.eduSphere.dto.response.CourseSummaryResponse;
import com.example.backend.eduSphere.dto.response.EnrollmentResponseDto;
import com.example.backend.eduSphere.entity.Course;
import com.example.backend.eduSphere.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing Courses.
 * This class exposes a set of API endpoints for performing CRUD operations on courses.
 */
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /**
     * GET /api/courses : Gets a list of courses based on the logged-in user's role.
     */
    @GetMapping
    public List<CourseSummaryResponse> getAllCourses(@AuthenticationPrincipal UserDetails userDetails) {
        return courseService.findAllCoursesForUser(userDetails);
    }

    /**
     * GET /api/courses/{id} : Get a single course by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailsResponse> getCourseById(@PathVariable String id) {
        try {
            CourseDetailsResponse courseDetails = courseService.findCourseDetailsById(id);
            return ResponseEntity.ok(courseDetails);
        } catch (RuntimeException e) {
            // This will catch the "Course not found" exception from the service
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/courses : Create a new course.
     */
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    /**
     * PUT /api/courses/{id} : Update an existing course.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(id, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/courses/{id} : Delete a course by its ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * --- UPDATED ENDPOINT ---
     * POST /{courseId}/enroll : Enroll a student into a course for a specific year.
     * The request body now contains all enrollment details.
     */
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Course> enrollStudent(@PathVariable String courseId, @RequestBody EnrollmentRequest enrollmentRequest) {
        try {
            Course updatedCourse = courseService.enrollStudent(courseId, enrollmentRequest);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/courses/{courseId}/enrollments : Unenroll one or more students from a course.
     */
    @DeleteMapping("/{courseId}/enrollments")
    public ResponseEntity<Course> unenrollStudents(
            @PathVariable String courseId,
            @RequestBody UnenrollmentRequest request) {
        try {
            if (request == null || request.getStudentIds() == null || request.getStudentIds().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Course updatedCourse = courseService.unenrollStudents(courseId, request.getStudentIds());
            return ResponseEntity.ok(updatedCourse);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping("/enrollments/by-student/{studentId}")
//    public ResponseEntity<List<EnrollmentResponseDto>> getStudentEnrollments(@PathVariable String studentId) {
//        List<EnrollmentResponseDto> enrollments = courseService.getStudentEnrollments(studentId);
//        return ResponseEntity.ok(enrollments);
//    }

    @GetMapping("/student-enrollments/{studentId}")
    public ResponseEntity<List<EnrollmentResponseDto>> getStudentEnrollments(@PathVariable String studentId) {
        List<EnrollmentResponseDto> enrollments = courseService.getStudentEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }


    /**
     * POST /api/enrollments : Add a new student enrollment
     */
    @PostMapping("/enrollments")
    public ResponseEntity<EnrollmentResponseDto> addStudentEnrollment(@RequestBody EnrollmentRequestDto enrollmentDto) {
        EnrollmentResponseDto newEnrollment = courseService.addStudentEnrollment(enrollmentDto);
        return new ResponseEntity<>(newEnrollment, HttpStatus.CREATED);
    }

    /**
     * PUT /api/enrollments/{courseId} : Update an existing student enrollment status
     * We use `courseId` as the identifier for the enrollment since it's nested.
     */
    @PutMapping("/enrollments/{courseId}")
    public ResponseEntity<EnrollmentResponseDto> updateStudentEnrollment(@PathVariable String courseId, @RequestBody EnrollmentRequestDto enrollmentDto) {
        EnrollmentResponseDto updatedEnrollment = courseService.updateStudentEnrollment(courseId, enrollmentDto);
        return ResponseEntity.ok(updatedEnrollment);
    }

    // ------------------------------------------
    // NEW: Endpoints for Lecturer Profile Courses
    // ------------------------------------------

    /**
     * GET /api/courses/by-lecturer/{lecturerId} : Get all courses for a specific lecturer.
     */
    @GetMapping("/by-lecturer/{lecturerId}")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    public ResponseEntity<List<CourseResponseDto>> getCoursesByLecturer(@PathVariable String lecturerId) {
        List<CourseResponseDto> courses = courseService.getLecturerCourses(lecturerId);
        return ResponseEntity.ok(courses);
    }

    /**
     * POST /api/courses/assign : Assign an existing course to a lecturer.
     */
    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDto> assignCourseToLecturer(@RequestBody CourseRequestDto courseDto) {
        CourseResponseDto assignedCourse = courseService.assignCourseToLecturer(courseDto);
        return new ResponseEntity<>(assignedCourse, HttpStatus.CREATED);
    }

    /**
     * PUT /api/courses/{courseId} : Update an existing course's details.
     */
    @PutMapping("/{courseId}/lecturer")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDto> updateLecturerCourse(@PathVariable String courseId, @RequestBody CourseRequestDto courseDto) {
        CourseResponseDto updatedCourse = courseService.updateLecturerCourse(courseId, courseDto);
        return ResponseEntity.ok(updatedCourse);
    }

    /**
     * DELETE /api/courses/unassign/{courseId}/{lecturerId} : Unassign a course from a lecturer.
     */
    @DeleteMapping("/unassign/{courseId}/{lecturerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unassignCourseFromLecturer(@PathVariable String courseId, @PathVariable String lecturerId) {
        courseService.unassignCourseFromLecturer(courseId, lecturerId);
        return ResponseEntity.noContent().build();
    }
}