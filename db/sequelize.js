const Sequelize = require('sequelize'); // sequelize library

// Connection ... 
const sequelize = new Sequelize('aloqa_test', 'postgres', 'inha707', {
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