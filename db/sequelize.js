const Sequelize = require('sequelize'); // sequelize library
const keys = require('../config/config');
// Connection ... 
const sequelize = new Sequelize(keys.database_name, keys.database_user, keys.database_password, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false
});

// Connection check
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully');
})
 .catch(err => {
    console.log('Unable to connect to the database');
 })

 module.exports = {
     sequelize
 }