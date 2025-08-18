package com.example.backend.eduSphere.controller;

import com.example.backend.eduSphere.dto.response.LecturerStatsDto;
import com.example.backend.eduSphere.dto.response.StudentStatsDto;
import com.example.backend.eduSphere.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/profile-analytics") // New and distinct base path
@RequiredArgsConstructor
public class ProfileAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{entityType}/{id}/stats")
    @PreAuthorize("hasRole('ADMIN') or #entityType.equals('student') and #id.equals(authentication.name) or #entityType.equals('lecturer') and #id.equals(authentication.name)")
    public ResponseEntity<?> getStats(@PathVariable String entityType, @PathVariable String id) {
        if ("student".equalsIgnoreCase(entityType)) {
            StudentStatsDto stats = analyticsService.getStudentStats(id);
            return ResponseEntity.ok(stats);
        } else if ("lecturer".equalsIgnoreCase(entityType)) {
            LecturerStatsDto stats = analyticsService.getLecturerStats(id);
            return ResponseEntity.ok(stats);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid entity type provided.");
        }
    }
}