from sqlmodel import Session

from app import crud
from app.models import Student, StudentCreate
from app.tests.utils.class_form import create_test_class_form
from app.tests.utils.user import create_random_user


def create_test_student(db: Session) -> Student:
    class_form = create_test_class_form(db)
    assert class_form.id is not None

    user = create_random_user(db)
    owner_id = user.id
    assert owner_id is not None
    student_in = StudentCreate(
        first_name="Test",
        middle_name="Middle",
        last_name="Student",
        contact="0123456789",
        form_id=str(class_form.id),
        fees=500.0,
        class_teacher_remark="Good",
        head_teacher_remark="Needs Improvement",
    )
    return crud.create_student(session=db, student_in=student_in, owner_id=owner_id)
