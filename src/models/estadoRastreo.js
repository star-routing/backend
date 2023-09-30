const { DataTypes } = require("sequelize");
const db = require("../db/database");

const EstadoRastreo = db.define('estadorastreo', {
    idEstado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
    },
    nombreEstado: {
        type: DataTypes.STRING,
    },
});

module.exports = EstadoRastreo;