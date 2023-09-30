const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Paquete = db.define('paquete', {
    idPaquete: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigoPaquete: {
        type: DataTypes.STRING,
    },
    direccionPaquete: {
        type: DataTypes.STRING,
    },
    detalleDireccionPaquete: {
        type: DataTypes.STRING,
    },
    pesoPaquete: {
        type: DataTypes.DECIMAL(10, 2)
    },
    contenidoPaquete: {
        type: DataTypes.STRING,
    },
    documentoDestinatario: {
        type: DataTypes.INTEGER,
    },
    nombreDestinatario: {
        type: DataTypes.STRING,
    },
    correoDestinatario: {
        type: DataTypes.STRING,
    },
    telefonoDestinatario: {
        type: DataTypes.STRING,
    },
    fechaAproxEntrega: {
        type: DataTypes.STRING,
    },
    idUsuario: {
        type: DataTypes.INTEGER,
    },
    documentoRemitente: {
        type: DataTypes.INTEGER,
    },
    idEstado: {
        type: DataTypes.INTEGER,
    },
    idTamano: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    idTipo: {
        type: DataTypes.INTEGER,
    },
    lat: {
        type: DataTypes.DOUBLE,
    },
    lng: {
        type: DataTypes.DOUBLE,
    }
});

module.exports = Paquete;