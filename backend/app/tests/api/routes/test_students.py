import uuid
from unittest.mock import patch

from fastapi.testclient import TestClient

# from sqlmodel import Session
from app.core.config import settings
from app.models import StudentCreate

# from app.tests.utils.student import create_test_student


def test_create_student_with_mocked_uuid(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    mock_uuid = "123e4567-e89b-12d3-a456-426614174000"

    with patch("uuid.uuid4", return_value=uuid.UUID(mock_uuid)):
        data = StudentCreate(
            first_name="Test",
            middle_name="Middle",
            last_name="Student",
            contact="0123456789",
            form_id=mock_uuid,
            fees=500.0,
            class_teacher_remark="Good",
            head_teacher_remark="Needs Improvement",
        )

        response = client.post(
            f"{settings.API_V1_STR}/students",
            headers=superuser_token_headers,
            json=data.model_dump(),
        )

        assert (
            response.status_code == 200
        ), f"Unexpected status code: {response.status_code}"

        content = response.json()
        assert content["first_name"] == data.first_name
        assert content["last_name"] == data.last_name
        assert "id" in content
        assert "owner_id" in content
