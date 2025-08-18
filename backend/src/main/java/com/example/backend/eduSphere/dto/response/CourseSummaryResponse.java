package com.example.backend.eduSphere.dto.response;

import com.example.backend.eduSphere.entity.YearlyEnrollment;
import lombok.Data;
import java.util.List;

@Data
public class CourseSummaryResponse {
    private String id;
    private String name;
    private String code;
    private String imageUrl;
    private String department;
    private String lecturerName;
    private int credits;
    private String academicYear;
    private String semester;
    private Integer year;
    private Boolean selectable;
    private List<YearlyEnrollment> enrollments;
}