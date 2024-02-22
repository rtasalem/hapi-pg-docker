# Docs
## Project Initialisation
Create and open a new project/repo. In the terminal (ensure you are in the project directory), run `npm init`. Select the default options. If working from a GitHub repo, ensure to include a `.gitignore` (whether as a template from GitHub (specifically the Node template) or creating a custom one from [gitignore.io](https://www.toptal.com/developers/gitignore)). Once the project has been initialised, create a directory called `app` and create a file called `index.js` (This is the entry point for which your Node application will run your project, you will have seen this as one of the default options during initialisation).
## Set Up Hapi.js Server
In the `index.js` file, [set up a Hapi.js server](https://hapi.dev/tutorials/gettingstarted/?lang=en_US). Take note that the `host` should be set to `0.0.0.0` and *not* `localhost` so that it is accessible outside of the Docker container. Check that the server has been set up correctly through the following:
- Run `node index` via the terminal (ensure you are in the `app` directory).
- Open `localhost:<PORT>` in the terminal. The `<PORT>` should be replaced with whatever you set it to when creating the server. If the instructions for setting up a Hapi.js server were used then you should see `Hello World!` in the browser.
## Dockerise Node Application
To assemble the image that will make up the Node environment of the application, [create a Dockerfile in the root directory](https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/). The Dockerfile must include the following:
- The base image `FROM` Docker that will be used for the application (`FROM node:latest`).
- The creation of a `WORKDIR` that will act as the default location for commands set within the Dockerfile (`WORKDIR /app`).
- Ensure you `COPY` both the `package.json` and `package-lock.json` into the image. To accomplish this, two parameters need to be specified: the file to be copied and its destincation (`COPY package*.json ./`).
- Once the `package.json` and `package-lock.json` files have been copied into the root directory, the next step is to `RUN` the `npm install` command (`RUN npm install`).
- After the base image and dependencies are all set up/installed, we need to `COPY` the source code from the current directory into the image (`COPY . .`).
- The last step is to tell Docker what `CMD` to run once the image itself is running inside the container.
At the end, the Dockerfile will look like this:
```
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index"]
```
## Docker Compose Configuration
Within the `docker-compose.yaml` file, two `services` have been defined: the server (`hapi-server`) and database (`hapi-pg-docker-postgres`). The server will `build` the Docker image from the current directory (`.`) and will be exposed on port `3001`. Through Docker Compose, we specify that the server `depends_on` the PostgreSQL database provided by the service named `hapi-pg-docker-postgres`. To connect to the database, environment variables have been decarled including the database name (`POSTGRES_DB`), host (`POSTGRES_HOST`), username (`POSTGRES_USERNAME`), password (`POSTGRES_PASSWORD`), port (`POSTGRES_PORT`), and a schema name (`POSTGRES_SCHEMA_NAME`). By specifying the `volumes` under `hapi-server`, the current directory (and the source code) is mounted into the container.
<br><br>
The `hapi-pg-docker-postgres` service pulls the official PostgreSQL Docker image, exposing it on port `5432`. The necessary environment vairables for this service include the database name (`POSTGRES_DB`), username (`POSTGRES_USERNAME`), and a password (`POSTGRES_PASSWORD`). A volume is mounted to ensure that the data from the database persists regardless of whether the container is stopped or removed. Overall, the Docker Compose configuration sets up a development environment for a Hapi.js server application with a PostgreSQL database, allowing for easy management and deployment of both services.
## Establish PostgreSQL Database Connection
- write instructions for accessing pg db from terminal (docker exec, psql, create table, insert into etc.)
- mention npm install pg (node-postgres)
- dicuss setup of queries