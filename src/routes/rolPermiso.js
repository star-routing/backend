const RolPermiso = require('../models/rolPermiso');
const Rol = require('../models/rol');
const Permiso = require('../models/permiso');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken)


router.get("/", async (req, res) => {
    const rolesPermiso = await RolPermiso.findAll()

    res.json({
        RolesxPermisos: rolesPermiso
    });
});

router.get("/:idRol/permisos", async (req, res) => {
    const { idRol } = req.params;

    // Buscar el rol por su ID
    const rol = await Rol.findOne({ where: { idRol: idRol } });

    if (!rol) {
        return res.json({
            error: "El rol no existe",
        });
    }

    // Buscar los permisos asociados al rol
    const idPermiso = await RolPermiso.findAll({
        where: { idRol },
        include: [{ model: Permiso }],
    });

    res.json({
        msj: "Permisos asociados al rol",
        idPermiso
    });
});


router.get("/:id", async (req, res) => {
    const { id } = req.params
    const rolPermiso = await RolPermiso.findByPk(id)

    if (!rolPermiso) {
        return res.json({
            error: "No existe el rolPermiso"
        });
    }

    res.json({
        msj: 'Informacion de RolxPermiso',
        RolxPermiso: rolPermiso
    });
});


router.post("/", async (req, res) => {
    const { idRol, idPermiso } = req.body;
    if (!idRol || !idPermiso) {
        return res.json({
            status: "error",
            msj: "Uno o más campos vacios"
        })
    }

    const rol = await Rol.findByPk(idRol);
    if (!rol) {
        return res.json({
            status: "error",
            msj: 'El idRol proporcionado no es válido'
        });
    }

    const permiso = await Permiso.findByPk(idPermiso);
    if (!permiso) {
        return res.json({
            status: "error",
            msj: 'El idPermiso proporcionado no es válido'
        });
    }

    const rolPermiso = await RolPermiso.create({ idRol, idPermiso });

    res.json({
        status: "ok",
        msj: 'RolxPermiso creado exitosamente',
    });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { idRol, idPermisos } = req.body;

    if (!idPermisos || idPermisos.length === 0) {
        return res.json({
            status: "error",
            msj: "Uno o más campos vacíos o no se proporcionaron nuevos permisos",
        });
    }

    const rol = await Rol.findByPk(id);
    if (!rol) {
        return res.json({
            status: "error",
            msj: 'El idRol proporcionado no es válido',
        });
    }

    // Eliminar los permisos existentes asociados al rol
    await RolPermiso.destroy({
        where: {
            idRol: id,
        },
    });

    // Crear nuevos registros en la tabla "rolPermiso" con los nuevos permisos
    for (const idPermiso of idPermisos) {
        await RolPermiso.create({
            idRol,
            idPermiso,
        });
    }

    res.json({
        status: "ok",
        msj: 'RolesxPermiso actualizado con éxito',
    });
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const rolPermisoId = await RolPermiso.findByPk(id);

    if (!rolPermisoId) {
        return res.json({
            msj: 'El rol permiso no existe o ya ha sido eliminado'
        });
    }

    await rolPermisoId.destroy();

    res.json({
        msj: 'RolxPermiso eliminado con exito',
        RolxPermiso: rolPermisoId
    });
});

module.exports = router;