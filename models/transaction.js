const models = require('../models');
const crypto = require("crypto");
module.exports = (sequelize, Sequelize) => {
    const Transactions = sequelize.define('Transactions', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        send_department: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sender_fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sender_passport_series: {
            type: Sequelize.STRING(2),
            allowNull:false
        },
        sender_passport_number: {
            type: Sequelize.STRING,
            allowNull:false
        },
        sender_passport_date_of_issue: {
            type: Sequelize.DATEONLY,
            allowNull:false

        },
        sender_passport_date_of_expiry: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        sender_passport_place_of_given: {
            type: Sequelize.STRING,
            allowNull:false
        },
        sender_permanent_address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sender_phone_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sender_account_number: {
            type: Sequelize.STRING
        },
        send_amount_in_number: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        send_amount_in_word: {
            type: Sequelize.STRING,
            allowNull: false
        },

        receive_department: {
            type: Sequelize.STRING
        },
        receiver_fullname: {
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
        createdAt: { type: Sequelize.DATEONLY, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATEONLY },
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

    Transactions.associate = (models) => {
        Transactions.belongsTo(models.Currency, {
            foreignKey: 'send_currency_type',
            // as: 'sendCurrency'
        });
        Transactions.belongsTo(models.Currency, {
            foreignKey: 'receive_currency_type',
            as: 'reciveCurrency'
        });
        Transactions.belongsTo(models.Payment, {
            foreignKey: 'send_payment_method'
        });
        Transactions.belongsTo(models.Payment, {
            foreignKey: 'receive_payment_method',
            as: 'receiveMethod'
        });
        Transactions.belongsTo(models.TransactionStatus, {
            foreignKey: 'status'
        });
    }
    return Transactions;
}

generateSecretCode = () => {
    const buf = Buffer.alloc(4);
    return crypto.randomFillSync(buf).toString('hex').toUpperCase();
}