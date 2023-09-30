const Rol = require('../models/rol');
const Usuario = require('../models/Usuario');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken);

router.get('/lastId', async (req, res) => {
    const lastRol = await Rol.findOne({
        attributes: ['idRol'],
        order: [['idRol', 'DESC']]
    });

    if (!lastRol) {
        return res.json({
            error: 'No se encontraron roles.'
        });
    }

    res.json(lastRol.idRol);
});

router.get("/", async (req, res) => {
    const roles = await Rol.findAll()

    if (roles.length === 0) {
        return res.json({
            status: "error",
            msj: "No hay roles registrados."
        });
    }

    res.json(roles);
});


router.get("/:id", async (req, res) => {
    const { id } = req.params
    const rol = await Rol.findByPk(id)

    res.json(rol);
});


router.post("/", async (req, res) => {
    const { nombreRol } = req.body;

    if (!nombreRol) {
        return res.json({
            status: "error",
            msj: "Un campo vacio"
        })
    }

    const rolExists = await Rol.findOne({ where: { nombreRol } })
    if (rolExists) {
        return res.json({
            status: "error",
            msj: "El rol ya existe."
        });
    }

    const rol = await Rol.create({ nombreRol });

    res.json({
        status: 'ok',
        msj: 'Rol creado exitosamente.',
        id: rol.id
    });
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { idRol, nombreRol } = req.body;
    const rolId = await Rol.findByPk(idRol)

    if (idRol == 1) {
        return res.json({
            status: 'error',
            msj: 'No puedes modificar este rol.'
        });
    }

    if (!nombreRol) {
        return res.json({
            status: "error",
            msj: "Uno o más campos vacios."
        })
    }

    if (!rolId) {
        return res.json({
            status: 'error',
            msj: 'El rol no existe.'
        });
    }


    if (nombreRol != rolId.nombreRol) {
        const rolExists = await Rol.findOne({ where: { nombreRol } });
        if (rolExists) {
            return res.json({
                status: 'error',
                msj: 'El rol ya existe.'
            });
        }
    }

    await rolId.update({ idRol, nombreRol });

    res.json({
        status: 'ok',
        msj: 'Rol actualizado con exito.',
    });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const rolId = await Rol.findByPk(id);

    if (!rolId) {
        return res.json({
            msj: 'El rol no existe o ya ha sido eliminado.'
        });
    }

    const usersAsociados = await Usuario.findAll({ where: { idRol: rolId.idRol } });

    if (usersAsociados.length > 0) { //ESTA VUELTA ES PARA VER SI EL ROL TIENE USERS ASOCIADOS
        return res.json({
            status: 'error',
            msj: 'No se puede eliminar el rol porque tiene usuarios asociados.'
        });
    }

    await rolId.destroy();

    res.json({
        status: 'ok',
        rolId
    });
});


module.exports = router;