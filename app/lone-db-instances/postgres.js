const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  user: 'get-username-from-env',
  password: 'get-password-from-env',
  port: 5432,
  database: 'get-database-name-from-env'
})

client.connect()

function handleQuery(err, res) {
  if (!err) {
    console.log(res.rows)
  } else {
    console.log(err.message)
  }
  client.end()
}

const fetchAllData = `select * from messages order by messages_id asc`

client.query(fetchAllData, handleQuery)