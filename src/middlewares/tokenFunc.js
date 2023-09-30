const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

const validateToken = async (req, res, next) => {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ msj: 'Acceso denegado.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const { uid } = decodedToken;

    const user = await Usuario.findByPk(uid);

    if (!user) {
      return res.json({
        status: 'error',
        msj: 'Token inválido.',
      });
    }

    if (user.idEstado != 1) {
      return res.json({
        status: 'error',
        msj: 'Token inválido.',
      });
    }

    next();

  } catch (error) {
    return res.json({
      status: 'error',
      msj: 'Token inválido.',
    });
  }
};

module.exports = validateToken;