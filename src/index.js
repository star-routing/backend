const express = require("express");
const cors = require("cors");
const tokenRoute = require("./middlewares/tokenRoute");
const usuarios = require("./routes/usuario")
const auth = require('./routes/auth')
const estadoUsuario = require("./routes/estadoUsuario");
const EstadoPaquete = require("./routes/estadoPaquete");
const estadoRastreo = require("./routes/estadoRastreo");
const tipoDocumentoUsuario = require("./routes/tipoDocumentoUsuario");
const tipoDocumentoCliente = require("./routes/tipoDocumentoCliente");
const roles = require("./routes/rol")
const TamanoPaquete = require("./routes/tamanoPaquete");
const TipoPaquete = require("./routes/tipoPaquete");
const permisos = require("./routes/permiso");
const rolPermisos = require("./routes/rolPermiso");
const clientes = require("./routes/cliente");
const paquetes = require("./routes/paquete");
const entregas = require("./routes/entrega");
const rastreo = require("./routes/rastreo");
const db = require("./db/database");
const app = express();
const port = process.env.PORT || 3030;

(async () => {
    try {
        await db.authenticate()
        await db.sync();
        console.log("melos en la base de datos");
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }

})()

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.use('/usuario', usuarios);

app.use('/token', tokenRoute);

app.use('/estadoUsuario', estadoUsuario);

app.use('/estadoPaquete', EstadoPaquete);

app.use('/estadoRastreo', estadoRastreo);

app.use('/tamanoPaquete', TamanoPaquete);

app.use('/tipoPaquete', TipoPaquete);

app.use('/tipoDocumentoUsuario', tipoDocumentoUsuario);

app.use('/tipoDocumentoCliente', tipoDocumentoCliente);

app.use('/rol', roles);

app.use('/permiso', permisos);

app.use('/rolPermiso', rolPermisos);

app.use('/cliente', clientes);

app.use('/paquete', paquetes);

app.use('/entrega', entregas);

app.use('/rastreo', rastreo);

app.use('/auth', auth)


app.listen(port, () => {
    console.log("Server trotando en el puerto: ", port);
});