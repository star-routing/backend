const { DataTypes } = require("sequelize");
const db = require("../db/database");

const TipoDocumentoUsuario = db.define('tipodocumentousuario', {
    idTipoDocumento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
    },
    nombreTipo: {
        type: DataTypes.STRING,
    },
});

module.exports = TipoDocumentoUsuario;