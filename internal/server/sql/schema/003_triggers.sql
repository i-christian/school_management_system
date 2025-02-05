-- +goose Up

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION fn_generate_user_no() 
RETURNS trigger AS $function$
DECLARE 
    current_year TEXT := to_char(current_timestamp, 'YYYY');
    seq INT;
BEGIN
    IF NEW.user_no IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(user_no FROM 9) AS INTEGER)), 0) + 1
          INTO seq
        FROM users
        WHERE SUBSTRING(user_no FROM 5 FOR 4) = current_year;
        
        NEW.user_no := 'USR-' || current_year || '-' || lpad(seq::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TRIGGER trg_generate_user_no
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION fn_generate_user_no();

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION fn_generate_student_no() 
RETURNS trigger AS $function$
DECLARE 
    current_year TEXT := to_char(current_timestamp, 'YYYY');
    seq INT;
BEGIN
    IF NEW.student_no IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(student_no FROM 10) AS INTEGER)), 0) + 1
          INTO seq
        FROM students
        WHERE SUBSTRING(student_no FROM 5 FOR 4) = current_year;
        
        NEW.student_no := 'STD-' || current_year || '-' || lpad(seq::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TRIGGER trg_generate_student_no
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION fn_generate_student_no();

-- +goose Down
DROP TRIGGER IF EXISTS trg_generate_student_no ON students;
DROP FUNCTION IF EXISTS fn_generate_student_no();

DROP TRIGGER IF EXISTS trg_generate_user_no ON users;
DROP FUNCTION IF EXISTS fn_generate_user_no();
