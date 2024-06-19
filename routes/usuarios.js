
const {Router} = require("express");
const { check } = require("express-validator");

const { validarCampos,
        validarJWT,
        esAdminRol,
        tieneRol
} = require("../middlewares");

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch
} = require("../controllers/usuarios");

const { emailExiste,
        esRoleValido, 
        existeUsuarioPorId
} = require("../helpers/db-validators");

const router= Router();

router.get("/",[
    check("limite", "Limite no es un numero").isNumeric().optional(),
    check("desde", "desde no es un numero").isNumeric().optional(),
    validarCampos
], usuariosGet);

router.put("/:id",[
    check("id", "No es un ID valido").isMongoId().custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos
], usuariosPut);
    
router.post("/",[
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener mas de 6 letras").isLength({ min: 6}),
    check("correo", "El correo no es valido").isEmail().custom(emailExiste),
    // check("rol", "No es un rol es valido").isIn(["ADMIN_ROLE","USER_ROLE"]),
    check("rol").custom(esRoleValido),
    validarCampos
], usuariosPost);

router.delete("/:id", [
    validarJWT,
    //esAdminRol,
    tieneRol("ADMIN_ROLE", "VENTAS_ROLE", "USER_ROLE"),
    check("id", "No es un ID valido").isMongoId().custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch("/", usuariosPatch);

router.put("*", (req, res)=>{
    res.status(404).send("404 | no put")
    res.end();
})


module.exports= router