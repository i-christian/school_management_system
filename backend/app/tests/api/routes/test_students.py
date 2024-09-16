import uuid

from fastapi.testclient import TestClient

# from sqlmodel import Session
from app.core.config import settings
from app.models import StudentCreate

# from app.tests.utils.student import create_test_student


def test_create_student(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = StudentCreate(
        first_name="Test",
        middle_name="Middle",
        last_name="Student",
        contact="123456789",
        form_id=uuid.uuid4(),
        fees=500.0,
        class_teacher_remark="Good",
        head_teacher_remark="Needs Improvement",
    )

    response = client.post(
        f"{settings.API_V1_STR}/students", headers=superuser_token_headers, json=data
    )

    assert response.status_code == 200
    content = response.json()
    assert content["first_name"] == data.first_name
    assert content["last_name"] == data.last_name
    assert "id" in content
    assert "owner_id" in content
