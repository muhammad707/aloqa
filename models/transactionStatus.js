module.exports = (sequelize, Sequelize) => {
    const TransactionStatus = sequelize.define('Status', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        status: {
            allowNull: false,
            type: Sequelize.STRING,
            require: true
        },
        createdAt: { type: Sequelize.DATE, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATE, defaultValue: new Date() }
    }, {
        freezeTableName: true
    });

    return TransactionStatus;
}