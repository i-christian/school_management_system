import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

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
def read_students(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve students.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Student)
        count = session.exec(count_statement).one()
        statement = select(Student).offset(skip).limit(limit)
        students = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Student)
            .where(Student.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Student)
            .where(Student.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        students = session.exec(statement).all()

    return StudentsPublic(data=students, count=count)


@router.get("/{id}", response_model=StudentPublic)
def read_student(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get student by ID.
    """
    student = session.get(Student, id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not current_user.is_superuser and (student.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return student


@router.post("/", response_model=StudentPublic)
def create_student(
    *, session: SessionDep, current_user: CurrentUser, student_in: StudentCreate
) -> Any:
    """
    Create new student.
    """
    student = Student.model_validate(student_in, update={"owner_id": current_user.id})
    session.add(student)
    session.commit()
    session.refresh(student)
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
    Update an student.
    """
    student = session.get(Student, id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not current_user.is_superuser and (student.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = student_in.model_dump(exclude_unset=True)
    student.sqlmodel_update(update_dict)
    session.add(student)
    session.commit()
    session.refresh(student)
    return student


@router.delete("/{id}")
def delete_student(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an student.
    """
    student = session.get(Student, id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not current_user.is_superuser and (student.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(student)
    session.commit()
    return Message(message="Student deleted successfully")
