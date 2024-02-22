const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database'
});

client.connect()

module.exports = { 
  client
 }

// function handleQuery(err, res) {
//   if (!err) {
//     console.log(res.rows)
//   } else {
//     console.log(err.message)
//   }
//   client.end()
// }

// const insertData = `insert into messages values (8, 'bon voyage!')`
// client.query(insertData)

// const updateData = `update messages set content = 'bye bye' where messages_id = 8`
// client.query(updateData)

// const deleteData = `delete from messages where messages_id = 3`
// client.query(deleteData)

// const fetchAllData = `select * from messages`
// client.query(fetchAllData, handleQuery)