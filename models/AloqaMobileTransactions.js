const models = require('../models');
const crypto = require("crypto");
module.exports = (sequelize, Sequelize) => {
    const AloqaMobileTransactions = sequelize.define('AloqaMobileTransactions', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        sender_full_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sender_card_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        receiver_full_name: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        receive_department: {
            type: Sequelize.STRING
        },
        receiver_firstName: {
            type: Sequelize.STRING
        },
        receiver_lastName: {
            type: Sequelize.STRING
        },
        receiver_middleName: {
            type: Sequelize.STRING
        },
        receiver_passport_series: {
            type: Sequelize.STRING(2)
        },
        receiver_passport_number: {
            type: Sequelize.STRING
        },
        receiver_passport_date_of_issue: {
            type: Sequelize.DATEONLY
        },
        receiver_passport_date_of_expiry: {
            type: Sequelize.DATEONLY
        },
        receiver_passport_place_of_given: {
            type: Sequelize.STRING
        },
        receiver_permanent_address: {
            type: Sequelize.STRING
        },
        receiver_phone_number: {
            type: Sequelize.STRING
        },
        receiver_account_number: {
            type: Sequelize.STRING
        },
        hash: {
            type: Sequelize.STRING
        },
        createdAt: { type: Sequelize.DATEONLY, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATEONLY },
        secretCode: {
            primaryKey: true,
            type: Sequelize.STRING,
            defaultValue: function(){
                return generateSecretCode()
            }
        },
        bank_profit: {
            type: Sequelize.DOUBLE
        }

    }, {
        freezeTableName: true
    });

    AloqaMobileTransactions.associate = (models) => {
        AloqaMobileTransactions.belongsTo(models.TransactionStatus, {
            foreignKey: 'status'
        });
        AloqaMobileTransactions.belongsTo(models.User, {
            foreignKey: 'receive_operator'
        });
    }
    return AloqaMobileTransactions;
}

generateSecretCode = () => {
    const buf = Buffer.alloc(4);
    return crypto.randomFillSync(buf).toString('hex').toUpperCase();
}