import uuid

from sqlmodel import Session

from app import crud
from app.models import Student, StudentCreate
from app.tests.utils.user import create_random_user


def create_test_student(db: Session) -> Student:
    user = create_random_user(db)
    owner_id = user.id
    assert owner_id is not None
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
    return crud.create_student(session=db, student_in=student_in, owner_id=owner_id)
