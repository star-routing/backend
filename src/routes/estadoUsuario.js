const EstadoUsuario = require('../models/estadoUsuario');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken)


router.get('/', async (req, res) => {
    const estadoUsers = await EstadoUsuario.findAll();

    res.json(estadoUsers);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const estadoUser = await EstadoUsuario.findByPk(id)

    if (!estadoUser) {
        return res.json({
            error: "No existe el estado de usuario"
        });
    }

    res.json(estadoUser);
});


router.post('/', async (req, res) => {
    const { idEstado, estadoUsuario } = req.body;
    const estadoUserExists = await EstadoUsuario.findOne({ where: { estadoUsuario } })
    const estadoUserId = await EstadoUsuario.findByPk(idEstado)

    if (!estadoUsuario || !idEstado) {
        return res.json({
            error: "Uno o más campos vacios"
        })
    }
    if (estadoUserId) {
        return res.json({
            error: "Ya existe un usuario con ese ID"
        });
    }

    if (estadoUserExists) {
        return res.json({
            error: "El estado del usuario ya existe"
        });
    }

    const estadoUserC = await EstadoUsuario.create({ idEstado, estadoUsuario })

    res.json({
        msj: 'EstadoUsuario creado exitosamente',
        Estado: estadoUserC
    });
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const estadoUserId = await EstadoUsuario.findByPk(id);
    const { idEstado, estadoUsuario, ...resto } = req.body;

    if (!estadoUsuario || !idEstado) {
        return res.json({
            error: "Uno o más campos vacios"
        })
    }

    if (!estadoUserId) {
        return res.json({ msj: 'El estado del usuario no existe' });
    }

    const estadoUserExists = await EstadoUsuario.findOne({ where: { estadoUsuario } });
    if (estadoUserExists) {
        return res.json({
            error: 'El estado del usuario ya existe'
        });
    }

    await estadoUserId.update({ estadoUsuario, ...resto });

    res.json({
        msj: 'EstadoUsuario actualizado con exito',
        Estado: estadoUserId
    });
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const estadoUserId = await EstadoUsuario.findByPk(id);

    if (!estadoUserId) {
        return res.json({
            msj: 'El estado del usuario no existe o ya ha sido eliminado'
        });
    }

    await estadoUserId.destroy();

    res.json({
        msj: 'EstadoUsuario eliminado con exito',
        Estado: estadoUserId
    });
});

module.exports = router