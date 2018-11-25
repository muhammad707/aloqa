module.exports = (sequelize, Sequelize) => {
    const Currency = sequelize.define('Currency', {
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

    return Currency;
}