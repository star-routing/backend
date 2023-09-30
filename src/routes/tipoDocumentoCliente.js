const TipoDocumentoCliente = require('../models/tipoDocumentoCliente');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken)


router.get('/', async (req, res) => {
  const tipoDocClts = await TipoDocumentoCliente.findAll();

  res.json(tipoDocClts);
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const tipoDocClt = await TipoDocumentoCliente.findByPk(id)

  if (!tipoDocClt) {
    return res.json({
      error: "No existe el tipo de documento de cliente"
    });
  }

  res.json(tipoDocClt);
});


router.post('/', async (req, res) => {
  const { idTipoDocumento, nombreTipo } = req.body;
  const tipo = await TipoDocumentoCliente.findOne({ where: { nombreTipo } })
  if (!nombreTipo || !idTipoDocumento) {
    return res.json({
      error: "Uno o mas campos vacios"
    });
  }

  if (tipo) {
    return res.json({
      error: "El tipo de documento ya existe mibro"
    });
  }

  if (!TipoDocumentoCliente.rawAttributes.nombreTipo.values.includes(nombreTipo)) {
    return res.json({
      error: "Valor no permitido para el campo tipoDocumentoCliente"
    })
  }

  const tipoDocClt = await TipoDocumentoCliente.create({ idTipoDocumento, nombreTipo })

  res.json({
    msj: 'TipoDocumentoCliente creado exitosamente',
    Tipo: tipoDocClt
  });
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const tipoId = await TipoDocumentoCliente.findByPk(id);
  const { nombreTipo, ...resto } = req.body;

  if (!nombreTipo) {
    return res.json({
      error: "Uno o más campos vacios"
    })
  }

  if (!tipoId) {
    return res.json({ msj: 'El tipo de documento no existe' });
  }

  if (!TipoDocumentoCliente.rawAttributes.nombreTipo.values.includes(nombreTipo)) {
    return res.json({
      error: "Valor no permitido para el campo tipoDocumentoCliente"
    })
  }

  const tipoExists = await TipoDocumentoCliente.findOne({ where: { nombreTipo } });

  if (tipoExists) {
    return res.json({
      error: 'El tipo de documento ya existe'
    });
  }

  await tipoId.update({ nombreTipo, ...resto });

  res.json({
    msj: 'TipoDocumentoCliente actualizado con exito',
    Tipo: tipoId
  });
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const tipoId = await TipoDocumentoCliente.findByPk(id);

  if (!tipoId) {
    return res.json({ msj: 'El tipo de documento no existe o ya ha sido eliminado' });
  }

  await tipoId.destroy();

  res.json({
    msj: 'TipoDocumentoCliente eliminado con exito',
    Tipo: tipoId
  });
});

module.exports = router