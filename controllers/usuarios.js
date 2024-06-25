const {response, request}= require("express");
const bcryptjs = require("bcryptjs");
const Usuario= require("../models/usuario");







const usuariosGet = async(req = request, res = response)=>{
    //extraigo los querys despues de ?
    const {limite = 5, desde = 0} = req.query;
   
    const query= {estado:true}
    
    const [total, usuarios]= await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
    ])
    res.json({
        total,
        usuarios
    })
}

const usuariosPost= async(req = request, res = response)=>{

    const { nombre, correo, password, rol } = req.body;
    const usuario=new Usuario({nombre, correo, password, rol});
      
    //Encriptar la contraseña
    const salt= bcryptjs.genSaltSync();
    usuario.password= bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();
    res.json(usuario)
}

const usuariosPut= async(req = request, res = response)=>{
    //extraigo el PARAMETRO id colocado despues de /
    const id = req.params.id;
    //destructuro los datos que NO quiero que puedan modificar
    //y el "resto" QUE EXISTAN se modifican.
    const {_id, password, google, correo, ...resto} = req.body

    //TODO validar contra base de datos
    if(password){
        //encriptar la contraseña
        const salt= bcryptjs.genSaltSync();
        resto.password= bcryptjs.hashSync(password, salt);
    }
    
    const usuarioDB= await Usuario.findByIdAndUpdate(id, resto, {new:true});
    
    
    res.json(usuarioDB)
}

const usuariosPatch=(req = request, res = response)=>{
    res.json({
        msg: "patch API - Controlador"
    })
}

const usuariosDelete= async(req = request, res = response)=>{
    //extraigo el id enviado despues del /  PARAMETRO
    const {id} = req.params;
    
    const usuario= await Usuario.findByIdAndUpdate(id, {estado: false}, {new:true})
     
    res.json({
        usuario,
        msg:"El usuario fue borrado correctamente"
    })
}



module.exports= {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}