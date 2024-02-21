FROM node:latest
WORKDIR /app
COPY package*.json package*.json ./
# copy both package.json & package-lock.json
RUN npm install
COPY . .
CMD ["node", "app/index.js"]