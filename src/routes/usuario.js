const Usuario = require('../models/Usuario');
const Rol = require('../models/rol');
const Estado = require('../models/estadoUsuario');
const TipoDoc = require('../models/tipoDocumentoUsuario');
const Paquete = require('../models/paquete');
const validateToken = require('../middlewares/tokenFunc');
const bcryptjs = require('bcryptjs');

const router = require('express').Router()

router.use(validateToken);

router.get('/', async (req, res) => {
  const users = await Usuario.findAll({
    attributes: {
      exclude: ['contrasenaUsuario']
    }
  });

  if (users.length === 0) {
    return res.json({
      status: 'error',
      msj: 'No hay usuarios registrados.',
    });
  }

  res.json(users);
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await Usuario.findByPk(id, {
    attributes: {
      exclude: ['contrasenaUsuario']
    }
  });

  if (!user) {
    return res.json({
      status: "error",
      msj: "No existe ningun usuario con el id proporcionado."
    });
  }

  res.json(user);
});

router.get("/paquete/cont/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  const paqs = await Paquete.findAll({ where: { idUsuario: idUsuario, idEstado: 3 } });

  res.json(paqs.length)
});


router.post('/', async (req, res) => {
  const { idUsuario, documentoUsuario, idTipoDocumento, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contrasenaUsuario, idRol, idEstado } = req.body;

  if (!documentoUsuario || !idTipoDocumento || !nombreUsuario || !apellidoUsuario || !telefonoUsuario || !correoUsuario || !contrasenaUsuario || !idRol || !idEstado) {
    return res.json({
      status: "error",
      msj: "Uno o mas campos vacios."
    });
  }

  const docRegex = new RegExp('^[0-9]{7,10}$');
  if (!docRegex.test(documentoUsuario)) {
    return res.json({
      status: "error",
      msj: "Documento inválido, mínimo 7 y máximo 10 dígitos numéricos.",
    });
  }

  const userDoc = await Usuario.findOne({ where: { documentoUsuario } })
  if (userDoc) {
    return res.json({
      status: "error",
      msj: "Ya existe un usuario registrado con ese documento."
    });
  }


  const emailRegex = new RegExp('^[\\w.%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  if (!emailRegex.test(correoUsuario)) {
    return res.json({
      status: "error",
      msj: "Correo inválido.",
    });
  }

  const emailUser = await Usuario.findOne({ where: { correoUsuario } })
  if (emailUser) {
    return res.json({
      status: "error",
      msj: "El correo ya está en uso."
    });
  }


  const telRegex = new RegExp('^[0-9]{10}$');
  if (!telRegex.test(telefonoUsuario)) {
    return res.json({
      status: "error",
      msj: "Teléfono inválido, debe contener 10 dígitos numéricos.",
    });
  }


  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d.*\d)(?=.*[!@#$%^&+=?.:,"°~;_¿¡*/{}|<>()]).{8,}$/;
  if (!passwordRegex.test(contrasenaUsuario)) {
    return res.json({
      status: "error",
      msj: "La contraseña debe contener mínimo: 8 caracteres, una minúscula, una mayúscula, 3 números y 1 caracter especial.",
    });
  }


  const rol = await Rol.findByPk(idRol);
  if (!rol) {
    return res.json({
      error: 'El idRol proporcionado no es válido.'
    });
  }

  const estado = await Estado.findByPk(idEstado);
  if (!estado) {
    return res.json({
      error: 'El idEstado proporcionado no es válido.'
    });
  }

  const tipoDoc = await TipoDoc.findByPk(idTipoDocumento);
  if (!tipoDoc) {
    return res.json({
      error: 'El idTipoDocumento proporcionado no es válido.'
    });
  }

  const salt = bcryptjs.genSaltSync();
  const pwdEncrypt = bcryptjs.hashSync(contrasenaUsuario, salt);

  const userC = await Usuario.create({ idUsuario, documentoUsuario, idTipoDocumento, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contrasenaUsuario: pwdEncrypt, idRol, idEstado })

  res.json({
    status: 'ok',
    msj: 'Usuario creado exitosamente.'
  });
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { idUsuario, documentoUsuario, idTipoDocumento, nombreUsuario, apellidoUsuario, telefonoUsuario, correoUsuario, contrasenaUsuario, idRol, idEstado } = req.body;
  const userId = await Usuario.findByPk(idUsuario);

  if (idUsuario == 1) {
    return res.json({
      status: 'error',
      msj: 'No puedes modificar este usuario.'
    });
  }

  if (!documentoUsuario || !idTipoDocumento || !nombreUsuario || !apellidoUsuario || !telefonoUsuario || !correoUsuario || !idRol) {
    return res.json({
      status: "error",
      msj: "Uno o mas campos vacios."
    });
  }

  if (!userId) {
    return res.json({
      status: "error",
      msj: 'El usuario a editar no existe.'
    });
  }



  const docRegex = new RegExp('^[0-9]{7,10}$');
  if (!docRegex.test(documentoUsuario)) {
    return res.json({
      status: "error",
      msj: "Documento inválido, mínimo 7 y máximo 10 dígitos numéricos.",
    });
  }

  if (documentoUsuario != userId.documentoUsuario) {
    const userExists = await Usuario.findOne({ where: { documentoUsuario } });
    if (userExists) {
      return res.json({
        status: "error",
        msj: "Ya existe un usuario registrado con ese documento."
      });
    }
  }


  const emailRegex = new RegExp('^[\\w.%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  if (!emailRegex.test(correoUsuario)) {
    return res.json({
      status: "error",
      msj: "Correo inválido.",
    });
  }

  if (correoUsuario != userId.correoUsuario) {
    const emailExists = await Usuario.findOne({ where: { correoUsuario } });
    if (emailExists) {
      return res.json({
        status: "error",
        msj: "El correo ya está en uso."
      });
    }
  }

  const telRegex = new RegExp('^[0-9]{10}$');
  if (!telRegex.test(telefonoUsuario)) {
    return res.json({
      status: "error",
      msj: "Teléfono inválido, debe contener 10 dígitos numéricos.",
    });
  }

  const salt = await bcryptjs.genSalt();
  let hashPwd = contrasenaUsuario;

  if (contrasenaUsuario) { // Si se proporciona una contraseña, se encripta
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d.*\d)(?=.*[!@#$%^&+=?.:,"°~;_¿¡*/{}|<>()]).{8,}$/;

    if (!passwordRegex.test(contrasenaUsuario)) {
      return res.json({
        status: "error",
        msj: "La contraseña debe contener mínimo: 8 caracteres, una minúscula, una mayúscula, 3 números y 1 caracter especial."
      });
    }

    // Obtener la contraseña actual de la base de datos y desencriptarla
    const currentPassword = userId.contrasenaUsuario;
    const isMatch = bcryptjs.compareSync(contrasenaUsuario, currentPassword);

    if (isMatch) {
      return res.json({
        status: "error",
        msj: "La nueva contraseña debe ser diferente a la contraseña actual."
      });
    }

    hashPwd = await bcryptjs.hash(contrasenaUsuario, salt);
  }

  const rol = await Rol.findByPk(idRol);
  if (!rol) {
    return res.json({
      status: "error",
      msj: 'El idRol proporcionado no es válido.'
    });
  }


  const estado = await Estado.findByPk(idEstado);
  if (!estado) {
    return res.json({
      status: "error",
      msj: 'El idEstado proporcionado no es válido.'
    });
  }

  const tipoDoc = await TipoDoc.findByPk(idTipoDocumento);
  if (!tipoDoc) {
    return res.json({
      status: "error",
      msj: 'El idTipoDocumento proporcionado no es válido.'
    });
  }

  await userId.update({
    idUsuario,
    documentoUsuario,
    idTipoDocumento,
    nombreUsuario,
    apellidoUsuario,
    telefonoUsuario,
    correoUsuario,
    contrasenaUsuario: hashPwd || userId.contrasenaUsuario, // Si contrasenaUsuario es vacío, se mantiene la contraseña actual 
    idRol,
    idEstado
  });

  res.json({
    status: 'ok',
    msj: 'El usuario ha sido actualizado exitosamente.'
  });
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = await Usuario.findByPk(id);

  if (!userId) {
    return res.json({
      status: 'error',
      msj: 'El usuario no existe o ya ha sido eliminado.',
    });
  }

  await userId.destroy();

  res.json({
    status: 'ok',
    msj: 'Usuario eliminado con exito.'
  });
});

module.exports = router