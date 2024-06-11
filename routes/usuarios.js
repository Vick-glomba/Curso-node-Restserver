
const {Router} = require("express");
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require("../controllers/usuarios");

const router= Router();


router.get("/", usuariosGet);

router.put("/:id", usuariosPut);

router.post("/", usuariosPost);

router.delete("/", usuariosDelete);

router.patch("/", usuariosPatch);

router.put("*", (req, res)=>{
    res.status(404).send("404 | no put")
    res.end();
})





module.exports= router