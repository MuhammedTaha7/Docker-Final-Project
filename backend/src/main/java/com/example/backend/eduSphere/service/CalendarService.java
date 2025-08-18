package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.dto.request.CalendarFilterDto;
import com.example.backend.eduSphere.dto.response.CalendarEventDto;
import com.example.backend.eduSphere.entity.Event;
import java.time.LocalDate;
import java.util.List;

public interface CalendarService {

    List<CalendarEventDto> getCalendarEventsForUser(LocalDate weekStartDate, CalendarFilterDto filters);

    Event createEvent(Event event);
    void deleteEvent(String eventId);
    Event getEventById(String eventId);
    Event updateEvent(String eventId, Event eventDetails);
}