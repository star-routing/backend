const EstadoRastreo = require("../models/estadoRastreo");
const validateToken = require("../middlewares/tokenFunc");

const router = require("express").Router();

router.use(validateToken);

router.get("/", async (req, res) => {
    const estadoRastreo = await EstadoRastreo.findAll();
    
    res.json(estadoRastreo);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const estadoRastreo = await EstadoRastreo.findByPk(id);

    if (!estadoRastreo) {
        return res.json({
            error: "No existe el estado de rastreo",
        });
    }

    res.json({
        msj: "Informacion de estadoRastreo",
        Estado: estadoRastreo,
    });
});

module.exports = router;