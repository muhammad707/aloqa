
// Built-in libraries
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

// Custom files 
const { sequelize } = require('./../db/sequelize');
var env = process.env.NODE_ENV || 'development';

// Creation of models object
const models = { 
  User: sequelize.import('./user'),
  Role: sequelize.import('./role'),
  Region: sequelize.import('./region'),
  Address: sequelize.import('./address'),
  TransactionStatus: sequelize.import('./transactionStatus'),
  Currency: sequelize.import('./currency'),
  Branch: sequelize.import('./branch'),
  PaymentMethod: sequelize.import('./paymentMethod'),
  Transaction: sequelize.import('./transaction')
 };

 // Schema files configuration
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });

  // Loop through all table and associates communications
Object.keys(models).forEach((model) => {
    if('associate' in models[model]) {
        models[model].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;