const pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function(err){
  if(err){
    console.log(err.message);
  }
});

function query(sql, param, cb){
  return new Promise(function(resolve, reject){
    client.query(sql, param, function(err, result){
      if(err){
        return reject(err);
      }
      resolve(result);
    })
  })
}

function sync(){
const sql = `
  DROP TABLE IF EXISTS users;

  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(255),
    manager BOOLEAN
  );`
  return query(sql, null);
}

function seed(){
  const sql = `

  INSERT INTO users (name, manager) VALUES ('Joe', TRUE);
  INSERT INTO users (name, manager) VALUES ('Mike', FALSE);
  `;

  return query(sql, null);
}


function createUser(user, man){
  return client.query('INSERT INTO users (name, manager) values ($1, $2)', [user, man]);
}

function getUsers(managersOnly){
  var sql = 'SELECT * FROM users';
  if(managersOnly){
    sql = sql + ' WHERE manager = TRUE';
  }
  return client.query(sql)
    .then(function(result){
      return result.rows;
    })
}

function getUser(id){
  return client.query('SELECT * FROM users WHERE id = $1', [id]);
}


function updateUser(user){

  return client.query('UPDATE users SET manager = NOT manager WHERE users.id = $1', [user]);


}

function deleteUser(id){

  return client.query('DELETE FROM users WHERE users.id = $1', [id]);

}

module.exports = {
  sync,
  seed,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUser
};
