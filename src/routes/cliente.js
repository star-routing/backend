const Cliente = require('../models/cliente');
const TipoDocumento = require('../models/tipoDocumentoCliente');
const Paquete = require('../models/paquete');
const validateToken = require('../middlewares/tokenFunc');

const router = require('express').Router()

router.use(validateToken)

router.get('/', async (req, res) => {
  const clientes = await Cliente.findAll();

  /* if (clientes.length < 1) {
    return res.json({
      status: "error",
      msj: "No hay clientes registrados."
    });
  } */

  res.json(clientes);
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const cliente = await Cliente.findByPk(id)

  if (!cliente) {
    return res.json({
      status: "error",
      msj: "No existe ningun cliente con el id proporcionado."
    });
  }

  res.json(cliente);
});


router.post('/', async (req, res) => {
  const { idCliente, documentoCliente, idTipoDocumento, nombreCliente, telefonoCliente, correoCliente, direccionCliente, detalleDireccionCliente, lat, lng } = req.body;

  if (!documentoCliente || !idTipoDocumento || !nombreCliente || !telefonoCliente || !correoCliente || !direccionCliente) {
    return res.json({
      status: "error",
      msj: "Uno o mas campos vacios."
    });
  }

  if (!lat || !lng) {
    return res.json({
      status: "error",
      msj: "Debes seleccionar una ubicación en el mapa, o en las recomendaciones de direcciones."
    });
  }


  const docRegex = new RegExp('^[0-9]{7,10}$');
  if (!docRegex.test(documentoCliente)) {
    return res.json({
      status: "error",
      msj: "Documento inválido, mínimo 7 y máximo 10 dígitos numéricos.",
    });
  }

  const clienteDoc = await Cliente.findOne({ where: { documentoCliente } })
  if (clienteDoc) {
    return res.json({
      status: "error",
      msj: "Ya existe un cliente con ese documento."
    });
  }


  const emailRegex = new RegExp('^[\\w.%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  if (!emailRegex.test(correoCliente)) {
    return res.json({
      status: "error",
      msj: "Correo inválido.",
    });
  }

  const emailCliente = await Cliente.findOne({ where: { correoCliente } })
  if (emailCliente) {
    return res.json({
      status: "error",
      msj: "El correo ya está en uso."
    });
  }


  const telRegex = new RegExp('^[0-9]{10}$');
  if (!telRegex.test(telefonoCliente)) {
    return res.json({
      status: "error",
      msj: "Teléfono inválido, debe contener 10 dígitos numéricos.",
    });
  }


  const tDocumento = await TipoDocumento.findByPk(idTipoDocumento);
  if (!tDocumento) {
    return res.json({
      status: "error",
      msj: 'El tipo documento no existe.'
    });
  }

  const clienteC = await Cliente.create({ idCliente, documentoCliente, idTipoDocumento, nombreCliente, telefonoCliente, correoCliente, direccionCliente, detalleDireccionCliente, lat, lng })

  res.json({
    status: "ok",
    msj: 'Cliente creado exitosamente.',
    Cliente: clienteC
  });
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { idCliente, documentoCliente, idTipoDocumento, nombreCliente, telefonoCliente, correoCliente, direccionCliente, detalleDireccionCliente, lat, lng } = req.body;
  const cltId = await Cliente.findByPk(idCliente);

  if (!idTipoDocumento || !nombreCliente || !telefonoCliente || !correoCliente || !direccionCliente) {
    return res.json({
      status: "error",
      msj: "Uno o mas campos vacios."
    });
  }

  if (!idCliente) {
    return res.json({
      status: "error",
      msj: 'El cliente a editar no existe.'
    });
  }

  const docRegex = new RegExp('^[0-9]{7,10}$');
  if (!docRegex.test(documentoCliente)) {
    return res.json({
      status: "error",
      msj: "Documento inválido, mínimo 7 y máximo 10 dígitos numéricos.",
    });
  }

  if (documentoCliente != cltId.documentoCliente) {
    const cltExists = await Cliente.findOne({ where: { documentoCliente } });
    if (cltExists) {
      return res.json({
        status: "error",
        msj: "Ya existe un cliente con ese documento."
      });
    }
  }


  const emailRegex = new RegExp('^[\\w.%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  if (!emailRegex.test(correoCliente)) {
    return res.json({
      status: "error",
      msj: "Correo inválido.",
    });
  }

  if (correoCliente !== cltId.correoCliente) {
    const emailExists = await Cliente.findOne({ where: { correoCliente } });
    if (emailExists) {
      return res.json({
        status: "error",
        msj: "El correo ya está en uso."
      });
    }
  }


  const telRegex = new RegExp('^[0-9]{10}$');
  if (!telRegex.test(telefonoCliente)) {
    return res.json({
      status: "error",
      msj: "Teléfono inválido, debe contener 10 dígitos numéricos.",
    });
  }

  const tDocumento = await TipoDocumento.findByPk(idTipoDocumento);
  if (!tDocumento) {
    return res.json({
      status: "error",
      msj: 'El tipo documento no existe.'
    });
  }

  await cltId.update({ idCliente, documentoCliente, idTipoDocumento, nombreCliente, telefonoCliente, correoCliente, direccionCliente, detalleDireccionCliente, lat, lng });

  res.json({
    status: "ok",
    msj: 'Cliente actualizado con exito.',
    Cliente: cltId
  });
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const cltId = await Cliente.findByPk(id);

  if (!cltId) {
    return res.json({
      status: 'error',
      msj: 'El cliente no existe o ya ha sido eliminado.'
    });
  }

  const paqAsociados = await Paquete.findAll({ where: { documentoRemitente: cltId.documentoCliente } });

  if (paqAsociados.length > 0) { //ESTA VUELTA ES PARA VER SI EL CLIENTE TIENE PAQUETES ASOCIADOS
    return res.json({
      status: 'error',
      msj: 'No se puede eliminar el cliente porque tiene paquetes asociados.'
    });
  }

  await cltId.destroy();

  res.json({
    status: 'ok',
    msj: 'Cliente eliminado con exito.'
  });
});

module.exports = router