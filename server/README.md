# Backend 

## Features

- FastAPI for building APIs
- Uvicorn as the ASGI server
- Poetry for dependency management

## Requirements

- Python 3.10+
- Poetry

## Installation
2. Install Poetry
If you don't have Poetry installed, you can install it using `pip`:
```
  pip3 install poetry
```

Alternatively, you can use the recommended installation method:
```
  curl -sSL https://install.python-poetry.org | python3 -
```

3. Install dependencies
Use Poetry to install the project dependencies:
```
  poetry install  
```

4. Activate the virtual environment
Activate the virtual environment created by Poetry:
```
  poetry shell
```

## Running the Application
To run the FastAPI application with Uvicorn, use the following command:
```
  uvicorn main:app --reload
```

This will start the server on `http://127.0.0.1:8000`

## Project Structure
```
  server/
  ├── main.py
  ├── pyproject.toml
  ├── poetry.lock
  └── README.md

```

- pyproject.toml: The file where project dependencies and settings are defined.
- poetry.lock: The file that locks the dependencies to specific versions

## Endpoints
## Adding Dependencies
To add a new dependency, use the following command:
```
  poetry add <package_name>
```

For development dependencies, use:
```
  poetry add --dev <package_name>
```
