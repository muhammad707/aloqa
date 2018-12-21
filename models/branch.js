module.exports = (sequelize, Sequelize) => {
    const Branch = sequelize.define('Branch', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        MFO: {
            type: Sequelize.STRING,
            allowNull: false
        },
        department: {
            type: Sequelize.STRING
        },
        details: {
            type: Sequelize.TEXT
        },
        createdAt: { type: Sequelize.DATE, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATE, defaultValue: new Date() }   
    }, {
        freezeTableName: true
    });

    // Branch.associate = (models) => {
    //     Branch.belongsTo(models.DepartmentStatus, {
    //         foreignKey: 'status'
    //     });
    // }
    return Branch;
}