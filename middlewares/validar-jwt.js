const { response, request  } = require("express")
const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario")



const validarJWT= async(req = request, res = response, next ) =>{
    const token = req.header("x-token")
   if (!token){
    return res.status(401).json({
      msg:  "No hay token en la peticion"
   })
   }
    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY );
        const usuario= await Usuario.findById(uid);

        //con esto filtro si alguien modifica un token con un usuario que no esta en la DB
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no valido- usuario no existe en DB"
            })
        }
        // verifico si el usuario no esta borrado en la base de datos
        if (!usuario.estado){
            return res.status(401).json({
                msg: "Token no valido- usuario con estado: false"
            })
        }


        req.usuario= usuario
       

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:"Token no valido"
        })
    }



}




module.exports= {
    validarJWT
}