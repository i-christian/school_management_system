-- +goose Up

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) NOT NULL DEFAULT 'teacher',
    CONSTRAINT chk_email_or_phone CHECK (email IS NOT NULL OR phone_number IS NOT NULL)
);

-- Index for quick searching/filtering by role (e.g., finding all teachers or admins)
CREATE INDEX idx_users_role ON users(role);

-- SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL UNIQUE,
    user_id UUID NOT NULL UNIQUE,
    expires TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '2 week',
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Index for filtering sessions by user
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- ACADEMIC_YEAR TABLE
CREATE TABLE IF NOT EXISTS academic_year (
    academic_year_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date)
);

-- TERM TABLE
CREATE TABLE IF NOT EXISTS term (
    term_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date),
    CONSTRAINT fk_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_year(academic_year_id) ON DELETE CASCADE
);

-- Index for filtering terms by academic year
CREATE INDEX idx_term_academic_year_id ON term(academic_year_id);

-- CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) NOT NULL UNIQUE
);

-- SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS subjects (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Index for filtering subjects by class
CREATE INDEX idx_subjects_class_id ON subjects(class_id);

-- ASSIGNMENTS TABLE responsible for assigning teachers to subjects in a class
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    CONSTRAINT fk_subject FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (class_id, subject_id)
);

-- Indexes for quick filtering
CREATE INDEX idx_cst_class_id ON assignments(class_id);
CREATE INDEX idx_cst_subject_id ON assignments(subject_id);
CREATE INDEX idx_cst_teacher_id ON assignments(teacher_id);

-- STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    date_of_birth DATE NOT NULL,
    CONSTRAINT fk_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_year(academic_year_id) ON DELETE CASCADE
);

-- Index for filtering students by academic year
CREATE INDEX idx_students_academic_year_id ON students(academic_year_id);

-- GUARDIANS TABLE
CREATE TABLE IF NOT EXISTS guardians (
    guardian_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone_number_1 VARCHAR(15),
    phone_number_2 VARCHAR(15),
    gender VARCHAR(10),
    profession VARCHAR(50),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Index for filtering guardians by student
CREATE INDEX idx_guardians_student_id ON guardians(student_id);

-- STUDENT_CLASSES TABLE
CREATE TABLE IF NOT EXISTS student_classes (
    student_class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    class_id UUID NOT NULL,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Index for filtering by student or class
CREATE INDEX idx_student_classes_student_id ON student_classes(student_id);
CREATE INDEX idx_student_classes_class_id ON student_classes(class_id);

-- GRADES TABLE
CREATE TABLE IF NOT EXISTS grades (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    term_id UUID NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    remark TEXT,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_subject FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    CONSTRAINT fk_term FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE
);

-- Index for filtering grades by student, subject, or term
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_subject_id ON grades(subject_id);
CREATE INDEX idx_grades_term_id ON grades(term_id);

-- FEES TABLE
CREATE TABLE IF NOT EXISTS fees (
    fees_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    academic_year_id UUID NOT NULL,
    required NUMERIC(10, 2) NOT NULL CHECK (required >= 0),
    paid NUMERIC(10, 2) NOT NULL CHECK (paid >= 0),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_year(academic_year_id) ON DELETE CASCADE
);

-- Index for filtering fees by student or academic year
CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_fees_academic_year_id ON fees(academic_year_id);

-- REMARKS TABLE
CREATE TABLE IF NOT EXISTS remarks (
    remarks_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    term_id UUID NOT NULL,
    content_class_teacher TEXT,
    content_head_teacher TEXT,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_term FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE
);

-- Index for filtering remarks by student or term
CREATE INDEX idx_remarks_student_id ON remarks(student_id);
CREATE INDEX idx_remarks_term_id ON remarks(term_id);

-- DISCIPLINE_RECORDS TABLE
CREATE TABLE IF NOT EXISTS discipline_records (
    discipline_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    term_id UUID NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    action_taken TEXT,
    reported_by UUID NOT NULL,
    notes TEXT,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_term FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE,
    CONSTRAINT fk_reported_by FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Index for filtering discipline records by student, term, or reporter
CREATE INDEX idx_discipline_records_student_id ON discipline_records(student_id);
CREATE INDEX idx_discipline_records_term_id ON discipline_records(term_id);
CREATE INDEX idx_discipline_records_reported_by ON discipline_records(reported_by);

-- +goose Down
DROP TABLE IF EXISTS discipline_records;
DROP TABLE IF EXISTS remarks;
DROP TABLE IF EXISTS fees;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS student_classes;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS term;
DROP TABLE IF EXISTS academic_year;
DROP TABLE IF EXISTS guardians;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS assignments;