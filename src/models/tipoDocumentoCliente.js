const { DataTypes } = require("sequelize");
const db = require("../db/database");

const TipoDocumentoCliente = db.define('tipodocumentocliente', {
    idTipoDocumento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombreTipo: {
        type: DataTypes.STRING,
    },
});

module.exports = TipoDocumentoCliente;