from sqlmodel import Session

from app import crud
from app.models import Grade, GradeCreate
from app.tests.utils.student import create_test_student
from app.tests.utils.subject import create_test_subject


def create_test_grade(db: Session) -> Grade:
    student = create_test_student(db)
    subject = create_test_subject(db)
    grade_in = GradeCreate(
        student_id=student.id,
        subject_id=subject.id,
        score=85,
        remark="Good performance",
    )
    grade = crud.create_grade(session=db, grade_in=grade_in)
    return grade
