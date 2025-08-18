package com.example.backend.eduSphere.dto.request;

import lombok.Data;

@Data
public class ResponseFlagRequest {

    private String flagReason;

    private String flagPriority = "medium"; // low, medium, high

    private Boolean flaggedForReview = true;
}