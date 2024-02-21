FROM node:latest
WORKDIR /app
COPY package*.json package*.json 
# copy both package.json & package-lock.json
EXPOSE 3001
RUN npm install
COPY . .
CMD ["node", "index.js"]