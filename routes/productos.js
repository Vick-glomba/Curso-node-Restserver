const {Router} = require("express");
const { check } = require("express-validator");
const validarCampos = require("../middlewares/validar-campos");
const { 
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require("../controllers/productos");
const { validarJWT, esAdminRol } = require("../middlewares");
const { existeProductoPorId, existeCategoriaPorId } = require("../helpers/db-validators");



const router= Router();

//obtener todas las categorias- publico - - listo- 
router.get("/",[
    check("limite", "Limite no es un numero").isNumeric().optional(),
    check("desde", "Limite no es un numero").isNumeric().optional(),
    validarCampos
], obtenerProductos);

//obtener una las categoria por id- publico - listo- 
router.get("/:id",[
    check("id", "No es un id mongo valido").isMongoId().custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

//crear categoria - privado- cualquier persona con un token valido - listo
router.post("/",[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria es obligatorio").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//actualizar - privado- cualquiera con token valido - listo
router.put("/:id",[
    validarJWT,
    check("categoria").custom(existeCategoriaPorId).optional(),
    check("id").custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//borrar una categoria - admin - listo
router.delete("/:id",[
    validarJWT,
    esAdminRol,
    check("id", "No es un id mongo valido").isMongoId().custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports= router