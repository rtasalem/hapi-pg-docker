# Docs
## Project Initialisation
Create and open a new project/repo. In the terminal (ensure you are in the project directory), run `npm init`. Select the default options. If working from a GitHub repo, ensure to include a `.gitignore` (whether as a template from GitHub (specifically the Node template) or creating a custom one from [gitignore.io](https://www.toptal.com/developers/gitignore)). Once the project has been initialised, create a directory called `app` and create a file called `index.js` (This is the entry point for which your Node application will run your project, you will have seen this as one of the default options during initialisation).
## Set Up Hapi.js Server
In the `index.js` file, [set up a Hapi.js server](https://hapi.dev/tutorials/gettingstarted/?lang=en_US). Take note that the `host` should be set to `0.0.0.0` and *not* `localhost` so that it is accessible outside of the Docker container. Check that the server has been set up correctly through the following:
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
*Note this section will specifically refer to pgAdmin 4 as a database management tool for Postgres.*<br>
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
~~I did also set up a `.env` just to try and use environment variables, but I got back errors from both the node-postgres and Sequelize packages saying the password had to be a string (will need to come back and look into this more).~~ Setting up a schema to use environment variables via Docker Compose & a `.env` file was achieved, see the [Environment Variables](https://github.com/rtasalem/hapi-pg-docker/blob/main/DOCS.md#environment-variables) section for full details.
## Configure Asynchronous Route in Server (Sequelize & node-postgres)
A route was configured so that the server could display data from the `Users` table through `localhost:3001/users`. The important thing to understand about this Sequelize set-up is that the port (`5432`) will never be able to connect properly to the server unless the host is given the correct value. When creating an instance of `Client` (node-postgres) or `Sequelize` the hose was mistakenly entered as `localhost`. In a Docker environment, `localhost` within a contianer refers to the container itself, not the host machine where Postgres is running. Therefore to solve the issue, the host name was changed to the service name (`hapi-pg-docker-postgres`) defined in the `docker-compose.yaml` file. This enables Docker to resolve the service name to the correct IP address of the container running Postgres (i.e. the Hapi.js server can connect to the Postgres container). Keeping this in mind, it should be straight forward to set up a route: `/users`.
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
One thing to remember is *how* you export modules so that they can be imported into other areas of your application. An error may be thrown saying that a module needs to be exported as an object. This means that you must incase the module within curly brackets (`{}`) when exporting e.g. `module.exports = { Users }`. It's good to know when this is and isn't needed.
## Environment Variables
While this project aims to set up a simplified server and database, I wanted to follow best practice and feed in any secrets/sensitive information using environment variables (this isn't the case within the `standalone-db-instances` directory*). I did this by setting up a `.env` file to supply the environment variables to Docker Compose and then to the application itself. For this I installed the [Joi NPM package](https://www.npmjs.com/package/joi) to define the [schema](https://github.com/rtasalem/hapi-pg-docker/blob/main/app/schema.js). This `schema` module then just needs to be imported into both of the `database.js` files so that the environment variables can be set.<br><br>
Note that on line 15 and 19 of the [`docker-compose.yaml`](https://github.com/rtasalem/hapi-pg-docker/blob/main/docker-compose.yaml) file, the environment variables are written as `POSTGRES_HOST: "${POSTGRES_HOST:-hapi-pg-docker-postgres}"` and `POSTGRES_SCHEMA_NAME: "${POSTGRES_SCHEMA_NAME:-public}"`. The `:-` is there because if the value of this environment variable is not defined within the `.env` then it will default to using the value that's specified after the `:-` in the `docker-compose.yaml`.<br><br>
*When trying to feed the environment variables into  `standalone-db-instances` from the `.env` file the same error kept being thrown stating that the `client password must be a string` (which is why the variables are hardcoded instead).