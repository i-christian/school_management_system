# Development workflow

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Local development setup
Set up postgresql as follows:

#### Log in to PostgreSQL as a Superuser
- ```sudo -u postgres psql```

#### Create the User
- Example: 
  ```
  CREATE USER myuser WITH PASSWORD 'mypass';
  ```

#### Give the user permission to create databases
- ```ALTER USER myuser WITH CREATEDB;```

#### create the database 
- ```
  createdb -U myuser -h localhost school_app
  ```

#### log into the database
- ```
  psql -Umyuser -hlocalhost school_app
  ```

#### Ensure that the user `myuser` has sufficient privileges on the database
- ```
  GRANT ALL PRIVILEGES ON DATABASE school_app TO myuser;
  ```

#### Migrations 
  - ```
    cd internal/server/sql/schema
    ```
Add SQL tables to migration files eg `001_user.sql` && run to create the defined tables: 
  - ```
    goose postgres postgres://myuser:mypass@localhost/school_app up
    ```

This can be reversed using:
- ```
  goose postgres postgres://myuser:mypass@localhost/school_app down
  ```

## Secret key hash generation
- Run the following command to generate the `SECRET_KEY`
```
  openssl rand -hex 32
```

## Running the application using MakeFile

Run build make command with tests
```bash
make all
```

Build the application
```bash
make build
```

Run the application
```bash
make run
```
Create DB container
```bash
make docker-run
```

Shutdown DB Container
```bash
make docker-down
```

DB Integrations Test:
```bash
make itest
```

Live reload the application:
```bash
make watch
```

Run the test suite:
```bash
make test
```

Clean up binary from the last build:
```bash
make clean
```
