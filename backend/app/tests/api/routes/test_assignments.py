import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.tests.utils.assignment import create_test_assignment
from app.tests.utils.class_form import create_test_class_form
from app.tests.utils.subject import create_test_subject
from app.tests.utils.user import create_random_user


def test_create_assignment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    teacher = create_random_user(db)
    subject = create_test_subject(db)
    class_form = create_test_class_form(db)

    data = {
        "teacher_id": str(teacher.id),
        "subject_id": str(subject.id),
        "class_form_id": str(class_form.id),
    }

    response = client.post(
        f"{settings.API_V1_STR}/assignments",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["teacher_id"] == data["teacher_id"]
    assert content["subject_id"] == data["subject_id"]
    assert content["class_form_id"] == data["class_form_id"]
    assert "id" in content


def test_read_assignments(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_test_assignment(db)

    response = client.get(
        f"{settings.API_V1_STR}/assignments",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert "data" in content
    assert isinstance(content["data"], list)
    assert "count" in content


def test_read_assignment_by_id(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    assignment = create_test_assignment(db)

    response = client.get(
        f"{settings.API_V1_STR}/assignments/{assignment.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["id"] == str(assignment.id)
    assert content["teacher_id"] == str(assignment.teacher_id)


def test_update_assignment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    assignment = create_test_assignment(db)

    new_teacher = create_random_user(db)
    update_data = {
        "teacher_id": str(new_teacher.id),
    }

    response = client.put(
        f"{settings.API_V1_STR}/assignments/{assignment.id}",
        headers=superuser_token_headers,
        json=update_data,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["teacher_id"] == update_data["teacher_id"]


def test_delete_assignment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    assignment = create_test_assignment(db)

    response = client.delete(
        f"{settings.API_V1_STR}/assignments/{assignment.id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["message"] == "Assignment deleted successfully"

    response = client.get(
        f"{settings.API_V1_STR}/assignments/{assignment.id}",
        headers=superuser_token_headers,
    )
    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Assignment not found"


def test_create_assignment_missing_fields(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    teacher = create_random_user(db)

    # Missing "subject_id" and "class_form_id"
    data = {
        "teacher_id": str(teacher.id),
    }

    response = client.post(
        f"{settings.API_V1_STR}/assignments",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 422
    ), f"Unexpected status code: {response.status_code}"


def test_create_assignment_non_existent_ids(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "teacher_id": str(uuid.uuid4()),
        "subject_id": str(uuid.uuid4()),
        "class_form_id": str(uuid.uuid4()),
    }

    response = client.post(
        f"{settings.API_V1_STR}/assignments",
        headers=superuser_token_headers,
        json=data,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Related entity not found"


def test_delete_non_existent_assignment(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    non_existent_id = str(uuid.uuid4())

    response = client.delete(
        f"{settings.API_V1_STR}/assignments/{non_existent_id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Assignment not found"


def test_read_assignment_by_non_existent_id(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    non_existent_id = str(uuid.uuid4())

    response = client.get(
        f"{settings.API_V1_STR}/assignments/{non_existent_id}",
        headers=superuser_token_headers,
    )

    assert (
        response.status_code == 404
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Assignment not found"


def test_create_duplicate_assignment(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    teacher = create_random_user(db)
    subject = create_test_subject(db)
    class_form = create_test_class_form(db)

    data = {
        "teacher_id": str(teacher.id),
        "subject_id": str(subject.id),
        "class_form_id": str(class_form.id),
    }

    response = client.post(
        f"{settings.API_V1_STR}/assignments",
        headers=superuser_token_headers,
        json=data,
    )
    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}"

    response = client.post(
        f"{settings.API_V1_STR}/assignments",
        headers=superuser_token_headers,
        json=data,
    )
    assert (
        response.status_code == 409
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Assignment already exists"


def test_create_assignment_unauthorized(client: TestClient, db: Session) -> None:
    teacher = create_random_user(db)
    subject = create_test_subject(db)
    class_form = create_test_class_form(db)

    data = {
        "teacher_id": str(teacher.id),
        "subject_id": str(subject.id),
        "class_form_id": str(class_form.id),
    }

    response = client.post(
        f"{settings.API_V1_STR}/assignments",
        headers={},
        json=data,
    )

    assert (
        response.status_code == 401
    ), f"Unexpected status code: {response.status_code}"
    content = response.json()
    assert content["detail"] == "Not authenticated"
