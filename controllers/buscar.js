

const { request, response, query } = require("express");
const usuario = require("../models/usuario");
const { Usuario, Categoria, Producto } = require("../models");
const categoria = require("../models/categoria");
const { ObjectId } = require("mongoose").Types;


const coleccionesPermitidas= [
    "usuarios",
    "categorias",
    "roles",
    "productos",
    "productosPorCategoria"
]

const buscarUsuarios= async(termino= "", res = response) => {

    const esMongoId= ObjectId.isValid(termino);
    if (esMongoId){
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, "i")

        const usuarios = await Usuario.find({
            $or: [{nombre: regex},{correo: regex}],
            $and:[{estado: true}]
        })
        res.json({
            results: usuarios
        })
}

const buscarCategorias= async(termino= "", res = response) => {

    const esMongoId= ObjectId.isValid(termino);
    if (esMongoId){
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, "i")

        const categoria = await Categoria.find({nombre: regex, estado: true})
        res.json({
            results: categoria
        })
}

const buscarProductos= async(termino= "", res = response) => {

    const esMongoId= ObjectId.isValid(termino);
    if (esMongoId){
        const producto = await Producto.findById(termino)
        .populate("categoria", "nombre")
        .populate("usuario", "nombre")
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, "i")

        const producto = await Producto.find({nombre: regex, estado: true})
        .populate("categoria", "nombre")
        .populate("usuario", "nombre")
        res.json({
            results: producto
        })
}

const buscarProductosPorCategoria= async(termino= "", res = response) => {

    const esMongoId= ObjectId.isValid(termino);
    if (esMongoId){
        const producto = await Producto.find({categoria: termino, estado: true})
        .populate("nombre")
        .populate("categoria", "nombre")
        .populate("usuario", "nombre")
        
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    
    const regex = new RegExp(termino, "i")

    const categoria= await Categoria.findOne({nombre: regex}, {estado:true})
    if (categoria){
        
        const productos = await Producto.find({categoria},{estado: true})
            .populate("nombre")
            .populate("categoria", "nombre")
            .populate("usuario", "nombre")
            
          return  res.json({
                results: productos
            })
    }
    res.json({
        results: []
    })

}

const buscar = async(req = request, res =response) => {
    const {coleccion, termino} = req.params

    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    let respuesta;
    switch (coleccion) {
            case "usuarios":
                 buscarUsuarios(termino, res)
                    
            break;
            case "categorias":
                buscarCategorias(termino, res)
            break;
            case "productos":
                buscarProductos(termino, res)
            break;
            case "productosPorCategoria":
                buscarProductosPorCategoria(termino, res)
            break;
                default:
                    res.status(500).json({
                        msg: "Se me olvido hacer esta busqueda"
                    })
                    break;
       
    }

 
}




module.exports= {
    buscar
}