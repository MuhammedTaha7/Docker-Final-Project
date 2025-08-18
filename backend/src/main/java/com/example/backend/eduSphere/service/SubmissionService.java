package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.response.CourseAnalyticsDTO;
import com.example.backend.eduSphere.dto.response.ChartDataPoint;
import com.example.backend.eduSphere.entity.Submission;

import java.util.List;

public interface SubmissionService {
    List<Submission> findSubmissionsByCourseId(String courseId);
    Submission createSubmission(Submission submission);
    List<Submission> findSubmissionsByStudentId(String studentId);
    CourseAnalyticsDTO getCourseAnalytics(String courseId, int year);
    List<ChartDataPoint> getAssignmentTimeline(String courseId, int year);
}