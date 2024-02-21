const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database'
});

client.connect();

const fetchAllData = `select * from messages`
const insertData = `insert into messages values (2, 'boo!')`

client.query(insertData, (err, res) => {
  if (!err) {
    console.log(res.rows)
  } else {
    console.log(err.message)
  }
  client.end()
})

client.query(fetchAllData, (err, res) => {
  if (!err) {
    console.log(res.rows)
  } else {
    console.log(err.message)
  }
  client.end()
})