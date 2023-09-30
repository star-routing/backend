const Paquete = require('../models/paquete');
const Cliente = require('../models/cliente');
const EstadoPaquete = require('../models/estadoPaquete');
const TipoPaquete = require('../models/tipoPaquete');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router();

router.use(validateToken);

router.get('/', async (req, res) => {
  const paquetes = await Paquete.findAll();

  if (paquetes.length < 1) {
    return res.json({
      status: 'error',
      msj: 'No hay paquetes registrados',
    });
  }

  res.json(paquetes);
});

router.get('/:documentoCliente/data', async (req, res) => {
  const { documentoCliente } = req.params;

  try {
    const cliente = await Cliente.findOne({ where: { documentoCliente } });

    if (!cliente) {
      return res.json({
        error: 'El cliente no existe',
      });
    }

    res.json({
      idCliente: cliente.idCliente,
      idTipoDocumento: cliente.idTipoDocumento,
      documento: cliente.documentoCliente,
      nombre: cliente.nombreCliente,
      direccion: cliente.direccionCliente,
      detalleDireccion: cliente.detalleDireccionCliente,
      telefono: cliente.telefonoCliente,
      correo: cliente.correoCliente,
      lat: cliente.lat,
      lng: cliente.lng
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const paquete = await Paquete.findByPk(id);

  if (!paquete) {
    return res.json({
      status: 'error',
      msj: 'No existe el paquete',
    });
  }

  res.json(paquete);
});

router.get('/data/:codigoPaquete', async (req, res) => {
  const { codigoPaquete } = req.params;
  const paquete = await Paquete.findOne({ where: { codigoPaquete } })

  if (!paquete) {
    return res.json({
      status: 'error',
      msj: 'No existe el paquete',
    });
  }

  res.json(paquete);
});

router.get('/usuario/:uid', async (req, res) => {
  const { uid } = req.params;
  const paquete = await Paquete.findAll({
    where: {
      idUsuario: uid,
      idEstado: 2
    }
  });


  if (!paquete) {
    return res.json({
      status: 'error',
      msj: 'No existe el paqueteslodjk',
    });
  }

  res.json(paquete);
});

router.get('/entregas/entregado', async (req, res) => {
  const paquetesEntregado = await Paquete.findAll({ where: { idEstado: 3 } });

  res.json(paquetesEntregado)
});

router.post('/', async (req, res) => {
  const { codigoPaquete, direccionPaquete, detalleDireccionPaquete, pesoPaquete, contenidoPaquete, documentoDestinatario, nombreDestinatario, correoDestinatario, telefonoDestinatario, fechaAproxEntrega, idUsuario, documentoRemitente, idEstado, idTamano, idTipo, lat, lng } = req.body;


  if (!codigoPaquete || !pesoPaquete || !contenidoPaquete || !documentoDestinatario || !nombreDestinatario || !correoDestinatario || !telefonoDestinatario || !fechaAproxEntrega || !documentoRemitente || !idTipo) {
    return res.json({
      status: 'error',
      msj: 'Uno o más campos vacíos',
    });
  }

  if (!lat || !lng) {
    return res.json({
      status: "error",
      msj: "Debes seleccionar una ubicación en el mapa, o en las recomendaciones de direcciones."
    });
  }

  const codExits = await Paquete.findOne({ where: { codigoPaquete } });
  if (codExits) {
    return res.json({
      status: 'error',
      msj: 'Ya hay un paquete registrado con ese codigo.',
    });
  }

  if (isNaN(pesoPaquete) || isNaN(telefonoDestinatario)) {
    return res.json({
      status: "error",
      msj: "El campo peso deben ser numerico",
    });
  }

  const userRemi = await Cliente.findOne({ where: { documentoCliente: documentoRemitente } });
  if (!userRemi) {
    return res.json({
      status: 'error',
      msj: 'El documento del cliente no existe',
    });
  }

  const estado = await EstadoPaquete.findByPk(idEstado);
  if (!estado) {
    return res.json({
      status: 'error',
      msj: 'El estado no existe',
    });
  }

  const tipo = await TipoPaquete.findByPk(idTipo);
  if (!tipo) {
    return res.json({
      status: 'error',
      msj: 'El tipo no existe',
    });
  }

  const paquete = await Paquete.create({ codigoPaquete, direccionPaquete, detalleDireccionPaquete, pesoPaquete, contenidoPaquete, documentoDestinatario, nombreDestinatario, correoDestinatario, telefonoDestinatario, fechaAproxEntrega, idUsuario, documentoRemitente, idEstado, idTamano, idTipo, lat, lng });

  res.json({
    status: 'ok',
    msj: 'Paquete creado exitosamente',
  });
});

router.put('/:idPaquete', async (req, res) => {

  const { idPaquete, codigoPaquete, direccionPaquete, detalleDireccionPaquete, pesoPaquete, contenidoPaquete, documentoDestinatario, nombreDestinatario, correoDestinatario, telefonoDestinatario, fechaAproxEntrega, idUsuario, documentoRemitente, idEstado, idTamano, idTipo, lat, lng } = req.body;
  const paqId = await Paquete.findByPk(idPaquete);


  if (!paqId) {
    return res.json({
      status: 'error',
      msj: 'El paquete no existe o ya ha sido eliminado',
    });
  }

  await paqId.update({ codigoPaquete, direccionPaquete, detalleDireccionPaquete, pesoPaquete, contenidoPaquete, documentoDestinatario, nombreDestinatario, correoDestinatario, telefonoDestinatario, fechaAproxEntrega, idUsuario, documentoRemitente, idEstado, idTamano, idTipo, lat, lng });

  res.json({
    status: 'ok',
    msj: 'Paquete actualizado con éxito',
    paquete: paqId,
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const paqId = await Paquete.findByPk(id);

  if (!paqId) {
    return res.json({
      status: 'error',
      msj: 'El paquete no existe o ya ha sido eliminado',
    });
  }

  await paqId.destroy();

  res.json({
    status: 'ok',
    msj: 'Paquete eliminado con éxito',
  });
});

module.exports = router;
