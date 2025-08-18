package com.example.backend.eduSphere.repository;

import com.example.backend.eduSphere.entity.LecturerResource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecturerResourceRepository extends MongoRepository<LecturerResource, String> {
    List<LecturerResource> findByLecturerId(String lecturerId);
}