# Docs

## Project Initialisation

Create and open a new project/repo. In the terminal (ensure you are in the project directory), run `npm init`. Select the default options. If working from a GitHub repo, ensure to include a `.gitignore` (whether as a template from GitHub (specifically the Node template) or creating a custom one from [gitignore.io](https://www.toptal.com/developers/gitignore)). Once the project has been initialised, create a directory called `app` and create a file called `index.js` (This is the entry point for which your Node application will run your project, you will have seen this as one of the default options during initialisation).

## Set Up Hapi.js Server

In the `index.js` file, [set up a Hapi.js server](https://hapi.dev/tutorials/gettingstarted/?lang=en_US). Take note that the `host` should be set to `0.0.0.0` and _not_ `localhost` so that it is accessible outside of the Docker container. Check that the server has been set up correctly through the following:

- Run `node index` (in the `app` directory).
- Open `localhost:<PORT>` in the browser. The `<PORT>` should be replaced with whatever you set it to when creating the server. If the instructions for setting up a Hapi.js server were used then you should see `Hello World!` in the browser.

## Dockerise Node Application

To assemble the image that will make up the Node environment of the application, [create a Dockerfile in the root directory](https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/). The Dockerfile must include the following:

- The base image `FROM` Docker that will be used for the application (`FROM node:latest`).
- The creation of a `WORKDIR` that will act as the default location for commands set within the Dockerfile (`WORKDIR /app`).
- Ensure you `COPY` both the `package.json` and `package-lock.json` into the image. To accomplish this, two parameters need to be specified: the file to be copied and its destincation (`COPY package*.json ./`).
- Once the `package.json` and `package-lock.json` files have been copied into the root directory, the next step is to `RUN` the `npm install` command (`RUN npm install`).
- After the base image and dependencies are all set up/installed, we need to `COPY` the source code from the current directory into the image (`COPY . .`).
- The last step is to tell Docker what `CMD` to run once the image itself is running inside the container (`CMD ["node", "index"]`).

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

Within the `docker-compose.yaml` file (created in the root directory), two `services` have been defined: the server (`hapi-server`) and database (`hapi-pg-docker-postgres`). The server will `build` the Docker image from the current directory (`.`) and will be exposed on port `3001`. Through Docker Compose, we specify that the server `depends_on` the PostgreSQL database provided by the service named `hapi-pg-docker-postgres`. To connect to the database, environment variables have been decarled including the database name (`POSTGRES_DB`), host (`POSTGRES_HOST`), username (`POSTGRES_USERNAME`), password (`POSTGRES_PASSWORD`), port (`POSTGRES_PORT`), and a schema name (`POSTGRES_SCHEMA_NAME`). By specifying the `volumes` under `hapi-server`, the current directory (and the source code) is mounted into the container.
<br><br>
The `hapi-pg-docker-postgres` service pulls the official PostgreSQL Docker image, exposing it on port `5432`. The necessary environment vairables for this service include the database name (`POSTGRES_DB`), username (`POSTGRES_USERNAME`), and a password (`POSTGRES_PASSWORD`). A volume is mounted to ensure that the data from the database persists regardless of whether the container is stopped or removed.

## Starting Up the Container

With Dockerfile and Docker Compose configured, run `docker compose up --build` to build the images and start the container(s). Ensure the containers are running via Docker Desktop or check `localhost:3001` via the browser is returning `Hello World!`. Ensure you run the containers from the root directory.

## Establish PostgreSQL Database Connection

### Accessing PostgreSQL via Terminal

Now that the Postgres database is set up and the containers are running, we'll need to create a database and at least one table. Via the terminal, run `docker exec -it <CONTAINER_ID> bash` (this will simulate a shell environment for the container). Replace `<CONTAINER_ID>` with the container's true ID (this can be found by running `docker ps`). Once shelled inside the container, run `psql -U <POSTGRES_USERNAME>` to access Postgres as a specific user. `<POSTGRES_USERNAME>` should be replaced with the username specified in the `docker-compose.yaml` file.
<br><br>
Below are the instructions for creating a database, connecting to the database, and creating a table inside of the database via the terminal:

1. Create a database:<br>
   `create database <database_name>;`
2. Connect to the database:<br>
   `\c <database_name>`
3. Create a table inside the database:

```
create table <table_name> (
  <primary_key> int not null,
  <column_name> varchar(250) not null
);
```

4. You can test the table has been properly create by inserting some dummy data.

### Adding Server on pgAdmin 4

_Note this section will specifically refer to pgAdmin 4 as a database management tool for Postgres._<br>
After [installing pgAdmin 4 locally](https://www.pgadmin.org/download/) and opening the application, navigate to the dashboard and select `Add New Server`. Any `Name` can be given to the server under the `General` tab. Under the `Connection` tab, enter `localhost` as the `Host name/address`, ensure the `Port` is set to the default value (`5432`), and enter the same password that was specified in the `docker-compose.yaml` file. Click `Save`. Navigate to the database you created earlier and the table(s) that were created for it. By right clicking on the table name you can view all the rows of existing data (if there is any). If successful, we now have our database visible on pgAdmin 4.

### Connecting Node App to Postgres

To connect the Node application with PostgreSQL, the [node-postgres NPM package needs to be installed](https://www.npmjs.com/package/pg) (`npm install pg`). Using the [official documentation](https://node-postgres.com/apis/client) for this package, a client connection can be configured so that queries can be made using Node.
<br><br>
Within the `app` directory, create a new file called `database.js`. Import `Client` from `pg` and create a client with all the connection information needed:

- The `host` will be `localhost` (this was specified in pgAdmin 4 when adding a new server).
- The `user` will take the same argument as the `POSTGRES_USERNAME` defined in the `docker-compose.yaml` file.
- Like `user`, the `password` will also take the same value as defined by Docker Compose.
- The `port` is the default Postgres port: `5432`.
- `database` will be the database name that was used when creating the database via the terminal.

Now that the client is set up, both the connection and queries can be written. The query takes the format of a variable containing the SQL statement as a string. This variable is then passed to the `client.query` method. A function named `handleQuery` can be found in the `database.js` folder, note that this does need to be passed into every instance of the `client.query` method.<br><br>
To check these queries are being made successfully, log them to the console and run `node database`.

## Sequelize Set-Up

[Sequelize](https://sequelize.org/) was used to connect to the existing database and create a new table (the first table I created didn't actually have a primary key, and since all SQL tables should have a primary key, I opted to create a new table with Sequelize rather than work with the existing table).
Install the [Sequelize NPM package](https://www.npmjs.com/package/sequelize):

```
npm i sequelize
```

To set up the connection to the database, a separate file was created: `sequelize.js`. Both `Sequelize` and `DataTypes` were imported from the NPM package. A Sequelize instance was created with the following variables: `dialect`, `host`, `port`, `username`, `password`, and `database`. Following this, a new model was defined (`Users`) and `DataTypes` is used to define the columns (e.g. `INTEGER`, `STRING` etc.).<br><br>
The only thing left to do is sync the new model with the database, create a variable that contains the SQL query (e.g. `findAll`), and log the output of the query to the console. It's also important to remember to close the connection (if this is needed). Note at this stage any queries made would be hardcoded.<br><br>
~~I did also set up a `.env` just to try and use environment variables, but I got back errors from both the node-postgres and Sequelize packages saying the password had to be a string (will need to come back and look into this more).~~ Setting up the environment variables via Docker Compose & a `.env` file was achieved, see the [Environment Variables](https://github.com/rtasalem/hapi-pg-docker/blob/main/DOCS.md#environment-variables) section for full details.

## Configure Asynchronous Routes in Server (Sequelize & node-postgres)

A route was configured so that the server could display data from the `Users` table through `localhost:3001/users`. The important thing to understand about this Sequelize set-up is that the port (`5432`) will never be able to connect properly to the server unless the host is given the correct value. When creating an instance of `Client` (node-postgres) or `Sequelize` the hose was mistakenly entered as `localhost`. In a Docker environment, `localhost` within a contianer refers to the container itself, not the host machine where Postgres is running. Therefore to solve the issue, the host name was changed to the service name (`hapi-pg-docker-postgres`) defined in the `docker-compose.yaml` file under `POSTGRES_HOST`. This enables Docker to resolve the service name to the correct IP address of the container running Postgres (i.e. the Hapi.js server can connect to the Postgres container). Keeping this in mind, it should be straight forward to set up a route: `/users`.

```
  server.route({
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      try {
        const allUsers = await User.findAll()
        return allUsers
      } catch (error) {
        console.error('Error fetching users:', error)
        return h.response('Internal Server Error').code(500)
      }
    }
  })
```

Additional routes were set up including `/messages`, `/messages/{id}`, `/users`, `/users/{id}`.

## Refactoring & Project Structure

Initially, all database instances and routes were written into one file, `index.js`. To tidy up the application, the entire project was broken down and refactored with the following structure:

```
hapi-pg-docker/
|   .gitignore
|   DOCS.md
|   Dockerfile
|   README.md
|   docker-compose.yaml
|   package-lock.json
|   package.json
|
└───app/
|   |
│   └───node-postgres/
|   |   |   database.js
|   |   |
|   └───routes/
|   |   |   get-messages.js
|   |   |   get-users.js
|   |   |   home.js
|   |   |
│   └───sequelize/
|   |   |   database.js
│   │   |
│   └───standalone-db-instances/
│   |   │   postgres.js
|   |   |   sequelize.js
|   |   |
|   └───index.js
```

Note the `standalone-db-instances` are just examples to understand how the `node-postgres` and `sequelize` NPM packages work. After starting the container, the commands `node postgres` and `node sequelize` can be run to see the output of the respective tables in the database (navigate to the `standalone-db-instances` directory beforehand).<br><br>
One thing to remember is _how_ you export modules so that they can be imported into other areas of your application. An error may be thrown saying that a module needs to be exported as an object. This means that you must incase the module within curly brackets (`{}`) when exporting e.g. `module.exports = { Users }`. It's good to know when this is and isn't needed.

## Environment Variables

While this project aims to set up a simplified server and database, I wanted to follow best practice and feed in any secrets/sensitive information using environment variables (this isn't the case within the `standalone-db-instances` directory*). I did this by setting up a `.env` file to supply the environment variables to Docker Compose and then to the application itself. ~~For this I installed the [Joi NPM package](https://www.npmjs.com/package/joi) to define the [schema](https://github.com/rtasalem/hapi-pg-docker/blob/main/app/schema.js). This `schema` module then just needs to be imported into both of the `database.js` files so that the environment variables can be set.~~ Update: the Joi NPM package was removed from the `package.json` and `package-lock.json` because the `standalone-db-instances` work just fine without it. This also means that I have deleted the `schema.js` file.<br><br>
Note that on line 15 and 19 of the [`docker-compose.yaml`](https://github.com/rtasalem/hapi-pg-docker/blob/main/docker-compose.yaml) file, the environment variables are written as `POSTGRES_HOST: "${POSTGRES_HOST:-hapi-pg-docker-postgres}"` and `POSTGRES_SCHEMA_NAME: "${POSTGRES_SCHEMA_NAME:-public}"`. The `:-` is there because if the value of this environment variable is not defined within the `.env` then it will default to using the value that's specified after the `:-` in the `docker-compose.yaml`.<br><br>
*When trying to feed the environment variables into `standalone-db-instances` from the `.env` file the same error kept being thrown stating that the `client password must be a string` (which is why the variables are hardcoded instead).

## Azure Service Bus

Service Bus instances were successfully set up (see the [`lone-asb-instance`](https://github.com/rtasalem/hapi-pg-docker/tree/main/app/lone-asb-instances) directory). Install the [@azure/service-bus NPM package](https://www.npmjs.com/package/@azure/service-bus). The `connectionString` is the primary connection string which is obtained from the Azure Portal: portal > search for Service Bus > select Service Bus Namespace > Settings > Shared access policies > RootManageSharedAccessKey > copy Primary Connection String. The name of the Service Bus queue can be found by navgiating to Service Bus Namespace, opening the Overview tab, scrolling to the bottom, and copying the name of the queue itself (same is done for a topic/subscription). Sending messages to a queue or topic was done using [@johnwatson484](https://github.com/johnwatson484)'s [Azure Service Bus Test client](https://github.com/johnwatson484/azure-service-bus-test-client).<br><br>
I wanted to create a Service Bus instance that would send messages to the queue and/or topic _and_ save them to the postgres database. I initially struggled with this and was only able to achieve one over the other (i.e. could send to queue/topic but not persist to database OR could persist to database but could not save to queue/topic). At first thought this was due to the (lack of) constraints on the columns of the `messages` table. As the "primary key" (`messages_id`) was not auto-incrementing and was declared as an int, it had to be hardcoded when sending a message to the Service Bus queue. This would save the message to the database as I was providing both the `messages_id` and the `content` (which both have a `NOT NULL` constraint and therefore must be provided when attempting to save new rows to the `messages` table), but would not be visible via the queue on the portal. When sending messages with no `messages_id` value, the message would successfully be sent to the queue, but would no longer save into the database. The proposed solution was to create a new table (`inbox`) with the appropriate constraints. The issue stil remains in that when sending a message using the primary connection string and queue, the message saves to the database but does not save to the queue (this was also the case when using topics). It seems that some messages will simply attempt to redeliver for the max delivery count (previously 10 now 300 but increasing didn't solve the problem) before saving to the dead letter queue. This will need to be revisited at a later point. Note the the following imports/calls have been removed from the `index.js` and should be added back in if looking further into the [`service-bus`](https://github.com/rtasalem/hapi-pg-docker/tree/main/app/service-bus) directory to save to queue or topic and database:

```
const { receiveFromQueue } = require('./service-bus/send-message-to-queue')
const { startMessagingTopic } = require('./service-bus/send-message-to-topic')

await receiveFromQueue()
await startMessagingTopic()
```

**Update:** At a point where I feel the issue has been fixed. Sending messages via the test client will of course save the messages to the Service Bus queue (this is _before_ running the Docker container). Once the application is started via Docker, the console should log that the messages were received by the queue, but also that they have now been saved to the database and when running a select statement via pgAdmin, I found this was the case. Not perfect, as I was aiming to send and save to the database simultaneously i.e. while the Docker container was running, you send a message, check that it's in the queue, then check Postgres to see that it has also been saved to the database. With the current set up, messages are sent to the queue first and the once the Docker container is started, those same messages are consumed and removed dfrom the queue but are saved to the database. Maybe it would be worth coming back to try and achieve the initial aim, but for now this will do.<br><br>
Note that when connecting to the Postgres client, the query has to be set up in the following way:
```
    const insertQuery = `insert into inbox (content) values ($1)`
    const values = [message.body.content]
    await client.query(insertQuery, values)
```
I attempted to use this set-up, but ran into issues with saving the message to the database because the value I was placing into the `content` column was not "properly quoted or sanitised":
```
    const insertQuery = `insert into inbox (content) values (${message.body.content})`
    await client.query(insertQuery)
```
Something to just take note of for future reference.