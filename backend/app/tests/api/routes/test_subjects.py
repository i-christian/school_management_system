import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.tests.utils.subject import create_test_subject


def test_create_subject(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "name": "Science",
    }

    response = client.post(
        f"{settings.API_V1_STR}/subjects",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["name"] == data["name"]
    assert "id" in content


def test_read_subjects(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_test_subject(db)

    response = client.get(
        f"{settings.API_V1_STR}/subjects",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "data" in content
    assert isinstance(content["data"], list)
    assert "count" in content


def test_read_subject_by_id(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    subject = create_test_subject(db)

    response = client.get(
        f"{settings.API_V1_STR}/subjects/{subject.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["id"] == str(subject.id)
    assert content["name"] == subject.name


def test_update_subject(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    subject = create_test_subject(db)

    update_data = {
        "name": "Updated Science",
    }

    response = client.put(
        f"{settings.API_V1_STR}/subjects/{subject.id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["name"] == update_data["name"]


def test_delete_subject(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    subject = create_test_subject(db)

    response = client.delete(
        f"{settings.API_V1_STR}/subjects/{subject.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["message"] == "Subject deleted successfully"

    response = client.get(
        f"{settings.API_V1_STR}/subjects/{subject.id}",
        headers=superuser_token_headers,
    )
    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Subject not found"


def test_create_subject_missing_data(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.post(
        f"{settings.API_V1_STR}/subjects",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 422
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "detail" in content


def test_create_subject_invalid_data(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "name": 12345,
    }

    response = client.post(
        f"{settings.API_V1_STR}/subjects",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 422
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "detail" in content


def test_read_subject_by_invalid_id(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_id = uuid.uuid4()

    response = client.get(
        f"{settings.API_V1_STR}/subjects/{invalid_id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Subject not found"


def test_update_subject_invalid_data(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    subject = create_test_subject(db)

    update_data = {
        "name": 67890,  # Invalid type for 'name'
    }

    response = client.put(
        f"{settings.API_V1_STR}/subjects/{subject.id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 422
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "detail" in content


def test_update_subject_non_existent_id(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_id = uuid.uuid4()

    update_data = {
        "name": "Updated Subject",
    }

    response = client.put(
        f"{settings.API_V1_STR}/subjects/{invalid_id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Subject not found"


def test_delete_subject_non_existent_id(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    invalid_id = uuid.uuid4()

    response = client.delete(
        f"{settings.API_V1_STR}/subjects/{invalid_id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Subject not found"
