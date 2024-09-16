from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import StudentCreate
from app.tests.utils.class_form import create_test_class_form

# from app.tests.utils.student import create_test_student


def test_create_student_with_mocked_uuid(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    form_name = create_test_class_form(db)
    data = StudentCreate(
        first_name="Test",
        middle_name="Middle",
        last_name="Student",
        contact="0123456789",
        form_id=form_name.id,
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
