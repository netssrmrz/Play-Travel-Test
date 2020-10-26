const { Pool, Client } = require('pg')

function clientConnect()
{
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'play-travel-test',
    password: 'admin',
    port: 5432,
  });
  client.connect();

  return client;
}

class User 
{
  constructor(id, {content, author}) 
  {
    this.id = id;
    this.content = content;
    this.author = author;
  }

  static async selectById(id)
  {
    const client = clientConnect();
    const resDb = await client.query('select * from public.users where id=$1', [id]);
    return resDb.rows[0];
  }

  static async selectByIdWithCountry(id)
  {
    const sql = "select u.fullname, c.name as country_name from users u left join countries c on c.code=u.country_code where id=$1";
    const client = clientConnect();
    const resDb = await client.query(sql, [id]);
    return resDb.rows[0];
  }

  static async selectByEmailAndPassword(email, password)
  {
    const client = clientConnect();
    const resDb = await client.query('select * from public.users where email=$1 and password=$2', [email, password]);
    return resDb.rows[0];
  }

  insert(data)
  {

  }

  update(id, data)
  {

  }

  delete(id)
  {

  }
}

module.exports = User;
