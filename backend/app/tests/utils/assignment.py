from sqlmodel import Session

from app.crud import create_assignment
from app.models import Assignment, AssignmentCreate
from app.tests.utils.class_form import create_test_class_form
from app.tests.utils.subject import create_test_subject
from app.tests.utils.user import create_random_user


def create_test_assignment(db: Session) -> Assignment:
    teacher = create_random_user(db)
    subject = create_test_subject(db)
    class_form = create_test_class_form(db)

    assignment_in = AssignmentCreate(
        teacher_id=teacher.id,
        subject_id=subject.id,
        class_form_id=class_form.id,
    )
    return create_assignment(session=db, assignment_in=assignment_in)
