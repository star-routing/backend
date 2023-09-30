const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Permiso = db.define('permiso', {
    idPermiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombrePermiso: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Permiso;