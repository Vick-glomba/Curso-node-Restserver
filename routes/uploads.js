const {Router}= require("express");
const {cargarArchivo, actualizarImagen, obtenerImagen, actualizarImagenCloudinary, obtenerImagenCouldinary, } = require("../controllers/uploads");
const { check } = require("express-validator");
const { validarCampos, validarArchivoSubir } = require("../middlewares");
const { coleccionesPermitidas } = require("../helpers/db-validators");




const router= Router();


router.get("/:coleccion/:id",[
    check("id", "No es un id de mongo valido").isMongoId(),
    check("coleccion").custom(c=> coleccionesPermitidas(c, ["usuarios", "productos"])),
    validarCampos
], obtenerImagenCouldinary)

router.post("/",validarArchivoSubir, cargarArchivo)

router.put("/:coleccion/:id",[
    validarArchivoSubir,
    check("id", "No es un id de mongo valido").isMongoId(),
    check("coleccion").custom(c=> coleccionesPermitidas(c, ["usuarios", "productos"])),
    validarCampos
],actualizarImagenCloudinary)







module.exports= router