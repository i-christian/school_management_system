import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.tests.utils.student import create_random_student


def test_create_student(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"first_name": "Naruto", "last_name": "Uzumaki"}
    response = client.post(
        f"{settings.API_V1_STR}/students/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["first_name"] == data["first_name"]
    assert content["last_name"] == data["last_name"]
    assert "id" in content
    assert "owner_id" in content


def test_read_student(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    student = create_random_student(db)
    response = client.get(
        f"{settings.API_V1_STR}/students/{student.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["first_name"] == student.first_name
    assert content["last_name"] == student.last_name
    assert content["id"] == str(student.id)
    assert content["owner_id"] == str(student.owner_id)


def test_read_student_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/students/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Student not found"


def test_read_student_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    student = create_random_student(db)
    response = client.get(
        f"{settings.API_V1_STR}/students/{student.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"


def test_read_students(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_student(db)
    create_random_student(db)
    response = client.get(
        f"{settings.API_V1_STR}/students/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2


def test_update_student(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    student = create_random_student(db)
    data = {"first_name": "Updated first_name", "last_name": "Updated last_name"}
    response = client.put(
        f"{settings.API_V1_STR}/students/{student.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["first_name"] == data["first_name"]
    assert content["last_name"] == data["last_name"]
    assert content["id"] == str(student.id)
    assert content["owner_id"] == str(student.owner_id)


def test_update_student_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"first_name": "Updated first_name", "last_name": "Updated last_name"}
    response = client.put(
        f"{settings.API_V1_STR}/students/{uuid.uuid4()}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Student not found"


def test_update_student_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    student = create_random_student(db)
    data = {"first_name": "Updated first_name", "last_name": "Updated last_name"}
    response = client.put(
        f"{settings.API_V1_STR}/students/{student.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"


def test_delete_student(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    student = create_random_student(db)
    response = client.delete(
        f"{settings.API_V1_STR}/students/{student.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Student deleted successfully"


def test_delete_student_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/students/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Student not found"


def test_delete_student_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    student = create_random_student(db)
    response = client.delete(
        f"{settings.API_V1_STR}/students/{student.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"
