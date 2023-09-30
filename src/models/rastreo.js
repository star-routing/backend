const { DataTypes } = require("sequelize");
const db = require("../db/database");

const Rastreo = db.define('rastreo', {
    idRastreo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    motivoNoEntrega: {
        type: DataTypes.STRING,
    },
    fechaNoEntrega: {
        type: DataTypes.STRING,
    },
    idPaquete: {
        type: DataTypes.INTEGER,
    },
    idUsuario: {
        type: DataTypes.INTEGER,
    },
    idEstado: {
        type: DataTypes.INTEGER,
    },
});

module.exports = Rastreo;