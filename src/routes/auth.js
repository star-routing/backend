const transporter = require('../middlewares/mailer');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { generateJWT } = require('../helpers/generateJWT');
const router = require('express').Router();

const fs = require('fs');
const path = require('path');

// pa leer el contenido del archivo con la plantilla de correo
const leerPlantillaCorreo = () => {
    const rutaPlantilla = path.join(__dirname, '../templates', 'forgotMail.html');
    return fs.readFileSync(rutaPlantilla, 'utf-8');
};

router.post('/login', async (req, res) => {

    const { correoUsuario, contrasenaUsuario } = req.body;

    if (!correoUsuario || !contrasenaUsuario) {
        return res.json({
            status: "error",
            msj: "Correo y/o contraseña vacios."
        });
    }

    const user = await Usuario.findOne({ where: { correoUsuario } });

    try {
        if (!user) {
            return res.json({
                status: "error",
                msj: "Correo y/o contraseña incorrectos."
            });
        }

        const validPassword = bcryptjs.compareSync(contrasenaUsuario, user.contrasenaUsuario);
        if (!validPassword) {
            return res.json({
                status: "error",
                msj: "Correo y/o contraseña incorrectos."
            });
        }

        if (user.idEstado == 2) {
            return res.json({
                status: "error",
                msj: "Usuario no habilitado."
            });
        }

        /* if(user.idRol != 1 ){
            return res.json({
                status: "error",
                msj: "Usted no es admin"
            });
        } */

        const token = await generateJWT(user.idUsuario);

        user.contrasenaUsuario = undefined;

        res.json({
            status: "ok",
            msj: "User comprobao 🥶", user, token
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            msj: 'Error en el servidor.'
        });
    }

});


router.post('/forgot-pwd', async (req, res) => {
    const { documentoUsuario, correoUsuario } = req.body;

    if (!correoUsuario || !documentoUsuario) {
        return res.json({
            status: "error",
            msj: "Todos los campos son requeridos."
        });
    }

    const user = await Usuario.findOne({ where: { documentoUsuario, correoUsuario } });

    try {
        if (!user) {
            return res.json({
                status: "error",
                msj: "Credenciales incorrectas."
            });
        }

        if (user.idEstado != 1) {
            return res.json({
                status: "error",
                msj: "Usuario no habilitado."
            });
        }

        const token = await generateJWT(user.idUsuario);
        const verificacionLink = `https://star-routing.netlify.app/auth/new-pwd/${token}`;

        let plantillaCorreo = leerPlantillaCorreo();

        plantillaCorreo = plantillaCorreo.replace(/{VERIFICATION_LINK}/g, verificacionLink);


        await transporter.sendMail({
            from: '"Star ☆ Routing" <soporte.starrouting@gmail.com>', // sender address
            to: user.correoUsuario, // list of receivers
            subject: "Recuperar contraseña", // Subject line
            html: plantillaCorreo, // html body
        });

        return res.json({
            status: "ok",
            msj: "Hemos enviado un correo electrónico a tu cuenta con un enlace para restablecer tu contraseña.",
        });

    } catch (error) {
        return res.json({
            status: 'error',
            msj: 'Ha ocurrido un error al recuperar tu contraseña. Por favor, inténtalo nuevamente.',
        });
    }
});


router.post('/new-pwd', async (req, res) => {
    const { newPwd, token } = req.body;

    if (!newPwd || !token) {
        return res.json({
            status: "error",
            msj: "Todos los campos son requeridos."
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWTSECRET);

        const userId = decodedToken.uid;

        const user = await Usuario.findByPk(userId);
        if (!user) {
            return res.json({
                status: "error",
                msj: "Usuario no encontrado."
            });
        } else if (user.idEstado != '1') {
            return res.json({
                status: "error",
                msj: "Usuario no habilitado."
            });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d.*\d)(?=.*[!@#$%^&+=?.:,"°~;_¿¡*/{}|<>()]).{8,}$/;
        if (!passwordRegex.test(newPwd)) {
            return res.json({
                status: "error",
                msj: "La contraseña debe contener mínimo: 8 caracteres, una minúscula, una mayúscula, 3 números y 1 caracter especial.",
            });
        }

        const currentPwd = user.contrasenaUsuario;
        const isMatch = bcryptjs.compareSync(newPwd, currentPwd);

        if (isMatch) {
            return res.json({
                status: "error",
                msj: "La nueva contraseña debe ser diferente a la contraseña actual."
            });
        }

        const salt = await bcryptjs.genSalt();
        const hashedPwd = await bcryptjs.hash(newPwd, salt);

        user.contrasenaUsuario = hashedPwd;
        await user.save();

        return res.json({
            status: "ok",
            msj: "Si estabas en la app móvil, ya puedes volver a ingresar, si no, solo cierra este mensaje."
        });

    } catch (error) {
        return res.json({
            status: 'error',
            msj: 'Ha ocurrido un error al cambiar tu contraseña. Por favor, inténtalo nuevamente o solicita un nuevo correo.',
        });
    }
});


module.exports = router