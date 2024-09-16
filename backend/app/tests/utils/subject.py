from sqlmodel import Session

from app.crud import create_subject
from app.models import Subject, SubjectCreate


def create_test_subject(db: Session) -> Subject:
    subject_in = SubjectCreate(name="Mathematics")
    return create_subject(session=db, subject_in=subject_in)
