# Hapi.js + PostgreSQL + Docker
## Background
This repo was created as practice for learning to Dockerise both a Hapi.js server & PostgreSQL database. The server was set up to allow for communication with the database and allow for read/write functionality. In-depth documentation of the entire project is also available.
## Libraries & Technologies
- [Docker](https://docs.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/en)
- [Hapi.js](https://hapi.dev/)
- [PostgreSQL](https://www.postgresql.org/) ([pgAdmin 4](https://www.pgadmin.org/) for database management)
## Learning Milestones
- Setting up a simple [Hapi.js server.](https://hapi.dev/tutorials/gettingstarted/?lang=en_US).
- [Configuring a Dockerfile for a Node.js environment.](https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/)
- Defining a Hapi.js server & PostgreSQL database using Docker Compose.
- Establishing a connection to a PostgreSQL database using the [node-postgres npm package](https://www.npmjs.com/package/pg).
## Getting Started
- Run `docker compose up --build` to build the image.
- Confirm the server is running on `localhost:3001` and the message `Hello World!` is visible.