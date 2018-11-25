module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
            require: true
        },
        createdAt: { type: Sequelize.DATE, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATE, defaultValue: new Date() }
    }, {
        freezeTableName: true
    });

    return Payment;
}