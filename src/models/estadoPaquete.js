const { DataTypes } = require("sequelize");
const db = require("../db/database");

const EstadoPaquetes = db.define('estadopaquete', {
    idEstado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
    },
    estadoPaquete: {
        type: DataTypes.STRING,
    },
});

module.exports = EstadoPaquetes;