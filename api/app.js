const express = require('express')
var { graphqlHTTP } = require('express-graphql');
var { schema, root } = require('./graphql');
const { Pool, Client } = require('pg')
var cors = require('cors');
const User = require('./User');
var jwt = require('express-jwt');
const jwtBuild = require('jsonwebtoken');

const jwtSecret = "cambia, todo cambia";
const jwtProtect = jwt({ secret: jwtSecret, algorithms: ['HS256'] });

const app = express();
const port = 8080;

app.use(cors());
app.use('/graphql', jwtProtect, graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/userSelectByIdWithCountry/:id', jwtProtect, async (req, res) => 
{
  let resJson = {fullname: null, countryName: null};

  if (!req.user.admin) 
  {
    res.sendStatus(401);
  }
  else
  {
    const user = await User.selectByIdWithCountry(req.params.id);
    if (user !== undefined)
    {
      resJson.fullname = user.fullname;
      resJson.countryName = user.country_name;

      res.send(resJson);
    }
  }
});

app.get('/userLogin/:email/:password', async (req, res) => 
{
  let resJson = {id: null, token: null};

  const user = await User.selectByEmailAndPassword(req.params.email, req.params.password);
  if (user !== undefined)
  {
    const token = jwtBuild.sign(
      { id: user.id, username: user.fullname, admin: true },
      jwtSecret,
      { expiresIn: 129600 }
    );
    resJson.id = user.id;
    resJson.token = token;
  }

  res.send(resJson);
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
