# Development

Using localhost can be limiting, especially with cookie-related issues in browsers. Instead, you can use `localhost.tiangolo.com`, which points to `127.0.0.1` and allows cookies to function correctly

To launch the full stack app run the following command while in the directory which has `docker-compose.yml` files. This is the root of the project.

```bash
docker compose up -d
```

After that one should be able to open: http://localhost.tiangolo.com and it will be served by your stack in localhost

## NOTE:
Check all the corresponding available URLs in the section at the end.

## Docker Compose files and env vars

There is a main `docker-compose.yml` file with all the configurations that apply to the whole stack, it is used automatically by `docker compose`.

And there's also a `docker-compose.override.yml` with overrides for development, for example to mount the source code as a volume. It is used automatically by `docker compose` to apply overrides on top of `docker-compose.yml`.

These Docker Compose files use the `.env` file containing configurations to be injected as environment variables in the containers.

They also use some additional configurations taken from environment variables set in the scripts before calling the `docker compose` command.


## URLs

Development URLs, for local development.

Frontend: http://localhost.tiangolo.com

Backend: http://localhost.tiangolo.com/api/

Automatic Interactive Docs (Swagger UI): http://localhost.tiangolo.com/docs

Automatic Alternative Docs (ReDoc): http://localhost.tiangolo.com/redoc

Adminer: http://localhost.tiangolo.com:8080

Traefik UI: http://localhost.tiangolo.com:8090
