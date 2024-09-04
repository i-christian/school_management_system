import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import SessionDep
from app.models import (
    Grade,
    GradeCreate,
    GradePublic,
    GradesPublic,
    GradeUpdate,
    Message,
)

router = APIRouter()


@router.get("/", response_model=GradesPublic)
def read_grades(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve grades.
    """
    count_statement = select(func.count()).select_from(Grade)
    count = session.exec(count_statement).one()
    statement = select(Grade).offset(skip).limit(limit)
    grades = session.exec(statement).all()
    return GradesPublic(data=grades, count=count)


@router.get("/{id}", response_model=GradePublic)
def read_grade(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get grade by ID.
    """
    grade = session.get(Grade, id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade


@router.post("/", response_model=GradePublic)
def create_grade(*, session: SessionDep, grade_in: GradeCreate) -> Any:
    """
    Create new grade. Prevent duplicate grades for the same student and subject.
    """
    existing_grade = session.exec(
        select(Grade).where(
            Grade.student_id == grade_in.student_id,
            Grade.subject_id == grade_in.subject_id,
        )
    ).first()

    if existing_grade:
        existing_grade.score = grade_in.score
        session.add(existing_grade)
        session.commit()
        session.refresh(existing_grade)
        return existing_grade

    grade = crud.create_grade(session=session, grade_in=grade_in)
    return grade


@router.put("/{id}", response_model=GradePublic)
def update_grade(*, session: SessionDep, id: uuid.UUID, grade_in: GradeUpdate) -> Any:
    """
    Update a grade.
    """
    grade = session.get(Grade, id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    grade = crud.update_grade(session=session, db_grade=grade, grade_in=grade_in)
    return grade


@router.delete("/{id}", response_model=Message)
def delete_grade(*, session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete a grade.
    """
    grade = crud.delete_grade(session=session, grade_id=id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return Message(message="Grade deleted successfully")
