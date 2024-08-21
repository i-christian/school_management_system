from sqlmodel import Session

from app import crud
from app.models import Student, StudentCreate
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import random_lower_string


def create_random_student(db: Session) -> Student:
    user = create_random_user(db)
    owner_id = user.id
    assert owner_id is not None
    first_name = random_lower_string()
    last_name = random_lower_string()
    student_in = StudentCreate(first_name=first_name, last_name=last_name)
    return crud.create_student(session=db, student_in=student_in, owner_id=owner_id)
