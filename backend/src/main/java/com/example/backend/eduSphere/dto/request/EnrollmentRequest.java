package com.example.backend.eduSphere.dto.request;

import lombok.Data;

@Data
public class EnrollmentRequest {
    private String studentId;
    private int academicYear;
    private String learningGroup;
    private String graduationYear;
    private String yearGroup;
    private String status;
    private String enrollmentNotes;
}