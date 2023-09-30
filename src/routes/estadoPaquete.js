const EstadoPaquetes = require('../models/estadoPaquete');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken)


router.get('/', async (req, res) => {
    const estadoPaquetes = await EstadoPaquetes.findAll();

    res.json(estadoPaquetes);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const estadoPaquete = await EstadoPaquetes.findByPk(id)

    if (!estadoPaquete) {
        return res.json({
            error: "No existe el estado de paquete"
        });
    }

    res.json({
        msj: 'Informacion de estadoPaquete',
        Estado: estadoPaquete
    });
});


router.post('/', async (req, res) => {
    const { idEstado, estadoPaquete } = req.body;
    const estadoPaqExists = await EstadoPaquetes.findOne({ where: { estadoPaquete } })
    const estadoPaqId = await EstadoPaquetes.findByPk(idEstado)

    if (!estadoPaquete || !idEstado) {
        return res.json({
            error: "Uno o más campos vacios"
        })
    }
    if (estadoPaqId) {
        return res.json({
            error: "Ya existe un estado con ese ID"
        });
    }

    if (!EstadoPaquetes.rawAttributes.estadoPaquete.values.includes(estadoPaquete)) {
        return res.json({
            error: "Valor no permitido para el campo estado paquete"
        })
    }

    if (estadoPaqExists) {
        return res.json({
            error: "El estado del paquete ya existe"
        });
    }

    const estadoPaqC = await EstadoPaquetes.create({ idEstado, estadoPaquete })

    res.json({
        msj: 'EstadoPaquete creado exitosamente',
        Estado: estadoPaqC
    });
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const estadoPaqId = await EstadoPaquetes.findByPk(id);
    const { idEstado, estadoPaquete, ...resto } = req.body;

    if (!estadoPaquete || !idEstado) {
        return res.json({
            error: "Uno o más campos vacios"
        })
    }

    if (!estadoPaqId) {
        return res.json({ msj: 'El estado del paquete no existe' });
    }

    if (!EstadoPaquetes.rawAttributes.estadoPaquete.values.includes(estadoPaquete)) {
        return res.json({
            error: "Valor no permitido para el campo estado paquete"
        })
    }

    const estadoPaqExists = await EstadoPaquetes.findOne({ where: { estadoPaquete } });

    if (estadoPaqExists) {
        return res.json({
            error: 'El estado del paquete ya existe'
        });
    }

    await estadoPaqId.update({ idEstado, estadoPaquete, ...resto });

    res.json({
        msj: 'EstadoPaquete actualizado con exito',
        Estado: estadoPaqId
    });
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const estadoPaqId = await EstadoPaquetes.findByPk(id);

    if (!estadoPaqId) {
        return res.json({
            msj: 'El estado del paquete no existe o ya ha sido eliminado'
        });
    }

    await estadoPaqId.destroy();

    res.json({
        msj: 'EstadoPaquete eliminado con exito',
        Estado: estadoPaqId
    });
});

module.exports = router