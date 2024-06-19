const {response, request} = require("express")
const Usuario = require("../models/usuario")
const bcryptjs = require("bcryptjs")
const { generarJWT } = require("../helpers/generar-jwt")
const { googleVerify } = require("../helpers/google-verify")


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

const googleSingIn = async(req, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, img, correo}= await googleVerify(id_token)
        
        let usuario = await Usuario.findOne({correo})

            if (!usuario){
                //tengo que crearlo
                const data = {
                    nombre,
                    correo,
                    img,
                    password: ":P",
                    google:true,
                    rol: "USER_ROLE"
                }
                usuario = new Usuario( data);
                await usuario.save();
              }
            if (!usuario.estado){
                return res.status(401).json({
                    msg: "Hable con el administrador-- usuario bloqueado"
                })
              }
               //Generar el JWT
              const token= await generarJWT(usuario.id);

            res.json({
                usuario,
                token
            })
         } catch (error) {
                res.status(400).json({
                    ok:false,
                    msg: "El token no se pudo verificar"
                })
            }

}

module.exports= {
        login,
        googleSingIn
}