const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

router.post('/', async (req, res) => {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({ msj: 'Token no proporcionado.' });
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

        res.json({
            status: 'ok',
            msj: 'Token válido.',
        })

    } catch (error) {
        return res.json({
            status: 'error',
            msj: 'Token inválido.',
        });
    }
});

module.exports = router;