const Rastreo = require("../models/rastreo");
const Paquete = require("../models/paquete");
const estadoRastreo = require("../models/estadoRastreo");
const validateToken = require("../middlewares/tokenFunc");
const { where } = require("sequelize");

const router = require("express").Router();

router.use(validateToken);

router.get("/", async (req, res) => {
    const rastreo = await Rastreo.findAll();

    res.json(rastreo);
});

router.get("/paquete/:idPaquete", async (req, res) => {
    const { idPaquete } = req.params;
    const rastreo = await Rastreo.findOne({
        where: {
            idPaquete,
            idEstado: null
        }
    });


    if (!rastreo) {
        return res.json({
            status: "error",
            msj: "No existe ningun rastreo con el id proporcionado.",
        });
    }

    res.json(rastreo);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const rastreo = await Rastreo.findByPk(id);

    if (!rastreo) {
        return res.json({
            status: "error",
            msj: "No existe ningun rastreo con el id proporcionado.",
        });
    }

    res.json(rastreo);
});

router.get("/novedad/novs", async (req, res) => {
    const rastreos = await Rastreo.findAll({ where: { idEstado: 2 } })

    res.json(rastreos);
});

router.get("/entregas/entregado", async (req, res) => {
    const rastreos = await Rastreo.findAll({ where: { idEstado: 1 } })

    res.json(rastreos);
});

router.post("/", async (req, res) => {
    const { motivoNoEntrega, fechaNoEntrega, idPaquete, idUsuario, idEstado } = req.body;

    if (!idPaquete || !idUsuario) {
        return res.json({
            status: "error",
            msj: "Uno o mas campos vacios.",
        });
    }

    const rastreo = await Rastreo.create({ motivoNoEntrega, fechaNoEntrega, idPaquete, idUsuario, idEstado });

    res.json({
        status: "ok",
        msj: "Rastreo creado exitosamente.",
        Rastreo: rastreo
    });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { idRastreo, motivoNoEntrega, fechaNoEntrega, idPaquete, idUsuario, idEstado } = req.body;
    const rastreoId = await Rastreo.findOne({
        where: {
            idRastreo,
            idEstado: null
        }
    });

    if (!idPaquete) {
        return res.json({
            status: "error",
            msj: "Uno o mas campos vacios.",
        });
    }

    await rastreoId.update({ idRastreo, motivoNoEntrega, fechaNoEntrega, idPaquete, idUsuario, idEstado });

    res.json({
        status: "ok",
        msj: "Rastreo actualizado exitosamente.",
        Rastreo: rastreoId
    });
});

router.delete('/:idPaquete', async (req, res) => {
    const { idPaquete } = req.params;

    const paqId = await Rastreo.findOne({
        where: {
            idPaquete,
            idEstado: null
        }
    });

    if (!paqId) {
        return res.json({
            status: "ok",
            msj: "No existe ningun rastreo con el idPaquete proporcionado.",
        });
    }

    await paqId.destroy();

    res.json({
        status: "ok",
        msj: "Rastreo eliminado exitosamente.",
        Rastreo: paqId
    });
});

module.exports = router;