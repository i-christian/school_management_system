import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import SessionDep
from app.models import (
    ClassForm,
    ClassFormCreate,
    ClassFormPublic,
    ClassFormsPublic,
    ClassFormUpdate,
    Message,
)

router = APIRouter()


@router.get("/", response_model=ClassFormsPublic)
def read_class_forms(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve class forms (forms 1, 2, 3, 4).
    """
    count_statement = select(func.count()).select_from(ClassForm)
    count = session.exec(count_statement).one()
    statement = select(ClassForm).offset(skip).limit(limit)
    class_forms = session.exec(statement).all()
    return ClassFormsPublic(data=class_forms, count=count)


@router.get("/{id}", response_model=ClassFormPublic)
def read_class_form(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get class form by ID.
    """
    class_form = session.get(ClassForm, id)
    if not class_form:
        raise HTTPException(status_code=404, detail="Class Form not found")
    return class_form


@router.post("/", response_model=ClassFormPublic)
def create_class_form(*, session: SessionDep, class_form_in: ClassFormCreate) -> Any:
    """
    Create new class form.
    """
    class_form = crud.create_class_form(session=session, class_form_in=class_form_in)
    return class_form


@router.put("/{id}", response_model=ClassFormPublic)
def update_class_form(
    *, session: SessionDep, id: uuid.UUID, class_form_in: ClassFormUpdate
) -> Any:
    """
    Update a class form.
    """
    class_form = session.get(ClassForm, id)
    if not class_form:
        raise HTTPException(status_code=404, detail="Class Form not found")
    class_form = crud.update_class_form(
        session=session, db_class_form=class_form, class_form_in=class_form_in
    )
    return class_form


@router.delete("/{id}", response_model=Message)
def delete_class_form(*, session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete a class form.
    """
    class_form = crud.delete_class_form(session=session, class_form_id=id)
    if not class_form:
        raise HTTPException(status_code=404, detail="Class Form not found")
    return Message(message="Class Form deleted successfully")
