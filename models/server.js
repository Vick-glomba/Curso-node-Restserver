const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config");


class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath= "/api/usuarios";
        //Conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //rutas de mi app
        this.routes();
        }

        async conectarDB() {
            await dbConnection();
        }

    middlewares(){

        //CORS
        this.app.use(cors());
        //Lectura y Parseo del body
        this.app.use(express.json());
        //directorio publico
        this.app.use(express.static("public"));
    }

    routes(){
        this.app.use(this.usuariosPath, require("../routes/usuarios") )
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Escuchando desde puerto ${this.port}`)
        })
    }

}




module.exports= Server