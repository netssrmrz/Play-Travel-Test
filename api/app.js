const express = require('express')
var { graphqlHTTP } = require('express-graphql');
var { schema, root } = require('./graphql');
const { Pool, Client } = require('pg')
var cors = require('cors');

const app = express()
const port = 8080

app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/pg', getPg);
function getPg(req, res)
{
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'play-travel-test',
    password: 'admin',
    port: 5432,
  })

  client.connect()
  client.query('select * from public.sample', (err, resDb) => {
    console.log("resDb: ", resDb.rows[0]);
    client.end();

    res.send('Query done!');
  })
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
