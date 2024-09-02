import uuid
from typing import Any

from sqlalchemy.orm import Session
from sqlmodel import select

from app.core.security import get_password_hash, verify_password
from app.models import (
    Assignment,
    AssignmentCreate,
    AssignmentUpdate,
    ClassForm,
    ClassFormCreate,
    ClassFormUpdate,
    Grade,
    GradeCreate,
    GradeUpdate,
    Student,
    StudentCreate,
    StudentUpdate,
    Subject,
    SubjectCreate,
    SubjectUpdate,
    User,
    UserCreate,
    UserUpdate,
)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_user = User(
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=get_password_hash(user_create.password),
        is_active=user_create.is_active,
        is_superuser=user_create.is_superuser,
        is_class_teacher=user_create.is_class_teacher,
        is_accountant=user_create.is_accountant,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def delete_user(*, session: Session, user_id: uuid.UUID) -> User | None:
    db_user = session.get(User, user_id)
    if db_user:
        session.delete(db_user)
        session.commit()
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_student(
    *, session: Session, student_in: StudentCreate, owner_id: uuid.UUID
) -> Student:
    db_student = Student(
        first_name=student_in.first_name,
        middle_name=student_in.middle_name,
        last_name=student_in.last_name,
        contact=student_in.contact,
        form_id=student_in.form_id,
        fees=student_in.fees,
        owner_id=owner_id,
    )
    session.add(db_student)
    session.commit()
    session.refresh(db_student)
    return db_student


def update_student(
    session: Session, db_student: Student, student_in: StudentUpdate
) -> Student:
    if student_in.first_name:
        db_student.first_name = student_in.first_name
    if student_in.last_name:
        db_student.last_name = student_in.last_name
    if student_in.middle_name:
        db_student.middle_name = student_in.middle_name
    if student_in.contact:
        db_student.contact = student_in.contact
    if student_in.form_id:
        db_student.form_id = student_in.form_id
    if student_in.fees:
        db_student.fees = student_in.fees

    session.commit()
    session.refresh(db_student)
    return db_student


def delete_student(session: Session, student_id: uuid.UUID) -> Student | None:
    db_student = session.get(Student, student_id)
    if db_student:
        session.delete(db_student)
        session.commit()
    return db_student


def create_grade(session: Session, grade_in: GradeCreate) -> Grade:
    db_grade = Grade(
        student_id=grade_in.student_id,
        subject_id=grade_in.subject_id,
        score=grade_in.score,
    )
    session.add(db_grade)
    session.commit()
    session.refresh(db_grade)
    return db_grade


def update_grade(session: Session, db_grade: Grade, grade_in: GradeUpdate) -> Grade:
    if grade_in.score is not None:
        db_grade.score = grade_in.score
    session.commit()
    session.refresh(db_grade)
    return db_grade


def delete_grade(session: Session, grade_id: uuid.UUID) -> Grade | None:
    db_grade = session.get(Grade, grade_id)
    if db_grade:
        session.delete(db_grade)
        session.commit()
    return db_grade


def create_subject(session: Session, subject_in: SubjectCreate) -> Subject:
    db_subject = Subject(name=subject_in.name)
    session.add(db_subject)
    session.commit()
    session.refresh(db_subject)
    return db_subject


def update_subject(
    session: Session, db_subject: Subject, subject_in: SubjectUpdate
) -> Subject:
    if subject_in.name:
        db_subject.name = subject_in.name
    session.commit()
    session.refresh(db_subject)
    return db_subject


def delete_subject(session: Session, subject_id: uuid.UUID) -> Subject | None:
    db_subject = session.get(Subject, subject_id)
    if db_subject:
        session.delete(db_subject)
        session.commit()
    return db_subject


def create_class_form(session: Session, class_form_in: ClassFormCreate) -> ClassForm:
    db_class_form = ClassForm(name=class_form_in.name)
    session.add(db_class_form)
    session.commit()
    session.refresh(db_class_form)
    return db_class_form


def update_class_form(
    session: Session, db_class_form: ClassForm, class_form_in: ClassFormUpdate
) -> ClassForm:
    if class_form_in.name:
        db_class_form.name = class_form_in.name
    session.commit()
    session.refresh(db_class_form)
    return db_class_form


def delete_class_form(session: Session, class_form_id: uuid.UUID) -> ClassForm | None:
    db_class_form = session.get(ClassForm, class_form_id)
    if db_class_form:
        session.delete(db_class_form)
        session.commit()
    return db_class_form


def create_assignment(session: Session, assignment_in: AssignmentCreate) -> Assignment:
    db_assignment = Assignment(
        teacher_id=assignment_in.teacher_id,
        subject_id=assignment_in.subject_id,
        class_form_id=assignment_in.class_form_id,
    )
    session.add(db_assignment)
    session.commit()
    session.refresh(db_assignment)
    return db_assignment


def update_assignment(
    session: Session, db_assignment: Assignment, assignment_in: AssignmentUpdate
) -> Assignment:
    if assignment_in.teacher_id:
        db_assignment.teacher_id = assignment_in.teacher_id
    if assignment_in.subject_id:
        db_assignment.subject_id = assignment_in.subject_id
    if assignment_in.class_form_id:
        db_assignment.class_form_id = assignment_in.class_form_id
    session.commit()
    session.refresh(db_assignment)
    return db_assignment


def delete_assignment(session: Session, assignment_id: uuid.UUID) -> Assignment | None:
    db_assignment = session.get(Assignment, assignment_id)
    if db_assignment:
        session.delete(db_assignment)
        session.commit()
    return db_assignment
