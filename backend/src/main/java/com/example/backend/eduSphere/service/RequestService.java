package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.request.RequestRequestDto;
import com.example.backend.eduSphere.dto.response.RequestResponseDto;

import java.util.List;

public interface RequestService {
    List<RequestResponseDto> getRequestsByLecturerId(String lecturerId);
    RequestResponseDto createRequest(RequestRequestDto requestDto);
    RequestResponseDto updateRequestStatus(String requestId, String status);
    RequestResponseDto submitResponse(String requestId, String response);
}