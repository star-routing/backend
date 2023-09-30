const TamanoPaquete = require('../models/tamanoPaquete');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken)


router.get('/', async (req, res) => {
    const tamanos = await TamanoPaquete.findAll();

    res.json(tamanos);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const tamano = await TamanoPaquete.findByPk(id)

    if (!tamano) {
        return res.json({
            error: "No existe el tamaño"
        });
    }

    res.json(tamano);
});


module.exports = router