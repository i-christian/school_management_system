import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import SessionDep
from app.models import (
    Message,
    Subject,
    SubjectCreate,
    SubjectPublic,
    SubjectsPublic,
    SubjectUpdate,
)

router = APIRouter()


@router.get("/", response_model=SubjectsPublic)
def read_subjects(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve subjects.
    """
    count_statement = select(func.count()).select_from(Subject)
    count = session.exec(count_statement).one()
    statement = select(Subject).offset(skip).limit(limit)
    subjects = session.exec(statement).all()
    return SubjectsPublic(data=subjects, count=count)


@router.get("/{id}", response_model=SubjectPublic)
def read_subject(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get subject by ID.
    """
    subject = session.get(Subject, id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


@router.post("/", response_model=SubjectPublic)
def create_subject(*, session: SessionDep, subject_in: SubjectCreate) -> Any:
    """
    Create new subject.
    """
    subject = crud.create_subject(session=session, subject_in=subject_in)
    return subject


@router.put("/{id}", response_model=SubjectPublic)
def update_subject(
    *, session: SessionDep, id: uuid.UUID, subject_in: SubjectUpdate
) -> Any:
    """
    Update a subject.
    """
    subject = session.get(Subject, id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    subject = crud.update_subject(
        session=session, db_subject=subject, subject_in=subject_in
    )
    return subject


@router.delete("/{id}", response_model=Message)
def delete_subject(*, session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete a subject.
    """
    subject = crud.delete_subject(session=session, subject_id=id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return Message(message="Subject deleted successfully")
