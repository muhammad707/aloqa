module.exports = (sequelize, Sequelize) => {
    const DepartmentStatus = sequelize.define('DepartmentStatus', {
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
        createdAt: { type: Sequelize.DATEONLY, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATEONLY, defaultValue: new Date()  }
    }, {
        freezeTableName: true
    });

    return DepartmentStatus;
}