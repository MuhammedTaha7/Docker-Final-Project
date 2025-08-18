import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { 
    getCalendarEvents,
    addAssignment, 
    updateAssignment, 
    deleteAssignment,
    addEvent,
    deleteEvent,
    getEventRuleById,
    updateEvent,
    getAllLecturers,
    getAllCourses
} from "../Api/calendarPageApi.js";

const useCalendarDashboard = () => {
    const { authData } = useAuth();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the pop-up form
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState("add");
    const [editingItem, setEditingItem] = useState(null);
    const [popupType, setPopupType] = useState('assignment');

    // State for filter dropdown data
    const [lecturers, setLecturers] = useState([]);
    const [courses, setCourses] = useState([]);

    // State to hold the user's selected filter values
    const [filters, setFilters] = useState({});

    // This hook fetches all necessary data and re-runs when the date, filters, or user changes.
    useEffect(() => {
        // Don't fetch data until we know who the user is
        if (!authData) {
            setIsLoading(false);
            return;
        }

        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [eventsData, lecturersData, coursesData] = await Promise.all([
                    getCalendarEvents(currentDate, filters),
                    getAllLecturers(),
                    getAllCourses()
                ]);
                
                setAssignments(eventsData);
                setLecturers(lecturersData);
                setCourses(coursesData);
                setError(null);
            } catch (err) {
                setError("Failed to fetch calendar data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [currentDate, filters, authData]);

    const openAddPopup = (type = 'assignment') => {
        setPopupMode("add");
        setPopupType(type); 
        setEditingItem(null);
        setPopupOpen(true);
    };

    const openEditPopup = async (item) => {
        setPopupMode("edit");
        if (item.id.includes('_')) { // It's a recurring event
            const ruleId = item.id.split('_')[0];
            setPopupType('event');
            try {
                const eventRule = await getEventRuleById(ruleId);
                setEditingItem(eventRule);
                setPopupOpen(true);
            } catch (err) {
                console.error("Could not fetch event rule for editing", err);
            }
        } else { // It's an assignment
            setPopupType('assignment');
            setEditingItem(item);
            setPopupOpen(true);
        }
    };

    const closePopup = () => setPopupOpen(false);

    const handleFormSubmit = async (data) => {
        try {
            if (popupMode === "add") {
                if (popupType === 'assignment') {
                    await addAssignment(data);
                } else {
                    const eventData = { ...data, dayOfWeek: data.dayOfWeek.toUpperCase() };
                    await addEvent(eventData);
                }
            } else {
                if (popupType === 'assignment') {
                    await updateAssignment(editingItem.id, data);
                } else {
                    await updateEvent(editingItem.id, data);
                }
            }
            // Refetch data to show changes
            const updatedData = await getCalendarEvents(currentDate, filters);
            setAssignments(updatedData);
            closePopup();
        } catch (err) {
            console.error("Failed to submit form:", err);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }
        try {
            if (item.id.includes('_')) {
                const ruleId = item.id.split('_')[0];
                await deleteEvent(ruleId);
            } else {
                await deleteAssignment(item.id);
            }
            // Refetch data after delete
            const updatedData = await getCalendarEvents(currentDate, filters);
            setAssignments(updatedData);
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    };

    return {
        currentDate, 
        setCurrentDate,
        assignments, 
        isLoading, 
        error,
        isPopupOpen, 
        popupMode, 
        popupType,
        editingItem,
        openAddPopup, 
        openEditPopup, 
        closePopup,
        handleFormSubmit, 
        handleDelete,
        lecturers,
        courses,
        filters,
        setFilters,
        userRole: authData?.role, // Get the role directly from authData
    };
};

export default useCalendarDashboard;