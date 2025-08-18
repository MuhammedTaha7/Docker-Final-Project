package com.example.backend.eduSphere.repository;

import com.example.backend.eduSphere.entity.StudentRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRequestRepository extends MongoRepository<StudentRequest, String> {
    List<StudentRequest> findByReceiverId(String receiverId);
}