package com.example.backend.eduSphere.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class UnenrollmentRequest {
    private List<String> studentIds;
}