# School Management System


[![License](https://img.shields.io/github/license/i-christian/school_management_system)](./LICENSE)
[![Build Status](https://github.com/i-christian/school_management_system/actions/workflows/test.yml/badge.svg)](https://github.com/i-christian/school_management_system/actions/workflows/test.yml)
[![Test Coverage](https://github.com/i-christian/school_management_system/actions/workflows/smokeshow.yml/badge.svg)](https://github.com/i-christian/school_management_system/actions/workflows/smokeshow.yml)
[![GitHub Issues](https://img.shields.io/github/issues/i-christian/school_management_system)](https://github.com/i-christian/school_management_system/issues)
[![GitHub Contributors](https://img.shields.io/github/contributors/i-christian/school_management_system)](https://github.com/i-christian/school_management_system/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/i-christian/school_management_system)](https://github.com/i-christian/school_management_system/commits/main)
[![Releases](https://img.shields.io/github/release/i-christian/school_management_system.svg)](https://github.com/i-christian/school_management_system/releases)
[![Pre-release](https://img.shields.io/github/v/release/i-christian/school_management_system?include_prereleases)](https://github.com/i-christian/school_management_system/releases)

## Project Overview

The **School Management System** is a full-stack web application designed to streamline and automate the management of school operations, including student information, teacher management, class assignments, grades, and fees. Built using modern web technologies, the application ensures a secure, scalable, and user-friendly experience tailored for educational institutions.

- **Backend**: FastAPI, SQLAlchemy ORM, PostgreSQL
- **Frontend**: SolidJS (TypeScript), TailwindCSS
- **Deployment**: Continuous Integration/Continuous Deployment (CI/CD) via GitHub

## Objectives

- Provide a **robust and scalable** web application for managing school operations.
- Ensure **security** by implementing role-based access control.
- Deliver a **user-friendly** interface with responsive design across all devices.
- Implement an automated **CI/CD pipeline** for continuous integration and deployment.

## Technologies

- **Frontend**: SolidJS (TypeScript), TailwindCSS for responsive design.
- **Backend**: FastAPI for handling server-side logic, SQLAlchemy ORM for database operations.
- **Database**: PostgreSQL for data storage.
- **CI/CD**: GitHub Actions for automated testing and deployment.

## Key Features

1. **Student Grades Management**:
   - Insert, edit, store, and view student grades.
   - Send grades to students.
  
2. **Teacher & Admin Management**:
   - Create, edit, and manage teacher accounts.
   - Role-based access control to ensure data security.
  
3. **Responsive User Interface**:
   - Fully responsive design using TailwindCSS, optimized for all devices.

4. **User Authentication**:
   - Secure login and registration for teachers and administrators.
   - Admin can manage user roles and permissions.
  
5. **Role-based Access Control**:
   - **Admin**: Full access to manage teachers, students, classes, subjects, and fees.
   - **Teachers**: Manage student grades and view assigned classes.
   - **Authorised Roles**: Users such as accountants can manage student fees.

## User Roles

### Administrator
- **Manage Teachers**: Add/edit/delete teachers.
- **Manage Subjects & Classes**: Add/edit/delete subjects and class details.
- **Assign Teachers**: Assign teachers to subjects and classes.
- **Manage Students**: Add/edit/delete student information.
- **Fees Management**: Set/update student fees.

### Teacher
- **View Assigned Classes**: See all classes and subjects assigned to them.
- **Manage Grades**: Enter and update student grades.

### Authorised Roles (e.g., Accountant)
- **Manage Fees**: View and update student fees.

## Development and Deployment

For detailed setup instructions on how to develop both the frontend and backend, as well as deployment procedures, refer to the following documentation:

- [Development Guide](./development.md)
- [Deployment Guide](./deployment.md)

Each directory (`frontend` and `backend`) also contains its own setup instructions in their respective `README.md` files to guide developers through environment configuration and running the application locally.

## Usage

- **Admin**, **Teachers**, and **Authorised Users** can log in through the landing page of the application.
- The UI is divided into dashboards based on roles:
  - **Admin Dashboard**: Manage teachers, students, classes, subjects, and fees.
  - **Teacher Dashboard**: Manage student grades and view assigned classes.
  - **Authorised Roles Dashboard**: View and update fees.

## Project Status

The project has been is still being built. The CI/CD pipeline is set up to ensure continuous updates and maintenance.

## Contributors

- **Innocent Christian Mhango**
- **Maxwell Honorifia Kajiwonele**

---

For more details, visit the [GitHub repository](https://github.com/i-christian/school_management_system.git)
