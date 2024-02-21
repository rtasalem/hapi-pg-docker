const { Client } = require("pg");

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  database: 'pg_database'
});

client.connect();

client.query('select * from messages', (err, res) => {
  if (!err) {
    console.log(res.rows)
  } else {
    console.log(err.message)
  }
  client.end()
})