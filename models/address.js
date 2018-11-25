
// Address table schema
module.exports = (sequelize, Sequelize) => {
    const Address = sequelize.define('Address', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        postalCode: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        createdAt: { type: Sequelize.DATE, defaultValue: new Date() },
        updatedAt: { type: Sequelize.DATE, defaultValue: new Date() }
    }, {
        freezeTableName: true
    });

    // One-to-many communication with Region table
    Address.associate = (models) => {
        Address.belongsTo(models.Region, {
            foreignKey: 'region_id'
        });
    }

    return Address;
}