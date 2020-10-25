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

class Message 
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
    const resDb = await client.query('select * from public.sample where id=$1', [id]);
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

module.exports = Message;
