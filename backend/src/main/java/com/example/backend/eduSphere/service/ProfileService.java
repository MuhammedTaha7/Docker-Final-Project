package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.response.LecturerProfileDto;
import com.example.backend.eduSphere.dto.response.StudentProfileDto;
import org.springframework.stereotype.Service;

@Service
public interface ProfileService {
    StudentProfileDto getStudentProfile(String id);
    LecturerProfileDto getLecturerProfile(String id);
}