package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.entity.Department;
import com.example.backend.eduSphere.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

public interface DepartmentService {
    List<Department> findAll();
    Department save(Department department);
}

