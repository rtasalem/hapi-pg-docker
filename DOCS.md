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
- Ensure you `COPY` both the `package.json` and `package-lock.json` into the image. To accomplish this, two parameters need to b
