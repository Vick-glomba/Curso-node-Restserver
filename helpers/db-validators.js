const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario= require("../models/usuario");


const esRoleValido= async(rol= "") => {
    const existeRol= await Role.findOne({rol})
    if (!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
}

 const emailExiste= async(correo = "") =>{

     const existeEmail= await Usuario.findOne({correo});
        if (existeEmail){
            throw new Error(`El correo '${correo}', ya esta registrado`)
         }
       
 }

 const existeUsuarioPorId= async(id= "") =>{
    const existeId= await Usuario.findById(id);
    if (!existeId){
        throw new Error(`El id ${id}, no esta registrado en la base de datos`)
    }
 }

 const existeCategoriaPorId= async(id= "") =>{
    const existeId= await Categoria.findById(id);
    if (!existeId){
        throw new Error(`El id ${id}, no esta registrado en la DB de categorias`)
    }
 }
 const existeProductoPorId= async(id= "") =>{
    const existeId= await Producto.findById(id);
    if (!existeId){
        throw new Error(`El id ${id}, no esta registrado en la DB de Productos`)
    }
 }

 
module.exports= {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
    
}

