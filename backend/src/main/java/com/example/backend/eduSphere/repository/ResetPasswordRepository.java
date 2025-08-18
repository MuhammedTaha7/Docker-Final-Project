package com.example.backend.eduSphere.repository;

import com.example.backend.eduSphere.entity.ResetPasswordEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ResetPasswordRepository extends MongoRepository<ResetPasswordEntity, String> {
    Optional<ResetPasswordEntity> findByEmail(String email);
    Optional<ResetPasswordEntity> findByToken(String token);

    void deleteAllByEmail(String email);
}
