package com.example.backend.eduSphere.service.impl;

import com.example.backend.eduSphere.dto.response.LecturerProfileDto;
import com.example.backend.eduSphere.dto.response.StudentProfileDto;
import com.example.backend.eduSphere.entity.UserEntity;
import com.example.backend.eduSphere.repository.UserRepository;
import com.example.backend.eduSphere.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    @Override
    public StudentProfileDto getStudentProfile(String id) {
        UserEntity student = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found with ID: " + id));

        if (!"1300".equals(student.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a student");
        }

        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setProfilePic(student.getProfilePic());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setAcademicYear(student.getAcademicYear());
        dto.setDepartment(student.getDepartment());
        dto.setStatus(student.getStatus());

        // GPA is a calculated field, it should be fetched from a service or calculated here
        // For now, we set it to null or a default value.
        // In a real application, you'd call a method like:
        // dto.setGpa(gradeService.calculateGpa(id));
        dto.setGpa(null);

        return dto;
    }

    @Override
    public LecturerProfileDto getLecturerProfile(String id) {
        UserEntity lecturer = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecturer not found with ID: " + id));

        if (!"1200".equals(lecturer.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a lecturer");
        }

        LecturerProfileDto dto = new LecturerProfileDto();
        dto.setId(lecturer.getId());
        dto.setName(lecturer.getName());
        dto.setEmail(lecturer.getEmail());
        dto.setPhoneNumber(lecturer.getPhoneNumber());
        dto.setProfilePic(lecturer.getProfilePic());
        dto.setDateOfBirth(lecturer.getDateOfBirth());
        dto.setDepartment(lecturer.getDepartment());
        dto.setSpecialization(lecturer.getSpecialization());
        dto.setEmploymentType(lecturer.getEmploymentType());
        dto.setExperience(lecturer.getExperience());

        // Rating and activeCourses are calculated fields, they should be fetched or calculated.
        // In a real application, you'd call methods like:
        // dto.setRating(courseService.calculateAverageRating(id));
        // dto.setActiveCourses(courseService.countActiveCourses(id));
        dto.setRating(lecturer.getRating());
        dto.setActiveCourses(null); // Set to null for now, until we implement the Course logic

        return dto;
    }
}