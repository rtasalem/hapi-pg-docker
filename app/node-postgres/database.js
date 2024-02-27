const { Client } = require('pg')

const client = new Client({
  host: 'hapi-pg-docker-postgres',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database',
})

module.exports = { client }
