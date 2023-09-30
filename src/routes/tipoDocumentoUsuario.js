const TipoDocumentoUsuario = require('../models/tipoDocumentoUsuario');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken)

router.get('/', async (req, res) => {
  const tipoDocUsers = await TipoDocumentoUsuario.findAll();

  res.json(tipoDocUsers)
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const tipoDocUser = await TipoDocumentoUsuario.findByPk(id)

  if (!tipoDocUser) {
    return res.json({
      error: "No existe el tipo de documento de usuario"
    });
  }

  res.json(tipoDocUser);
});


router.post('/', async (req, res) => {
  const { idTipoDocumento, nombreTipo } = req.body;
  const tipo = await TipoDocumentoUsuario.findOne({ where: { nombreTipo } })

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

  if (!TipoDocumentoUsuario.rawAttributes.nombreTipo.values.includes(nombreTipo)) {
    return res.json({
      error: "Valor no permitido para el campo tipoDocumentoUsuario"
    })
  }

  const tipoDocUser = await TipoDocumentoUsuario.create({ idTipoDocumento, nombreTipo })

  res.json({
    msj: 'TipoDocumentoUsuario creado exitosamente',
    Tipo: tipoDocUser
  });
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const tipoId = await TipoDocumentoUsuario.findByPk(id);
  const { nombreTipo, ...resto } = req.body;

  if (!nombreTipo) {
    return res.json({
      error: "Uno o más campos vacios"
    })
  }

  if (!tipoId) {
    return res.json({ msj: 'El tipo de documento no existe' });
  }

  if (!TipoDocumentoUsuario.rawAttributes.nombreTipo.values.includes(nombreTipo)) {
    return res.json({
      error: "Valor no permitido para el campo TipoDocumentoUsuario"
    })
  }

  const tipoExists = await TipoDocumentoUsuario.findOne({ where: { nombreTipo } });

  if (tipoExists) {
    return res.json({
      error: 'El tipo de documento ya existe'
    });
  }

  await tipoId.update({ nombreTipo, ...resto });

  res.json({
    msj: 'TipoDocumentoUsuario actualizado con exito',
    Tipo: tipoId
  });
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const tipoId = await TipoDocumentoUsuario.findByPk(id);

  if (!tipoId) {
    return res.json({ msj: 'El tipo de documento no existe o ya ha sido eliminado' });
  }

  await tipoId.destroy();

  res.json({
    msj: 'TipoDocumentoUsuario eliminado con exito',
    Tipo: tipoId
  });
});

module.exports = router