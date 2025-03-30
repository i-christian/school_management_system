# Deployment

You can deploy the project using Docker Compose to a remote server.

You can use CI/CD (continuous integration and continuous deployment) systems to deploy automatically, there are already configurations to do it with GitHub Actions.

But you have to configure a couple things first. 🤓

## Preparation

* Have a remote server(vps) ready and available.
* Configure the DNS records of your domain to point to the IP of the server you just created.
* Configure a wildcard subdomain for your domain, so that you can have multiple subdomains for different services, e.g. `*.example.com`. This will be useful for accessing different components, like `adminer.example.com`, etc.
* Install and configure [Docker](https://docs.docker.com/engine/install/) on the remote server (Docker Engine, not Docker Desktop).

## Reverse Proxy
This application uses [Caddy](https://caddyserver.com/) as a reverse proxy, you can configure it using the `Caddyfile` on the root of the project.

## Deploy the Project
Configure these environment variables first before deployment.

* `RANDOM_HEX`: Used to generate the project secret key used to sign tokens
    - Run the following command to generate the `RANDOM_HEX`
        ```
          openssl rand -hex 32
        ```
* `PROJECT_NAME`: The name of the project.
* `PORT`: application port
* `DOMAIN`: The project domain record
* `SUPERUSER_EMAIL`: The email of the superuser, this superuser will be the one that can create new users.
* `SUPERUSER_PASSWORD`: The password of the first superuser.
* `SUPERUSER_ROLE`: Designate the role of the superuser. Should be `admin` for this project.
* `SUPERUSER_PHONE`: The phone number of the first superuser.
* `DB_HOST`: The hostname of the PostgreSQL server. You can leave the default provided by the same Docker Compose. You normally wouldn't need to change this unless you are using a third-party provider.
* `DB_PORT`: The port of the PostgreSQL server. You can leave the default. You normally wouldn't need to change this unless you are using a third-party provider.
* `DB_PASSWORD`: The Postgres password.
* `DB_USERNAME`: The Postgres user, you can leave the default.
* `DB_NAME`: The database name to use for this application. You can leave the default of `school_app`.
* `DB_SCHEMA`: The database search path usually `public`.
* `GOOSE_DRIVER`: The default database driver used in this case we are using postgres so it's `postgres`
* `GOOSE_MIGRATION_DIR`: The migration directory used by goose is already set in docker compose file as `sql/schema`
* `DOCKER_IMAGE`: To set the name of the application docker image, defaults to `school_manager`
* `TAG`: Defaults to `latest`


### Deploy with Docker Compose
With the environment variables in place, you can deploy with Docker Compose:

```bash
docker compose -f docker-compose.yml up -d
```

## Continuous Deployment (CD)

You can use GitHub Actions to deploy your project automatically. 😎

### Install GitHub Actions Runner

* On your remote server, create a user for your GitHub Actions:

```bash
sudo adduser github
```

* Add Docker permissions to the `github` user:

```bash
sudo usermod -aG docker github
```

* Temporarily switch to the `github` user:

```bash
sudo su - github
```

* Go to the `github` user's home directory:

```bash
cd
```

* [Install a GitHub Action self-hosted runner following the official guide](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners#adding-a-self-hosted-runner-to-a-repository).

* When asked about labels, add a label for the environment, e.g. `production`. You can also add labels later.

After installing, the guide would tell you to run a command to start the runner. Nevertheless, it would stop once you terminate that process or if your local connection to your server is lost.

To make sure it runs on startup and continues running, you can install it as a service. To do that, exit the `github` user and go back to the `root` user:

```bash
exit
```

After you do it, you will be on the previous user again. And you will be on the previous directory, belonging to that user.

Before being able to go the `github` user directory, you need to become the `root` user (you might already be):

```bash
sudo su
```

* As the `root` user, go to the `actions-runner` directory inside of the `github` user's home directory:

```bash
cd /home/github/actions-runner
```

* Install the self-hosted runner as a service with the user `github`:

```bash
./svc.sh install github
```

* Start the service:

```bash
./svc.sh start
```

* Check the status of the service:

```bash
./svc.sh status
```

You can read more about it in the official guide: [Configuring the self-hosted runner application as a service](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service).

### Set Secrets

On your repository, configure secrets for the environment variables you need, the same ones described above, including `RANDOM_HEX`, etc. Follow the [official GitHub guide for setting repository secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).

The current Github Actions workflows expect these secrets:
* `ENV`
* `DOMAIN`
* `PROJECT_NAME`
* `PORT`
* `RANDOM_HEX`
* `SUPERUSER_ROLE`
* `SUPERUSER_EMAIL`
* `SUPERUSER_PHONE`
* `SUPERUSER_PASSWORD`
* `DB_HOST`
* `DB_NAME`
* `DB_PASSWORD`
* `DB_SCHEMA`
* `TAG`
* `GOOSE_DRIVER`
* `GOOSE_MIGRATION_DIR`

## GitHub Action Deployment Workflows

There is GitHub Action workflows in the `.github/workflows` directory already configured for deploying to the environments (GitHub Actions runners with the labels):

* `production`: after publishing a release.

If you need to add extra environments you could use those as a starting point.

## URLs

Replace `example.com` with your domain.
