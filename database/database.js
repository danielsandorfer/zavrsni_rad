const Sequelize = require('sequelize');

const db = new Sequelize('postgres://ynropikr:9u1U6wd-22156eK8p40jFC_4pyafmiJ4@kandula.db.elephantsql.com:5432/ynropikr', {
    pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }});

  db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports=db;