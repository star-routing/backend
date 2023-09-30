const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Rol = db.define('rol', {
    idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombreRol: {
        type: DataTypes.STRING,
    },
});

module.exports = Rol;