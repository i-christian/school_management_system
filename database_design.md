# Database Schema Design

This document outlines the database schema and the relationships between tables for the project. The schema includes tables for users, roles, students, classes, academic terms, assignments, grades, fees, discipline records, and more.

---

## Tables and Relationships

### **Roles Table**
- **Table Name**: `roles`
- **Description**: Stores different roles (e.g., admin, teacher, student).
- **Primary Key**: `role_id`
- **Relationships**: None.

---

### **Users Table**
- **Table Name**: `users`
- **Description**: Stores information about the users in the system (teachers, admins, etc.).
- **Primary Key**: `user_id`
- **Relationships**: 
  - `role_id` references `roles(role_id)` (A user has a specific role).

---

### **Sessions Table**
- **Table Name**: `sessions`
- **Description**: Manages user sessions, storing session IDs and expiration times.
- **Primary Key**: `id`
- **Relationships**: 
  - `user_id` references `users(user_id)` (Each session belongs to a user).

---

### **Academic Year Table**
- **Table Name**: `academic_year`
- **Description**: Stores academic year information.
- **Primary Key**: `academic_year_id`
- **Relationships**: None.

---

### **Term Table**
- **Table Name**: `term`
- **Description**: Represents the academic terms (e.g., Spring 2025, Fall 2025).
- **Primary Key**: `term_id`
- **Relationships**: 
  - `academic_year_id` references `academic_year(academic_year_id)` (A term belongs to a specific academic year).

---

### **Classes Table**
- **Table Name**: `classes`
- **Description**: Stores information about classes (e.g., Year 1, Year 2, etc.).
- **Primary Key**: `class_id`
- **Relationships**: None.

---

### **Class Promotions Table**
- **Table Name**: `class_promotions`
- **Description**: Defines promotion rules between classes (e.g., from Year 1 to Year 2).
- **Primary Key**: `class_id`
- **Relationships**: 
  - `class_id` references `classes(class_id)` (Current class).
  - `next_class_id` references `classes(class_id)` (Next class to promote to).

---

### **Subjects Table**
- **Table Name**: `subjects`
- **Description**: Stores information about subjects taught in classes.
- **Primary Key**: `subject_id`
- **Relationships**: 
  - `class_id` references `classes(class_id)` (Each subject belongs to a class).

---

### **Assignments Table**
- **Table Name**: `assignments`
- **Description**: Assigns teachers to subjects in specific classes.
- **Primary Key**: `id`
- **Relationships**: 
  - `class_id` references `classes(class_id)` (Each assignment is tied to a class).
  - `subject_id` references `subjects(subject_id)` (Each assignment is tied to a subject).
  - `teacher_id` references `users(user_id)` (Each assignment is tied to a teacher).

---

### **Students Table**
- **Table Name**: `students`
- **Description**: Stores information about students, their status, and promotion details.
- **Primary Key**: `student_id`
- **Relationships**: 
  - `academic_year_id` references `academic_year(academic_year_id)` (Each student is part of an academic year).

---

### **Guardians Table**
- **Table Name**: `guardians`
- **Description**: Stores guardian details for each student.
- **Primary Key**: `guardian_id`
- **Relationships**: 
  - `student_id` references `students(student_id)` (Each guardian is linked to a student).

---

### **Student Classes Table**
- **Table Name**: `student_classes`
- **Description**: Tracks which students are enrolled in which classes for each term.
- **Primary Key**: `student_class_id`
- **Relationships**: 
  - `student_id` references `students(student_id)` (Links students to their classes).
  - `class_id` references `classes(class_id)` (Links classes to students).
  - `term_id` references `term(term_id)` (Links terms to student classes).

---

### **Grades Table**
- **Table Name**: `grades`
- **Description**: Stores grades for students in subjects for each term.
- **Primary Key**: `grade_id`
- **Relationships**: 
  - `student_id` references `students(student_id)` (Each grade is tied to a student).
  - `subject_id` references `subjects(subject_id)` (Each grade is tied to a subject).
  - `term_id` references `term(term_id)` (Each grade is tied to a term).

---

### **Fees Table**
- **Table Name**: `fees`
- **Description**: Tracks fee payments and statuses for students in specific terms and classes.
- **Primary Key**: `fees_id`
- **Relationships**: 
  - `student_id` references `students(student_id)` (Each fee record is tied to a student).
  - `term_id` references `term(term_id)` (Each fee record is tied to a term).
  - `class_id` references `classes(class_id)` (Each fee record is tied to a class).

---

### **Remarks Table**
- **Table Name**: `remarks`
- **Description**: Stores teacher remarks for students, including content for class and head teacher.
- **Primary Key**: `remarks_id`
- **Relationships**: 
  - `student_id` references `students(student_id)` (Each remark is tied to a student).
  - `term_id` references `term(term_id)` (Each remark is tied to a term).

---

### **Discipline Records Table**
- **Table Name**: `discipline_records`
- **Description**: Tracks disciplinary actions for students within a specific term.
- **Primary Key**: `discipline_id`
- **Relationships**: 
  - `student_id` references `students(student_id)` (Each discipline record is tied to a student).
  - `term_id` references `term(term_id)` (Each discipline record is tied to a term).
  - `reported_by` references `users(user_id)` (Each discipline record is reported by a user).

---

## Summary of Key Relationships

- **Users ↔ Roles**: Users have roles, and roles define user permissions and responsibilities.
- **Students ↔ Academic Year**: Students belong to a specific academic year.
- **Students ↔ Classes**: Students are enrolled in classes across terms.
- **Classes ↔ Subjects**: Each class has multiple subjects, and each subject belongs to a class.
- **Assignments ↔ Teachers**: Teachers are assigned to subjects within classes.
- **Students ↔ Grades**: Grades are assigned to students per subject and term.
- **Students ↔ Fees**: Students are required to pay fees for each term and class.
- **Students ↔ Guardians**: Students have associated guardians for contact and support.

---
