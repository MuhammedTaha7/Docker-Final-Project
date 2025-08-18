package com.example.backend.eduSphere.repository;

import com.example.backend.eduSphere.entity.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {
    // Standard CRUD methods are inherited
}
