module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
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
        createdAt: { type: Sequelize.DATEONLY, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATEONLY, defaultValue: new Date() }
    }, {
        freezeTableName: true
    });

    return Role;
}