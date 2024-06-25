const {Router} = require("express");
const { check } = require("express-validator");
const validarCampos = require("../middlewares/validar-campos");
const { 
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
} = require("../controllers/categorias");
const { validarJWT, esAdminRol } = require("../middlewares");
const { existeCategoriaPorId } = require("../helpers/db-validators");

//crear middleware custom existeCategoria mirar DB validators - listo

const router= Router();

//obtener todas las categorias- publico - - listo- falta populate
router.get("/",[
    check("limite", "Limite no es un numero").isNumeric().optional(),
    check("desde", "Limite no es un numero").isNumeric().optional(),
    validarCampos
], obtenerCategorias);

//obtener una las categoria por id- publico - listo- falta populate
router.get("/:id",[
    check("id", "No es un id valido").isMongoId().custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

//crear categoria - privado- cualquier persona con un token valido - listo
router.post("/",[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos
], crearCategoria);

//actualizar - privado- cualquiera con token valido - listo
router.put("/:id",[
    validarJWT,
    check("nombre", "El nombre a modificar es obligatorio").not().isEmpty(),
    check("id", "No es un id valido").isMongoId().custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//borrar una categoria - admin - listo
router.delete("/:id",[
    validarJWT,
    esAdminRol,
    check("id", "No es un id valido").isMongoId().custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria)

module.exports= router