from sqlmodel import Session

from app.crud import create_class_form
from app.models import ClassForm, ClassFormCreate


def create_test_class_form(db: Session) -> ClassForm:
    class_form_in = ClassFormCreate(name="Form 1C")
    return create_class_form(session=db, class_form_in=class_form_in)
