const { DataTypes } = require('sequelize');
const db = require('../config/db.js');

const User = db.define('User', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    timestamps: true,
    tableName: 'users'
})

module.exports = User;