from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.tests.utils.class_form import create_test_class_form
from app.tests.utils.student import create_test_student


def test_create_student(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    class_form = create_test_class_form(db)
    assert class_form.id is not None

    data = {
        "first_name": "Boruto",
        "middle_name": "nng",
        "last_name": "Uzumaki",
        "contact": "0123456789",
        "form_id": str(class_form.id),
        "fees": 600000.00,
        "class_teacher_remark": "Good",
        "head_teacher_remark": "Needs Improvement",
    }

    response = client.post(
        f"{settings.API_V1_STR}/students",
        headers=superuser_token_headers,
        json=data,
    )

    print(response.json())
    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"

    content = response.json()
    assert content["first_name"] == data["first_name"]
    assert content["last_name"] == data["last_name"]
    assert content["form_id"] == data["form_id"]
    assert "id" in content
    assert "owner_id" in content


def test_read_students(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_test_student(db)

    response = client.get(
        f"{settings.API_V1_STR}/students",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "data" in content
    assert isinstance(content["data"], list)
    assert "count" in content
