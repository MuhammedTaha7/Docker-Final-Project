package com.example.backend.eduSphere.service.impl;

import com.example.backend.eduSphere.dto.request.AssignmentRequestDto;
import com.example.backend.eduSphere.dto.response.AssignmentResponseDto;
import com.example.backend.eduSphere.dto.response.DashboardChartsDto;
import com.example.backend.eduSphere.dto.response.DashboardDataResponseDto;
import com.example.backend.eduSphere.dto.response.DashboardStatsDto;
import com.example.backend.eduSphere.entity.Assignment;
import com.example.backend.eduSphere.entity.Course;
import com.example.backend.eduSphere.entity.UserEntity;
import com.example.backend.eduSphere.repository.AssignmentRepository;
import com.example.backend.eduSphere.repository.CourseRepository;
import com.example.backend.eduSphere.repository.UserRepository;
import com.example.backend.eduSphere.service.DashboardService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public DashboardServiceImpl(UserRepository userRepository, AssignmentRepository assignmentRepository, CourseRepository courseRepository) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public DashboardDataResponseDto getDashboardDataForRole(String userRole) {
        List<Course> allCourses = courseRepository.findAll();

        long activeUserCount = userRepository.count();
        Set<String> departments = allCourses.stream()
                .map(Course::getDepartment)
                .collect(Collectors.toSet());
        long activeDepartmentCount = departments.size();

        DashboardStatsDto statsDto = new DashboardStatsDto(activeUserCount, "System Optimal", activeDepartmentCount);
        DashboardChartsDto chartsDto = getChartData(allCourses);
        List<AssignmentResponseDto> assignments = getUpcomingAssignments();

        return new DashboardDataResponseDto(statsDto, chartsDto, assignments);
    }

    private DashboardChartsDto getChartData(List<Course> allCourses) {
        // --- Department Enrollment Chart Logic ---
        Map<String, Integer> enrollmentByDept = new HashMap<>();
        for (Course course : allCourses) {
            String department = course.getDepartment();

            // --- UPDATED LOGIC ---
            // Calculate total students by summing up enrollments from all years for the course.
            int studentCount = 0;
            if (course.getEnrollments() != null) {
                studentCount = course.getEnrollments().stream()
                        .mapToInt(enrollment -> enrollment.getStudentIds().size())
                        .sum();
            }
            // --- END OF UPDATED LOGIC ---

            enrollmentByDept.put(department, enrollmentByDept.getOrDefault(department, 0) + studentCount);
        }
        List<Map<String, Object>> departmentEnrollmentData = enrollmentByDept.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("name", entry.getKey());
                    dataPoint.put("value", entry.getValue());
                    return dataPoint;
                })
                .collect(Collectors.toList());

        // --- System Usage Pie Chart Logic ---
        long studentCount = userRepository.findByRole("1300").size();
        long lecturerCount = userRepository.findByRole("1200").size();
        long adminCount = userRepository.findByRole("1100").size();
        List<Map<String, Object>> systemUsageData = List.of(
                Map.of("name", "Students", "value", studentCount),
                Map.of("name", "Lecturers", "value", lecturerCount),
                Map.of("name", "Admins", "value", adminCount)
        );

        // --- Annual Enrollment Line Chart Logic ---
        List<UserEntity> allUsers = userRepository.findAll();
        Map<Integer, Long> usersByYear = allUsers.stream()
                .filter(user -> user.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        user -> user.getCreatedAt().getYear(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> annualEnrollmentData = usersByYear.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("name", String.valueOf(entry.getKey()));
                    dataPoint.put("value", entry.getValue());
                    return dataPoint;
                })
                .collect(Collectors.toList());

        return new DashboardChartsDto(departmentEnrollmentData, systemUsageData, annualEnrollmentData);
    }


    // --- Assignment-related methods (no changes) ---
    @Override
    public AssignmentResponseDto createAssignment(AssignmentRequestDto assignmentRequestDto) {
        // ... (implementation unchanged)
        Assignment newAssignment = new Assignment();
        mapToAssignmentEntity(newAssignment, assignmentRequestDto);
        Assignment savedAssignment = assignmentRepository.save(newAssignment);
        return mapToAssignmentResponseDto(savedAssignment);
    }

    @Override
    public AssignmentResponseDto updateAssignment(String id, AssignmentRequestDto assignmentRequestDto) {
        // ... (implementation unchanged)
        Assignment existingAssignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));
        mapToAssignmentEntity(existingAssignment, assignmentRequestDto);
        Assignment savedAssignment = assignmentRepository.save(existingAssignment);
        return mapToAssignmentResponseDto(savedAssignment);
    }

    @Override
    public void deleteAssignment(String id) {
        // ... (implementation unchanged)
        if (!assignmentRepository.existsById(id)) {
            throw new RuntimeException("Assignment not found with id: " + id);
        }
        assignmentRepository.deleteById(id);
    }

    private List<AssignmentResponseDto> getUpcomingAssignments() {
        // ... (implementation unchanged)
        List<Assignment> upcomingAssignments = assignmentRepository.findByDueDateAfter(LocalDate.now().minusDays(1));
        return upcomingAssignments.stream()
                .map(this::mapToAssignmentResponseDto)
                .collect(Collectors.toList());
    }

    private void mapToAssignmentEntity(Assignment assignment, AssignmentRequestDto requestDto) {
        // ... (implementation unchanged)
        if (requestDto.getTitle() != null) assignment.setTitle(requestDto.getTitle());
        if (requestDto.getDescription() != null) assignment.setDescription(requestDto.getDescription());
        if (requestDto.getCourse() != null) assignment.setCourse(requestDto.getCourse());
        if (requestDto.getType() != null) assignment.setType(requestDto.getType());
        if (requestDto.getDueDate() != null) assignment.setDueDate(requestDto.getDueDate());
        if (requestDto.getDueTime() != null) assignment.setDueTime(requestDto.getDueTime());
        assignment.setProgress(requestDto.getProgress());
        if (requestDto.getStatus() != null) assignment.setStatus(requestDto.getStatus());
        if (requestDto.getPriority() != null) assignment.setPriority(requestDto.getPriority());
        if (requestDto.getInstructorId() != null) assignment.setInstructorId(requestDto.getInstructorId());
        if (requestDto.getDifficulty() != null) assignment.setDifficulty(requestDto.getDifficulty());
        if (requestDto.getSemester() != null) assignment.setSemester(requestDto.getSemester());
        if (requestDto.getBadges() != null) assignment.setBadges(requestDto.getBadges());
    }

    private AssignmentResponseDto mapToAssignmentResponseDto(Assignment assignment) {
        // ... (implementation unchanged)
        return new AssignmentResponseDto(
                assignment.getId(),
                assignment.getTitle(),
                assignment.getType(),
                assignment.getDueDate(),
                assignment.getDescription(),
                assignment.getProgress(),
                assignment.getBadges()
        );
    }
}