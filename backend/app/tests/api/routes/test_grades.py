from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.tests.utils.grade import create_test_grade
from app.tests.utils.student import create_test_student
from app.tests.utils.subject import create_test_subject


def test_create_grade(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    student = create_test_student(db)
    subject = create_test_subject(db)

    data = {
        "student_id": str(student.id),
        "subject_id": str(subject.id),
        "score": 90,
        "remark": "Excellent performance",
    }

    response = client.post(
        f"{settings.API_V1_STR}/grades",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["student_id"] == data["student_id"]
    assert content["subject_id"] == data["subject_id"]
    assert content["score"] == data["score"]
    assert "id" in content

    duplicate_response = client.post(
        f"{settings.API_V1_STR}/grades",
        headers=superuser_token_headers,
        json=data,
    )

    assert duplicate_response.status_code == 200
    updated_grade = duplicate_response.json()
    assert updated_grade["score"] == data["score"]
    assert updated_grade["id"] == content["id"]


def test_read_grades(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_test_grade(db)

    response = client.get(
        f"{settings.API_V1_STR}/grades",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "data" in content
    assert isinstance(content["data"], list)
    assert "count" in content
    assert content["count"] > 0


def test_read_grade_by_id(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    grade = create_test_grade(db)

    response = client.get(
        f"{settings.API_V1_STR}/grades/{grade.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["id"] == str(grade.id)
    assert content["student_id"] == str(grade.student_id)


def test_update_grade(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    grade = create_test_grade(db)

    update_data = {"score": 95, "remark": "Updated remark"}

    response = client.put(
        f"{settings.API_V1_STR}/grades/{grade.id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["score"] == update_data["score"]
    assert content["remark"] == update_data["remark"]


def test_delete_grade(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    grade = create_test_grade(db)

    response = client.delete(
        f"{settings.API_V1_STR}/grades/{grade.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["message"] == "Grade deleted successfully"

    response = client.get(
        f"{settings.API_V1_STR}/grades/{grade.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Grade not found"
