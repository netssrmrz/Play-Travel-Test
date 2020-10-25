const express = require('express')
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { Pool, Client } = require('pg')
var cors = require('cors');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
  rollDice: (args) => {
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  }
};

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

/*const pool = new Pool({
  user: 'dbuser',
  host: 'database.server.com',
  database: 'mydb',
  password: 'secretpassword',
  port: 3211,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})*/

//"C:\Program Files\PostgreSQL\11\bin\pg_ctl.exe" runservice -N "postgresql-x64-11" -D "C:\Program Files\PostgreSQL\11\data" -w