const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Usuario = db.define('usuario', {
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    documentoUsuario: {
        type: DataTypes.BIGINT,
    },
    idTipoDocumento: {
        type: DataTypes.INTEGER,
    },
    nombreUsuario: {
        type: DataTypes.STRING,
    },
    apellidoUsuario: {
        type: DataTypes.STRING,
    },
    telefonoUsuario: {
        type: DataTypes.STRING,
    },
    correoUsuario: {
        type: DataTypes.STRING,
        unique: true,
    },
    contrasenaUsuario: {
        type: DataTypes.STRING,
    },
    idRol: {
        type: DataTypes.INTEGER,
    },
    idEstado: {
        type: DataTypes.INTEGER,
    },
});

module.exports = Usuario;