import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Message,
    Student,
    StudentCreate,
    StudentPublic,
    StudentsPublic,
    StudentUpdate,
)

router = APIRouter()


@router.get("/", response_model=StudentsPublic)
def read_students(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve students.
    """
    count_statement = select(func.count()).select_from(Student)
    count = session.exec(count_statement).one()
    statement = select(Student).offset(skip).limit(limit)
    students = session.exec(statement).all()

    return StudentsPublic(data=students, count=count)


@router.get("/{id}", response_model=StudentPublic)
def read_student(session: SessionDep, id: uuid.UUID) -> Any:
    """
    Get student by ID.
    """
    student = session.get(Student, id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.post("/", response_model=StudentPublic)
def create_student(
    *, session: SessionDep, current_user: CurrentUser, student_in: StudentCreate
) -> Any:
    """
    Create new student.
    """
    student = crud.create_student(
        session=session, student_in=student_in, owner_id=current_user.id
    )
    return student


@router.put("/{id}", response_model=StudentPublic)
def update_student(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    student_in: StudentUpdate,
) -> Any:
    """
    Update a student.
    """
    student = session.get(Student, id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not current_user.is_superuser and (student.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    student = crud.update_student(
        session=session, db_student=student, student_in=student_in
    )
    return student


@router.delete("/{id}", response_model=Message)
def delete_student(session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete a student.
    """
    student = crud.delete_student(session=session, student_id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return Message(message="Student deleted successfully")
