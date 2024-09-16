import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import SessionDep
from app.models import (
    Assignment,
    AssignmentCreate,
    AssignmentPublic,
    AssignmentsPublic,
    AssignmentUpdate,
    Message,
)

router = APIRouter()


@router.get("/", response_model=AssignmentsPublic)
def read_assignments(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve assignments.
    """
    count_statement = select(func.count()).select_from(Assignment)
    count = session.exec(count_statement).one()
    statement = select(Assignment).offset(skip).limit(limit)
    assignments = session.exec(statement).all()
    return AssignmentsPublic(data=assignments, count=count)


@router.get("/{id}", response_model=AssignmentPublic)
def read_assignment(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get assignment by ID.
    """
    assignment = session.get(Assignment, id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


@router.post("/", response_model=AssignmentPublic)
def create_assignment(*, session: SessionDep, assignment_in: AssignmentCreate) -> Any:
    """
    Create new assignment.
    Check for duplicate (same teacher, subject, and class form) before creation.
    """
    existing_assignment = session.exec(
        select(Assignment)
        .where(Assignment.teacher_id == assignment_in.teacher_id)
        .where(Assignment.subject_id == assignment_in.subject_id)
        .where(Assignment.class_form_id == assignment_in.class_form_id)
    ).first()

    if existing_assignment:
        raise HTTPException(
            status_code=409,
            detail="Assignment with the same teacher, subject, and class form already exists",
        )

    assignment = crud.create_assignment(session=session, assignment_in=assignment_in)
    return assignment


@router.put("/{id}", response_model=AssignmentPublic)
def update_assignment(
    *, session: SessionDep, id: uuid.UUID, assignment_in: AssignmentUpdate
) -> Any:
    """
    Update an assignment.
    """
    assignment = session.get(Assignment, id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    assignment = crud.update_assignment(
        session=session, db_assignment=assignment, assignment_in=assignment_in
    )
    return assignment


@router.delete("/{id}", response_model=Message)
def delete_assignment(*, session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete an assignment.
    """
    assignment = crud.delete_assignment(session=session, assignment_id=id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return Message(message="Assignment deleted successfully")
