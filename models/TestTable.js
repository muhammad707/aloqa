const models = require('../models');
const crypto = require("crypto");
module.exports = (sequelize, Sequelize) => {
    const Test = sequelize.define('Test', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        phone_number: {
            allowNull: false,
            type: Sequelize.STRING
        },
        accountNumber: {
            allowNull: false,
            type: Sequelize.STRING
        },
        amount: {
            allowNull: false,
            type: Sequelize.DOUBLE
        },
        secretCode: {
            primaryKey: true,
            type: Sequelize.STRING,
            defaultValue: function(){
                return generateSecretCode()
            }
        }

    }, {
        freezeTableName: true
    });

    return Test;
}

generateSecretCode = () => {
    const buf = Buffer.alloc(4);
    return crypto.randomFillSync(buf).toString('hex').toUpperCase();
}