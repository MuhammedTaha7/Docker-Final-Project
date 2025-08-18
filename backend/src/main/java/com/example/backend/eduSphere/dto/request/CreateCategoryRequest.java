package com.example.backend.eduSphere.dto.request;

import lombok.Data;

@Data
public class CreateCategoryRequest {
    private String name;
    private String description;
    private String color;
    private String year;
}