package com.example.backend.eduSphere.repository;

import com.example.backend.eduSphere.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    // Find all events for a specific group of students
    List<Event> findByLearningGroupId(String learningGroupId);

    // Find all events for a specific instructor
    List<Event> findByInstructorId(String instructorId);
}