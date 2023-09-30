const { DataTypes } = require("sequelize");
const db = require("../db/database");

const TipoPaquete = db.define('tipopaquete', {
    idTipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
    },
    tipoPaquete: {
        type: DataTypes.ENUM('Fragil', 'Especial', 'Estándar', 'Documento', 'Otro'),
        allowNull: false,
    },
});

module.exports = TipoPaquete;