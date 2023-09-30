const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Cliente = db.define('cliente', {
    idCliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    documentoCliente: {
        type: DataTypes.BIGINT,
    },
    idTipoDocumento: {
        type: DataTypes.INTEGER,
    },
    nombreCliente: {
        type: DataTypes.STRING,
    },
    telefonoCliente: {
        type: DataTypes.STRING,
    },
    correoCliente: {
        type: DataTypes.STRING,
    },
    direccionCliente: {
        type: DataTypes.STRING,
    },
    detalleDireccionCliente: {
        type: DataTypes.STRING,
    },
    lat: {
        type: DataTypes.DOUBLE,
    },
    lng: {
        type: DataTypes.DOUBLE,
    }
});

module.exports = Cliente;