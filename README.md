# School Management System

[![License](https://img.shields.io/github/license/i-christian/school_management_system)](./LICENSE)
[![Build Status](https://github.com/i-christian/school_management_system/actions/workflows/test.yml/badge.svg)](https://github.com/i-christian/school_management_system/actions/workflows/test.yml)
[![GitHub Issues](https://img.shields.io/github/issues/i-christian/school_management_system)](https://github.com/i-christian/school_management_system/issues)
[![GitHub Contributors](https://img.shields.io/github/contributors/i-christian/school_management_system)](https://github.com/i-christian/school_management_system/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/i-christian/school_management_system)](https://github.com/i-christian/school_management_system/commits/main)
[![Latest Release](https://img.shields.io/github/v/release/i-christian/school_management_system?include_prereleases)](https://github.com/i-christian/school_management_system/releases)

## Project Overview

The **School Management System** is a full-stack web application designed to streamline and automate various administrative tasks for educational institutions. It consolidates the management of student records, teacher assignments, class schedules, grading, fee tracking, and even discipline records into one secure and scalable platform.

Key technologies used in the project include:

- **Backend**: Golang, PostgreSQL  
- **Frontend**: Templ, HTMX, TailwindCSS  
- **Development & Deployment**: Docker & Docker Compose, CI/CD with GitHub Actions

## Objectives

- **Robust Administration**: Automate the management of school operations including enrollment, grading, fee collection, and disciplinary actions.
- **Role-based Access Control**: Secure sensitive data with granular user roles (e.g., Admin, Teacher, ClassTeacher, Accountant).
- **User-friendly Interface**: Provide an intuitive and responsive design for desktop and mobile users.
- **Scalable Architecture**: Leverage modern technologies for high performance and scalability.
- **Continuous Integration/Deployment**: Automate testing and deployment pipelines for rapid development.

## Features

Based on the underlying database schema, the system includes:

- **User & Session Management**
  - Role-based authentication with clearly defined roles and permissions.
  - Secure session handling with automatic expiration (2 weeks by default).

- **Academic Administration**
  - **Academic Years & Terms**: Define academic years and their corresponding terms with start and end dates.
  - **Classes & Promotions**: Manage class details and support student promotions from one class to the next.
  - **Subjects & Assignments**: Organize subjects per class and assign teachers to subjects.

- **Student Management**
  - Maintain detailed student profiles (including personal information and enrollment status).
  - Support unique student identification per academic year.
  - Link students with one or more guardians for emergency and contact purposes.
  - Assign students to specific classes and terms.

- **Academic Records**
  - **Grades**: Record scores and remarks for each subject per term.
  - **Fees Management**: Track required fees, payments, and payment status (e.g., OVERDUE).
  - **Remarks & Discipline**: Allow class teachers and head teachers to provide remarks; maintain a record of disciplinary actions with details on actions taken and reporting staff.

## Database Design

The project uses a PostgreSQL database with a carefully normalized schema. Highlights include:

- **Roles and Users**: For role-based access control.
- **Academic and Term Tables**: To manage the school calendar.
- **Classes, Subjects, and Assignments**: To organize teaching activities.
- **Students, Guardians, and Student Classes**: To manage student enrollment and family contacts.
- **Grades, Fees, Remarks, and Discipline Records**: To record academic performance, fee statuses, and behavioral notes.

For a detailed overview of the database schema, please refer to the [Database Design Documentation](/database_design.md).

## Architecture

The application follows a modular, layered architecture:

- **Backend API**: Written in Golang with chi router, exposing RESTful endpoints for all operations—from user authentication to recording student grades.
- **Frontend**: Uses Go's `templ` alongside HTMX for dynamic content updates and TailwindCSS for responsive design.
- **Database**: PostgreSQL serves as the backbone for all persistent data, with clear relationships between entities such as students, classes, and academic terms.
- **Containerization**: Docker and Docker Compose streamline development, testing, and deployment.
- **Reverse Proxy**: Caddy server acts as a reverse proxy for the application
- **CI/CD Pipeline**: GitHub Actions automate testing and deployments, ensuring continuous integration and delivery.

## Development Workflow

For instructions on how to get started with this application, please refer to the [Development Documentation](/development.md).

This documentation provides instructions on how to set up your environment and develop the application.

## Deployment Workflow

For instructions on how to deploy the application, please refer to the [Deployment Documentation](/deployment.md).

This documentation provides instructions on how to set up your server and deploy the application.


## Contributing 🤝

I welcome contributions to improve this project. Here’s how you can get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Licensing 📄
School Management System is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.

## Acknowledgements 🙌
Special thanks to the developers of Golang, Chi, Templ, and HTMX & TailwindCSS for their excellent tools and libraries.
