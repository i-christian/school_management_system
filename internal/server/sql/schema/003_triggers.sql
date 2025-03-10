-- +goose Up
CREATE TABLE IF NOT EXISTS number_counters (
  type TEXT NOT NULL,
  year TEXT NOT NULL,
  last_val INT NOT NULL,
  PRIMARY KEY (type, year)
);

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION fn_generate_user_no() 
RETURNS trigger AS $function$
DECLARE 
    current_year TEXT := to_char(current_timestamp, 'YYYY');
    seq INT;
BEGIN
    IF NEW.user_no IS NULL THEN
        PERFORM 1 FROM number_counters 
          WHERE type = 'user' AND year = current_year FOR UPDATE;
        
        IF FOUND THEN
            SELECT last_val + 1 INTO seq 
              FROM number_counters 
              WHERE type = 'user' AND year = current_year;
            
            UPDATE number_counters 
              SET last_val = seq 
              WHERE type = 'user' AND year = current_year;
        ELSE
            seq := 1;
            INSERT INTO number_counters (type, year, last_val)
              VALUES ('user', current_year, seq);
        END IF;
        
        NEW.user_no := 'USR-' || current_year || '-' || LPAD(seq::TEXT, 5, '0');
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
        PERFORM 1 FROM number_counters 
          WHERE type = 'student' AND year = current_year FOR UPDATE;
        
        IF FOUND THEN
            SELECT last_val + 1 INTO seq 
              FROM number_counters 
              WHERE type = 'student' AND year = current_year;
            
            UPDATE number_counters 
              SET last_val = seq 
              WHERE type = 'student' AND year = current_year;
        ELSE
            seq := 1;
            INSERT INTO number_counters (type, year, last_val)
              VALUES ('student', current_year, seq);
        END IF;
        
        NEW.student_no := 'STD-' || current_year || '-' || LPAD(seq::TEXT, 5, '0');
    END IF;
    
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TRIGGER trg_generate_student_no
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION fn_generate_student_no();

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TRIGGER trg_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();


-- +goose StatementBegin
CREATE OR REPLACE FUNCTION fn_update_fee_status()
RETURNS TRIGGER AS $$
DECLARE
    req_amount NUMERIC(10,2);
    remaining_payment NUMERIC(10,2);
    new_balance NUMERIC(10,2);
BEGIN
    SELECT required INTO req_amount
    FROM fee_structure
    WHERE fee_structure_id = NEW.fee_structure_id;
    -- First, use any existing arrears to reduce the incoming payment
    IF TG_OP = 'UPDATE' AND NEW.paid > OLD.paid THEN
        -- Skip arrears deduction in this case for increasing payment updates
    ELSIF NEW.paid > 0 AND NEW.arrears > 0 THEN
        IF NEW.paid >= NEW.arrears THEN
            NEW.paid := NEW.paid - NEW.arrears;
            NEW.arrears := 0;
        ELSE
            NEW.arrears := NEW.arrears - NEW.paid;
            NEW.paid := 0;
        END IF;
    END IF;
    -- After deducting previous arrears, the remaining payment is applied to the current fee
    remaining_payment := NEW.paid;
    new_balance := req_amount - remaining_payment;
    -- Set the status based on the remaining balance and payment
    IF new_balance < 0 THEN
        NEW.status := 'PAID';
    ELSIF new_balance = 0 THEN
        NEW.status := 'PAID';
    ELSIF remaining_payment > 0 THEN
        NEW.status := 'PARTIAL';
    ELSE
        NEW.status := 'OVERDUE';
    END IF;
    -- If the student overpays, arrears should be negative (credit balance)
    -- Otherwise, arrears should reflect the remaining balance due
    IF new_balance < 0 THEN
        NEW.arrears := new_balance;
    ELSIF new_balance = 0 THEN
        NEW.arrears := 0;
    ELSE
        NEW.arrears := new_balance;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TRIGGER trg_update_fee_status
BEFORE INSERT OR UPDATE ON fees
FOR EACH ROW
EXECUTE FUNCTION fn_update_fee_status();

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION reset_student_promoted_flag_term()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.active = TRUE AND OLD.active = FALSE THEN
        UPDATE students
        SET promoted = FALSE
        WHERE promoted = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TRIGGER term_active_trigger
AFTER UPDATE OF active ON term
FOR EACH ROW
WHEN (NEW.active IS TRUE AND OLD.active IS FALSE)
EXECUTE FUNCTION reset_student_promoted_flag_term();

-- +goose Down
DROP TRIGGER IF EXISTS trg_generate_student_no ON students;
DROP FUNCTION IF EXISTS fn_generate_student_no();

DROP TRIGGER IF EXISTS trg_generate_user_no ON users;
DROP FUNCTION IF EXISTS fn_generate_user_no();

DROP TABLE IF EXISTS number_counters;

DROP TRIGGER IF EXISTS trg_update_users_timestamp ON users;
DROP FUNCTION IF EXISTS fn_update_timestamp();

DROP TRIGGER IF EXISTS trg_update_fee_status ON fees;
DROP FUNCTION IF EXISTS fn_update_fee_status();
