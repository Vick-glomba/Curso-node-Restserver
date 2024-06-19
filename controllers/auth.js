const {response, request} = require("express")
const Usuario = require("../models/usuario")
const bcryptjs = require("bcryptjs")
const { generarJWT } = require("../helpers/generar-jwt")
const login = async(req = request, res = response) => {
    const {password, correo} = req.body

    try {
        //verificar si el email existe
        const usuario= await Usuario.findOne({correo})
        if (!usuario){
            return res.status(400).json({ 
                msg: "Usuario / Password no son correctos - Correo no existe"
            })
        }
        //verificar el estado en db
        if (!usuario.estado){
            return res.status(400).json({ 
                msg: "Usuario / Password no son correctos - Estado: false"
            })
        }
        //verificar la contraseña
        const contraseñaValida = bcryptjs.compareSync(password, usuario.password);
        if (!contraseñaValida) {
            return res.status(400).json({
                msg:"Usuario / Password no son correctos - Contraseña incorrecta"
            })
        }
        //Generar el JWT
        const token= await generarJWT(usuario.id);
       



        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }


   
}



module.exports= {
        login
}