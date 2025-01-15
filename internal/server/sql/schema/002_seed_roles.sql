-- +goose Up
INSERT INTO roles (name, description)
VALUES 
    ('admin', 'Full access to the system'),
    ('teacher', 'Responsible for managing classes and students'),
    ('classteacher', 'Manages a specific class of students and generation of  report cards'),
    ('headteacher', 'Oversees all academic activities'),
    ('accountant', 'Manages financial records and fees')
ON CONFLICT (name) DO NOTHING;

-- +goose Down
DELETE FROM roles;
