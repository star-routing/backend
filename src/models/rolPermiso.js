const { DataTypes } = require("sequelize");
const db = require("../db/database");
const Rol = require("./rol");
const Permiso = require("./permiso");

const RolPermiso = db.define('rolpermiso', {
    idRolPermiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    idRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idPermiso: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

RolPermiso.belongsTo(Rol, { foreignKey: 'idRol' });
RolPermiso.belongsTo(Permiso, { foreignKey: 'idPermiso' });

module.exports = RolPermiso;