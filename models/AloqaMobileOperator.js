var bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, Sequelize) => {
    const AloqaMobileOperator = sequelize.define('AloqaMobileOperator', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        username: {
            allowNull: false,
            type: Sequelize.STRING,
            require: true
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING,
            require: true
        },
        createdAt: { type: Sequelize.DATE, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATE, defaultValue: new Date() }
    }, {
        freezeTableName: true
    });

    // AloqaMobileOperator.addHook("beforeCreate", function(operator) {
    //     operator.password = bcrypt.hashSync(operator.password, bcrypt.genSaltSync(10), null);
    //   });
    return AloqaMobileOperator;
}