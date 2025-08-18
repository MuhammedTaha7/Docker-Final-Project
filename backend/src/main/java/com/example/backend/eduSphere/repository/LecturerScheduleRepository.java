package com.example.backend.eduSphere.repository;

import com.example.backend.eduSphere.entity.LecturerSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecturerScheduleRepository extends MongoRepository<LecturerSchedule, String> {
    List<LecturerSchedule> findByLecturerId(String lecturerId);
}