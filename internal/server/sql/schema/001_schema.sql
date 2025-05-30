-- +goose Up

-- ROLES TABLE
CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- USERS TABLE
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_no VARCHAR(50) UNIQUE NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role_id UUID NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT,
    CONSTRAINT chk_email_or_phone CHECK (email IS NOT NULL OR phone_number IS NOT NULL)
);

-- Create indexes for frequently queried columns in USERS table
CREATE INDEX idx_users_user_no ON users(user_no);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone_number ON users(phone_number);

-- SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    expires TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '2 week',
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) NOT NULL UNIQUE
);

-- CLASS TEACHERS TABLE
CREATE TABLE IF NOT EXISTS class_teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
    UNIQUE(teacher_id, class_id)
);

CREATE EXTENSION IF NOT EXISTS btree_gist;
-- ACADEMIC_YEAR TABLE
CREATE TABLE IF NOT EXISTS academic_year (
    academic_year_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graduate_class_id UUID REFERENCES classes(class_id) ON DELETE SET NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date),
    active BOOLEAN NOT NULL DEFAULT FALSE,
    period DATERANGE GENERATED ALWAYS AS (daterange(start_date, end_date, '[]')) STORED,
    CONSTRAINT academic_year_no_overlap EXCLUDE USING gist (period WITH &&)
);

-- Partial unique index to ensure only one active academic year exists.
CREATE UNIQUE INDEX unique_active_academic_year
    ON academic_year(active)
    WHERE active = TRUE;
CREATE INDEX idx_academic_year_graduate_class_id ON academic_year(graduate_class_id);

-- TERM TABLE
CREATE TABLE IF NOT EXISTS term (
    term_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL,
    previous_term_id UUID NULL,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date),
    active BOOLEAN NOT NULL DEFAULT FALSE,
    period DATERANGE GENERATED ALWAYS AS (daterange(start_date, end_date, '[]')) STORED,
    CONSTRAINT term_name_on_academic_year UNIQUE (academic_year_id, name),
    CONSTRAINT fk_academic_year FOREIGN KEY (academic_year_id)
        REFERENCES academic_year(academic_year_id) ON DELETE CASCADE,
    CONSTRAINT term_no_overlap EXCLUDE USING gist (
        academic_year_id WITH =,
        period WITH &&
    ),
    CONSTRAINT fk_previous_term FOREIGN KEY (previous_term_id) REFERENCES term(term_id) ON DELETE SET NULL
);

-- Partial unique index to ensure only one active term exists.
CREATE UNIQUE INDEX unique_active_term
    ON term(active)
    WHERE active = TRUE;
-- Index for filtering terms by academic year
CREATE INDEX idx_term_academic_year_id ON term(academic_year_id);


-- SUBJECTS TABLE
CREATE TABLE subjects (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    CONSTRAINT unique_subject_name_per_class UNIQUE (class_id, name)
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
    CONSTRAINT unique_class_subject_per_teacher UNIQUE (class_id, subject_id)
);

-- Indexes for quick filtering
CREATE INDEX idx_cst_class_id ON assignments(class_id);
CREATE INDEX idx_cst_subject_id ON assignments(subject_id);
CREATE INDEX idx_cst_teacher_id ON assignments(teacher_id);

-- STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_no VARCHAR(50) UNIQUE NOT NULL,
    academic_year_id UUID NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    first_name VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    date_of_birth DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- Tracks the student's current state
    promoted BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the student was promoted this year
    graduated BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the student has graduated
    suspended BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the student got suspended
    CONSTRAINT chk_student_status CHECK (status IN ('active', 'repeating', 'withdrawn', 'graduated')),
    CONSTRAINT fk_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_year(academic_year_id) ON DELETE CASCADE,
    CONSTRAINT unique_student_per_year UNIQUE (first_name, last_name, middle_name, date_of_birth, academic_year_id)
);

-- Index for filtering students by academic year
CREATE INDEX idx_students_academic_year_id ON students(academic_year_id);

-- GUARDIANS TABLE
CREATE TABLE IF NOT EXISTS guardians (
    guardian_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_name VARCHAR(50) NOT NULL,
    phone_number_1 VARCHAR(25) UNIQUE,
    phone_number_2 VARCHAR(25) UNIQUE,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    profession VARCHAR(50),
    CONSTRAINT atleast_one_phone_number CHECK (phone_number_1 IS NOT NULL OR phone_number_2 IS NOT NULL),
    CONSTRAINT unique_phone_numbers UNIQUE (phone_number_1, phone_number_2)
);

-- A linking table between students and their guardians
CREATE TABLE IF NOT EXISTS student_guardians (
    student_id UUID NOT NULL,
    guardian_id UUID NOT NULL,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_guardian FOREIGN KEY (guardian_id) REFERENCES guardians(guardian_id) ON DELETE CASCADE,
    CONSTRAINT student_guardian UNIQUE(student_id, guardian_id)
);

