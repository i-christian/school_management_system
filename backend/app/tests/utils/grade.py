from sqlmodel import Session

from app import crud
from app.models import Grade, GradeCreate
from app.tests.utils.subject import create_test_subject
from app.tests.utils.user import create_random_user


def create_test_grade(db: Session) -> Grade:
    student = create_random_user(session)
    subject = create_test_subject(session)
    grade_in = GradeCreate(
        student_id=student.id,
        subject_id=subject.id,
        score=85,
        remark="Good performance",
    )
    grade = crud.create_grade(session=db, grade_in=grade_in)
    return grade
