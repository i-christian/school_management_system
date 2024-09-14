import random
import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app import crud
from app.core.config import settings
from app.models import Student, StudentCreate
from app.tests.utils.utils import random_lower_string


def test_get_students(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    student_in = StudentCreate(
        first_name=random_lower_string(),
        middle_name=random_lower_string(),
        last_name=random_lower_string(),
        contact=f"12345{random.randint(10000, 99999)}",
        form_id=uuid.uuid4(),
        fees=500000.0,
        class_teacher_remark=random_lower_string(),
        head_teacher_remark=random_lower_string(),
    )
    crud.create_student(session=db, student_in=student_in, owner_id=uuid.uuid4())

    # Request to get all students
    r = client.get(f"{settings.API_V1_STR}/students/", headers=superuser_token_headers)
    assert 200 <= r.status_code < 300
    students = r.json()
    assert "data" in students
    assert len(students["data"]) > 0


# Test for creating a new student
def test_create_student(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "first_name": random_lower_string(),
        "middle_name": random_lower_string(),
        "last_name": random_lower_string(),
        "contact": f"12345{random.randint(10000, 99999)}",
        "form_id": uuid.uuid4(),
        "fees": 500000.0,
        "class_teacher_remark": random_lower_string(),
        "head_teacher_remark": random_lower_string(),
    }
    r = client.post(
        f"{settings.API_V1_STR}/students/", headers=superuser_token_headers, json=data
    )
    assert 200 <= r.status_code < 300
    created_student = r.json()
    assert created_student["first_name"] == data["first_name"]


# Test for retrieving a specific student by ID
def test_get_student_by_id(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    # Create a new student
    student_in = StudentCreate(
        first_name=random_lower_string(),
        middle_name=random_lower_string(),
        last_name=random_lower_string(),
        contact=f"12345{random.randint(10000, 99999)}",
        form_id=uuid.uuid4(),
        fees=500000.0,
        class_teacher_remark=random_lower_string(),
        head_teacher_remark=random_lower_string(),
    )
    student = crud.create_student(
        session=db, student_in=student_in, owner_id=uuid.uuid4()
    )

    # Get student by ID
    r = client.get(
        f"{settings.API_V1_STR}/students/{student.id}", headers=superuser_token_headers
    )
    assert 200 <= r.status_code < 300
    api_student = r.json()
    assert api_student["id"] == str(student.id)


# Test for updating a student
def test_update_student(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    # Create a new student
    student_in = StudentCreate(
        first_name=random_lower_string(),
        middle_name=random_lower_string(),
        last_name=random_lower_string(),
        contact=f"12345{random.randint(10000, 99999)}",
        form_id=uuid.uuid4(),
        fees=500000.0,
        class_teacher_remark=random_lower_string(),
        head_teacher_remark=random_lower_string(),
    )
    student = crud.create_student(
        session=db, student_in=student_in, owner_id=uuid.uuid4()
    )

    # Update student's last name
    updated_data = {"last_name": "UpdatedLastName"}
    r = client.put(
        f"{settings.API_V1_STR}/students/{student.id}",
        headers=superuser_token_headers,
        json=updated_data,
    )
    assert r.status_code == 200
    updated_student = r.json()
    assert updated_student["last_name"] == "UpdatedLastName"


# Test for deleting a student
def test_delete_student(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    # Create a new student
    student_in = StudentCreate(
        first_name=random_lower_string(),
        middle_name=random_lower_string(),
        last_name=random_lower_string(),
        contact=f"12345{random.randint(10000, 99999)}",
        form_id=uuid.uuid4(),
        fees=500000.0,
        class_teacher_remark=random_lower_string(),
        head_teacher_remark=random_lower_string(),
    )
    student = crud.create_student(
        session=db, student_in=student_in, owner_id=uuid.uuid4()
    )

    # Delete the student
    r = client.delete(
        f"{settings.API_V1_STR}/students/{student.id}", headers=superuser_token_headers
    )
    assert r.status_code == 200
    response = r.json()
    assert response["message"] == "Student deleted successfully"

    # Verify the student is deleted
    student_query = select(Student).where(Student.id == student.id)
    deleted_student = db.exec(student_query).first()
    assert deleted_student is None
