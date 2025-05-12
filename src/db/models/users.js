const sequelize = require('../sequelizeClient');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        googleId: {
            type: DataTypes.STRING
        },
        firstName: {
            type: DataTypes.STRING(50)
        },
        email: {
            type: DataTypes.STRING(50)
        }
    }
);

async function createTable() {

    try {

        await User.sync();
        console.log('Created table "users" successfully');

    } catch(err) {

        console.log('Failed to create table "users"');

    }

}

createTable();

module.exports = User;
