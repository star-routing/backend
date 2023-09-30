const Entrega = require('../models/entrega');
const Rastreo = require('../models/rastreo');
const validateToken = require('../middlewares/tokenFunc');
const zlib = require('zlib'); // Para descomprimir (si está comprimido)
const router = require('express').Router()

router.use(validateToken)

router.get('/', async (req, res) => {
  const entregas = await Entrega.findAll();

  try {
    const entregas = await Entrega.findAll();

    if (entregas.length === 0) {
      return res.json({
        status: "error",
        msj: "No hay entregas registradas"
      });
    }

    for (const entrega of entregas) {
      const firmaDestinatarioBlob = entrega.firmaDestinatario;
      const imageUrl = firmaDestinatarioBlob.toString('utf-8');

      await entrega.update({ firmaDestinatario: imageUrl });
    }

    res.json(entregas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      msj: "Error al procesar la solicitud"
    });
  }

});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const entrega = await Entrega.findByPk(id)

  if (!entrega) {
    return res.json({
      status: "error",
      msj: "No existe ninguna entrega con el id proporcionado."
    });
  }

  res.json(entrega);
});


router.post('/', async (req, res) => {
  const { firmaDestinatario, fechaEntrega, idRastreo } = req.body;
  //const ent = await Entrega.findOne({ where: {"Lo que no se vaya a repetir"}})

  if (!firmaDestinatario || !fechaEntrega || !idRastreo) {
    return res.json({
      status: "error",
      msj: "Uno o mas campos vacios"
    });
  }

  /*if (ent){
    return res.json({
      error:"La entrega ya existe"
    });
  }*/

  const rastreoId = await Rastreo.findByPk(idRastreo);
  if (!rastreoId) {
    return res.json({
      status: "error",
      msj: 'El rastreo de paquetes no existe'
    });
  }

  const entrega = await Entrega.create({ firmaDestinatario, fechaEntrega, idRastreo })

  res.json({
    status: "ok",
    msj: 'Entrega creada exitosamente',
    Entrega: entrega
  });
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const entId = await Entrega.findByPk(id);
  const { firmaDestinatario, fechaEntrega, idRastreo } = req.body;
  /* const ent = await Entrega.findOne({ where: {"Lo que no se vaya a repetir"}}) */

  if (!firmaDestinatario || !idRastreo) {
    return res.json({
      status: "error",
      msj: "Uno o mas campos vacios"
    });
  }

  if (!entId) {
    return res.json({
      status: "error",
      msj: "No existe la entrega"
    });
  }

  /*  if (ent){
     return res.json({
       error:"La entrega ya existe"
     });
   } */

  const rastreoId = await Rastreo.findByPk(idRastreo);
  if (!rastreoId) {
    return res.json({
      status: "error",
      msj: 'El rastreo de paquetes no existe'
    });
  }

  await entId.update({ firmaDestinatario, idRastreo })

  res.json({
    status: "ok",
    msj: 'Entrega actualizada con exito',
    Entrega: entId
  });
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const entId = await Entrega.findByPk(id);

  if (!entId) {
    return res.json({
      status: "error",
      msj: 'La entrega no existe o ya ha sido eliminado'
    });
  }

  await entId.destroy();

  res.json({
    status: "ok",
    msj: 'Entrega eliminada con exito',
    Entrega: entId
  });
});

module.exports = router