const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database'
});

client.connect()

function handleQuery(err, res) {
  if (!err) {
    console.log(res.rows)
  } else {
    console.log(err.message)
  }
  client.end()
}

// create a query as a variable then pass it to the client.query() method
const fetchAllData = `select * from messages`
client.query(fetchAllData, handleQuery)