import uuid
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on user creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


# Properties to receive via API on user registration
class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on user update
class UserUpdate(UserBase):
    email: EmailStr = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model for users
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    students: list["Student"] = Relationship(
        back_populates="owner", cascade_delete=True
    )
    assignments: list["Assignment"] = Relationship(back_populates="teacher")


# Properties to return via API for users
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties for students
class StudentBase(SQLModel):
    first_name: str = Field(min_length=2, max_length=255)
    last_name: str = Field(min_length=2, max_length=255)
    form_id: uuid.UUID = Field(foreign_key="classform.id")


# Properties to receive via API on student creation
class StudentCreate(StudentBase):
    pass


# Properties to receive via API on student update
class StudentUpdate(StudentBase):
    first_name: str = Field(default=None, min_length=2, max_length=255)
    last_name: str = Field(default=None, min_length=2, max_length=255)
    form_id: uuid.UUID = Field(default=None)


# Database model for students
class Student(StudentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="students")
    grades: list["Grade"] = Relationship(back_populates="student")
    form_id: uuid.UUID = Field(foreign_key="classform.id", nullable=False)
    form: "ClassForm" = Relationship(back_populates="students")


# Properties to return via API for students
class StudentPublic(StudentBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class StudentsPublic(SQLModel):
    data: list[StudentPublic]
    count: int


# Database model for grades
class Grade(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    student_id: uuid.UUID = Field(foreign_key="student.id", nullable=False)
    subject_id: uuid.UUID = Field(foreign_key="subject.id", nullable=False)
    score: float = Field(ge=0, le=100)  # Assuming score is a percentage

    student: Student | None = Relationship(back_populates="grades")
    subject: Optional["Subject"] = Relationship(back_populates="grades")


# Shared properties for grades
class GradeBase(SQLModel):
    student_id: uuid.UUID
    subject_id: uuid.UUID
    score: float = Field(ge=0, le=100)


# Properties to receive via API on grade creation
class GradeCreate(GradeBase):
    pass


# Properties to receive via API on grade update
class GradeUpdate(GradeBase):
    score: float = Field(default=None, ge=0, le=100)


class GradePublic(GradeBase):
    id: uuid.UUID


class GradesPublic(SQLModel):
    data: list[GradePublic]
    count: int


# Shared properties for subjects
class SubjectBase(SQLModel):
    name: str = Field(max_length=255)


# Properties to receive via API on subject creation
class SubjectCreate(SubjectBase):
    pass


# Properties to receive via API on subject update
class SubjectUpdate(SubjectBase):
    name: str = Field(default=None, max_length=255)


# Database model for subjects
class Subject(SubjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    grades: list[Grade] = Relationship(back_populates="subject")
    assignments: list["Assignment"] = Relationship(back_populates="subject")


# Properties to return via API for subjects
class SubjectPublic(SubjectBase):
    id: uuid.UUID


class SubjectsPublic(SQLModel):
    data: list[SubjectPublic]
    count: int


# Database model for class forms
class ClassForm(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=255)
    students: list[Student] = Relationship(back_populates="form")
    assignments: list["Assignment"] = Relationship(back_populates="class_form")


# Shared properties for class forms
class ClassFormBase(SQLModel):
    name: str = Field(max_length=255)


# Properties to receive via API on class form creation
class ClassFormCreate(ClassFormBase):
    pass


# Properties to receive via API on class form update
class ClassFormUpdate(ClassFormBase):
    name: str = Field(default=None, max_length=255)


class ClassFormPublic(ClassFormBase):
    id: uuid.UUID


class ClassFormsPublic(SQLModel):
    data: list[ClassFormPublic]
    count: int


# Shared properties for assignments
class AssignmentBase(SQLModel):
    teacher_id: uuid.UUID = Field(foreign_key="user.id")
    subject_id: uuid.UUID = Field(foreign_key="subject.id")
    class_form_id: uuid.UUID = Field(foreign_key="classform.id")


# Properties to receive via API on assignment creation
class AssignmentCreate(AssignmentBase):
    pass


# Properties to receive via API on assignment update
class AssignmentUpdate(AssignmentBase):
    teacher_id: uuid.UUID = Field(default=None)
    subject_id: uuid.UUID = Field(default=None)
    class_form_id: uuid.UUID = Field(default=None)


# Database model for assignments
class Assignment(AssignmentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    teacher: User | None = Relationship(back_populates="assignments")
    subject: Subject | None = Relationship(back_populates="assignments")
    class_form: ClassForm | None = Relationship(back_populates="assignments")


# Properties to return via API for assignments
class AssignmentPublic(AssignmentBase):
    id: uuid.UUID


class AssignmentsPublic(SQLModel):
    data: list[AssignmentPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
