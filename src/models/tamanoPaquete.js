const { DataTypes } = require("sequelize");
const db = require("../db/database");

const TamanoPaquete = db.define('tamanopaquete', {
    idTamano: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
    },
    tamanoPaquete: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = TamanoPaquete;