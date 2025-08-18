package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.request.ScheduleRequestDto;
import com.example.backend.eduSphere.dto.response.ScheduleResponseDto;

import java.util.List;

public interface ScheduleService {
    List<ScheduleResponseDto> getLecturerSchedule(String lecturerId);
    ScheduleResponseDto addScheduleEntry(ScheduleRequestDto scheduleDto);
    ScheduleResponseDto updateScheduleEntry(String id, ScheduleRequestDto scheduleDto);
    void deleteScheduleEntry(String id);
}