-- STUDENT_CLASSES TABLE
CREATE TABLE IF NOT EXISTS student_classes (
    student_class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    previous_class_id UUID NULL,
    class_id UUID NOT NULL,
    term_id UUID NOT NULL,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    CONSTRAINT fk_term FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE,
    CONSTRAINT fk_previous_class FOREIGN KEY (previous_class_id) REFERENCES classes(class_id) ON DELETE SET NULL
);

-- Index for filtering by student or class
CREATE INDEX idx_student_classes_student_id ON student_classes(student_id);
CREATE INDEX idx_student_classes_class_id ON student_classes(class_id);
CREATE UNIQUE INDEX unique_student_term_class 
ON student_classes(student_id, term_id) WHERE class_id IS NOT NULL;


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
    CONSTRAINT fk_term FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE,
    CONSTRAINT unique_grade UNIQUE (student_id, subject_id, term_id)
);

-- Index for filtering grades by student, subject, or term
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_subject_id ON grades(subject_id);
CREATE INDEX idx_grades_term_id ON grades(term_id);

-- FEE_STRUCTURE TABLE
CREATE TABLE fee_structure (
  fee_structure_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID NOT NULL,
  class_id UUID NOT NULL,
  required NUMERIC(10,2) NOT NULL CHECK (required >= 0),
  UNIQUE(term_id, class_id)
);

-- FEES TABLE
CREATE TABLE fees (
  fees_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_structure_id UUID NOT NULL,
  student_id UUID NOT NULL,
  paid NUMERIC(10,2) NOT NULL,
  arrears NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'OVERDUE',
  CONSTRAINT fk_fee_structure FOREIGN KEY (fee_structure_id)
    REFERENCES fee_structure(fee_structure_id) ON DELETE CASCADE,
  CONSTRAINT fk_student FOREIGN KEY (student_id)
    REFERENCES students(student_id) ON DELETE CASCADE,
  UNIQUE(fee_structure_id, student_id)
);

-- Index for filtering fees by student, term, and class
CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_fees_term_id ON fee_structure(term_id);
CREATE INDEX idx_fees_class_id ON fee_structure(class_id);

-- REMARKS TABLE
CREATE TABLE IF NOT EXISTS remarks (
    remarks_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    term_id UUID NOT NULL,
    content_class_teacher TEXT,
    content_head_teacher TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_term FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE,
    CONSTRAINT unique_student_term UNIQUE (student_id, term_id) 
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
    reported_by UUID,
    notes TEXT,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_term FOREIGN KEY (term_id) REFERENCES term(term_id) ON DELETE CASCADE,
    CONSTRAINT fk_reported_by FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT unique_student_term_date UNIQUE (student_id, term_id, date)
);

-- Index for filtering discipline records by student, term, or reporter
CREATE INDEX idx_discipline_records_student_id ON discipline_records(student_id);
CREATE INDEX idx_discipline_records_term_id ON discipline_records(term_id);
CREATE INDEX idx_discipline_records_reported_by ON discipline_records(reported_by);


-- CLASS PROMOTION TABLE
CREATE TABLE IF NOT EXISTS class_promotions (
    class_id UUID NOT NULL,
    next_class_id UUID,
    CONSTRAINT fk_current_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    CONSTRAINT fk_next_class FOREIGN KEY (next_class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    UNIQUE(class_id, next_class_id),
    PRIMARY KEY (class_id)
);

-- PROMOTION_HISTORY TABLE
CREATE TABLE IF NOT EXISTS promotion_history (
    promotion_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stored_term_id UUID NOT NULL,
    promotion_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_undone BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_term FOREIGN KEY (stored_term_id) REFERENCES term(term_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_promotion_history_details (
    student_promotion_history_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_history_id UUID NOT NULL,
    student_id UUID NOT NULL,
    previous_class_id UUID NULL,
    class_id UUID NOT NULL,
    promoted BOOLEAN NOT NULL,
    status VARCHAR(20) NOT NULL,
    graduated BOOLEAN NOT NULL,
    CONSTRAINT fk_promotion_history FOREIGN KEY (promotion_history_id) REFERENCES promotion_history(promotion_history_id) ON DELETE CASCADE,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    CONSTRAINT fk_previous_class FOREIGN KEY (previous_class_id) REFERENCES classes(class_id) ON DELETE SET NULL
);

-- Index for filtering promotion history by term
CREATE INDEX idx_promotion_history_term_id ON promotion_history(stored_term_id);
CREATE INDEX idx_student_promotion_history_details_promotion_history_id ON student_promotion_history_details(promotion_history_id);

-- +goose Down
DROP TABLE IF EXISTS discipline_records;
DROP TABLE IF EXISTS remarks;
DROP TABLE IF EXISTS fees;
DROP TABLE IF EXISTS fee_structure;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS student_classes;
DROP TABLE IF EXISTS student_guardians;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS class_promotions;
DROP TABLE IF EXISTS term;
DROP TABLE IF EXISTS academic_year;
DROP TABLE IF EXISTS guardians;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS student_promotion_history_details;
DROP TABLE IF EXISTS promotion_history;
