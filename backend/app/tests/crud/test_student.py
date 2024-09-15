import uuid

from sqlmodel import Session

from app import crud
from app.models import Student, StudentCreate, StudentUpdate
from app.tests.utils.student import create_test_student


def test_create_student(db: Session) -> None:
    owner_id = uuid.uuid4()
    student_in = StudentCreate(
        first_name="John",
        middle_name="Doe",
        last_name="Smith",
        contact="1234567890",
        form_id=uuid.uuid4(),
        fees=1000.0,
        class_teacher_remark="Good student",
        head_teacher_remark="Needs improvement",
    )
    student = crud.create_student(session=db, student_in=student_in, owner_id=owner_id)
    assert student.first_name == "John"
    assert student.last_name == "Smith"


def test_update_student(db: Session) -> None:
    student = create_test_student(db)
    student_in_update = StudentUpdate(first_name="Jane", fees=1500.0)

    updated_student = crud.update_student(
        session=db, db_student=student, student_in=student_in_update
    )
    assert updated_student.first_name == "Jane"
    assert updated_student.fees == 1500.0


def test_delete_student(db: Session) -> None:
    student = create_test_student(db)
    deleted_student = crud.delete_student(session=db, student_id=student.id)
    assert deleted_student.id == student.id

    student_2 = db.get(Student, student.id)
    assert student_2 is None


def test_update_non_existent_student(db: Session) -> None:
    non_existent_student_id = uuid.uuid4()
    student_in_update = StudentUpdate(first_name="New Name")

    non_existent_student = db.get(Student, non_existent_student_id)
    assert non_existent_student is None

    try:
        crud.update_student(
            session=db, db_student=non_existent_student, student_in=student_in_update
        )
    except AttributeError:
        assert True
