package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.request.AdminCreateUserRequest;
import com.example.backend.eduSphere.dto.request.LoginRequest;
import com.example.backend.eduSphere.dto.request.RegisterRequest;
import com.example.backend.eduSphere.dto.response.LecturerProfileDto;
import com.example.backend.eduSphere.dto.response.LoginResponse;
import com.example.backend.eduSphere.dto.response.StudentProfileDto;
import com.example.backend.eduSphere.entity.UserEntity;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {
    LoginResponse authenticateUser(@NonNull LoginRequest loginRequest);
    void registerUser(@NonNull RegisterRequest registerRequest);

    String getUserIdByEmail(@NonNull String email);

    UserEntity getUserByEmail(String email);

    UserEntity getUserById(String userId);

    List<UserEntity> findUsersByRole(String role);

    List<UserEntity> findUsersByIds(List<String> userIds);

    UserEntity createAdminUser(AdminCreateUserRequest request);

    UserEntity updateUser(String userId, AdminCreateUserRequest request);

    UserEntity getUserByUsername(String username);

    UserEntity findByUsername(String authName);
}