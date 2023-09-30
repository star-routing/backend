const { DataTypes } = require("sequelize");
const db = require("../db/database");

const EstadoUsuario = db.define('estadousuario', {
    idEstado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
    },
    estadoUsuario: {
        type: DataTypes.ENUM('activo', 'inactivo')
    },
});

module.exports = EstadoUsuario;