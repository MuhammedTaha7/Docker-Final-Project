package com.example.backend.eduSphere.controller;

import com.example.backend.eduSphere.dto.response.CourseAnalyticsDTO;
import com.example.backend.eduSphere.dto.response.ChartDataPoint;
import com.example.backend.eduSphere.service.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AnalyticsController {

    private final SubmissionService submissionService;

    public AnalyticsController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    /**
     * GET /api/analytics/course/{courseId} : Get analytics for a specific course.
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<CourseAnalyticsDTO> getCourseAnalytics(
            @PathVariable String courseId,
            @RequestParam int year
    ) {
        CourseAnalyticsDTO analytics = submissionService.getCourseAnalytics(courseId, year);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/assignment-timeline/{courseId}")
    public ResponseEntity<List<ChartDataPoint>> getAssignmentTimeline(
            @PathVariable String courseId,
            @RequestParam int year
    ) {
        List<ChartDataPoint> timelineData = submissionService.getAssignmentTimeline(courseId, year);
        return ResponseEntity.ok(timelineData);
    }

}