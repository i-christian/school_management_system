from fastapi import APIRouter

from app.api.routes import (
    assignments,
    class_forms,
    grades,
    login,
    students,
    subjects,
    users,
    utils,
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(grades.router, prefix="/grades", tags=["grades"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(
    class_forms.router, prefix="/class-forms", tags=["class-forms"]
)
api_router.include_router(
    assignments.router, prefix="/assignments", tags=["assignments"]
)
