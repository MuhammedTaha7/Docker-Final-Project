package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.response.LecturerStatsDto;
import com.example.backend.eduSphere.dto.response.StudentStatsDto;

public interface AnalyticsService {
    StudentStatsDto getStudentStats(String studentId);
    LecturerStatsDto getLecturerStats(String lecturerId);
}