import uuid

from sqlmodel import Session

from app import crud
from app.models import Student, StudentCreate


def create_test_student(db: Session) -> Student:
    student_in = StudentCreate(
        first_name="Test",
        middle_name="Middle",
        last_name="Student",
        contact="123456789",
        form_id=uuid.uuid4(),
        fees=500.0,
        class_teacher_remark="Good",
        head_teacher_remark="Needs Improvement",
    )
    return crud.create_student(session=db, student_in=student_in, owner_id=uuid.uuid4())
