import React from "react";

const StudentList = () => {
  const students = [
    { id: 1, name: "John Doe", email: "johndoe@example.com" },
    { id: 2, name: "Jane Smith", email: "janesmith@example.com" },
    { id: 3, name: "Ali Ahmed", email: "aliahmed@example.com" },
    { id: 4, name: "Bob Johnson", email: "bobjohnson@example.com" },
    { id: 5, name: "Ema Ali", email: "emaali@example.com" },
    { id: 6, name: "Rashid Khan", email: "rashidkhan@example.com" },
    { id: 7, name: "Fatima Ali", email: "fatimaali@example.com" },
    { id: 8, name: "Ahmed Ali", email: "ahmedali@example.com" },
    { id: 9, name: "Sara Ali", email: "saraali@example.com" },
    { id: 10, name: "Hassan Ali", email: "hassanali@example.com" },
  ];

  return (
    <div className="student-list">
      <h3>Enrolled Students</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - <a href={`mailto:${student.email}`}>{student.email}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
