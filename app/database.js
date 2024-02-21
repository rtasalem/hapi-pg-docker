const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database'
});

client.connect();

function handleQuery(err, res) {
  if (!err) {
    console.log(res.rows)
  } else {
    console.log(err.message)
  }
  client.end()
}

// const insertData = `insert into messages values (4, 'bon voyage!')`
// client.query(insertData)

// const updateData = `update messages set content = 'go away already', messages_id = 5 where messages_id = 1`
// client.query(updateData)

// const deleteData = `delete from messages where messages_id = 4`
// client.query(deleteData)

const fetchAllData = `select * from messages`
client.query(fetchAllData, handleQuery)