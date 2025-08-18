package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.request.GenerateReportRequest;
import com.example.backend.eduSphere.dto.response.GenerateReportResponse;
import com.example.backend.eduSphere.entity.Report;

import java.util.List;
import java.util.Map;

public interface ReportService {
    GenerateReportResponse generateReport(GenerateReportRequest request);
    List<Report> getRecentReports();
    void deleteReport(String id);
    List<Map<String, Object>> getReportData(String id);
}