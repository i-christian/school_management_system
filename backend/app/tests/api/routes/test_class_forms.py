import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.tests.utils.class_form import create_test_class_form


def test_create_class_form(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "name": "Form 2B",
    }

    response = client.post(
        f"{settings.API_V1_STR}/class-forms",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"

    content = response.json()
    assert content["name"] == data["name"]
    assert "id" in content


def test_read_class_forms(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_test_class_form(db)

    response = client.get(
        f"{settings.API_V1_STR}/class-forms",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "data" in content
    assert isinstance(content["data"], list)
    assert "count" in content


def test_read_class_form_by_id(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    class_form = create_test_class_form(db)

    response = client.get(
        f"{settings.API_V1_STR}/class-forms/{class_form.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["id"] == str(class_form.id)
    assert content["name"] == class_form.name


def test_update_class_form(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    class_form = create_test_class_form(db)

    update_data = {
        "name": "Updated Form 3B",
    }

    response = client.put(
        f"{settings.API_V1_STR}/class-forms/{class_form.id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["name"] == update_data["name"]


def test_delete_class_form(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    class_form = create_test_class_form(db)

    response = client.delete(
        f"{settings.API_V1_STR}/class-forms/{class_form.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["message"] == "Class Form deleted successfully"

    response = client.get(
        f"{settings.API_V1_STR}/class-forms/{class_form.id}",
        headers=superuser_token_headers,
    )
    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Class Form not found"


def test_create_class_form_missing_data(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.post(
        f"{settings.API_V1_STR}/class-forms",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 422
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "detail" in content


def test_create_class_form_invalid_data(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "name": 12345,
    }

    response = client.post(
        f"{settings.API_V1_STR}/class-forms",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 422
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "detail" in content
    assert "name" in content["detail"][0]["loc"]


def test_read_class_form_by_invalid_id(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_id = uuid.uuid4()

    response = client.get(
        f"{settings.API_V1_STR}/class-forms/{invalid_id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Class Form not found"


def test_update_class_form_invalid_data(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    class_form = create_test_class_form(db)

    update_data = {
        "name": 67890,
    }

    response = client.put(
        f"{settings.API_V1_STR}/class-forms/{class_form.id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 422
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "detail" in content
    assert "name" in content["detail"][0]["loc"]


def test_update_class_form_non_existent_id(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_id = uuid.uuid4()

    update_data = {
        "name": "Updated Form",
    }

    response = client.put(
        f"{settings.API_V1_STR}/class-forms/{invalid_id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Class Form not found"


def test_delete_class_form_non_existent_id(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_id = uuid.uuid4()

    response = client.delete(
        f"{settings.API_V1_STR}/class-forms/{invalid_id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Class Form not found"
