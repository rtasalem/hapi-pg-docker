# Hapi.js + PostgreSQL + Docker
## Background
This repo was initially created as practice for learning to Dockerise both a Hapi.js server & PostgreSQL database. The server was set up to allow for communication with the database and enable read/write functionality. Now this project is used for implementing different technologies and methods used at work.
## Libraries & Technologies
- [Docker](https://docs.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/en)
- [Hapi.js](https://hapi.dev/)
- [PostgreSQL](https://www.postgresql.org/) ([pgAdmin 4](https://www.pgadmin.org/) for database management)
- [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview)
## Documentation
[In-depth documentation](https://github.com/rtasalem/hapi-pg-docker/blob/main/DOCS.md) has been completed in the form of a comprehensive write-up.
## Learning Milestones
- Setting up a simple server using [Hapi.js](https://hapi.dev/tutorials/gettingstarted/?lang=en_US).
- [Configuring a Dockerfile](https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/) for a Node.js environment.
- Defining a Hapi.js server & PostgreSQL database using Docker Compose.
- Establishing a connection to a PostgreSQL database using the [node-postgres NPM package](https://www.npmjs.com/package/pg).
- Saving messages sent through a node application to a Service Bus queue and topic.
- Saving messages sent via Service Bus queue to a postgres database.
## Getting Started
- Run `docker compose up --build`.
- Confirm the server is running on `localhost:3001` and the message `Hello World!` is visible. Alternatively check Docker Desktop to ensure the container is running.
- To ensure connection to the database is successful, navigate into the `app` directory and run `node database`. Note if an empty array is returned, the connection was successful, there is just no existing data to be returned. Use the queries to insert, update, and delete data.
- Once set up locally, `docker compose down` and `docker compose up` can be used to stop and start the container respectively.
