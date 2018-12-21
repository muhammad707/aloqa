module.exports = (sequelize, Sequelize) => {
    const Commission = sequelize.define('Commission', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        value: {
            allowNull: false,
            type: Sequelize.DOUBLE,
            require: true
        },
        createdAt: { type: Sequelize.DATE, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATE, defaultValue: new Date() }
    }, {
        freezeTableName: true
    });

    return Commission;
}