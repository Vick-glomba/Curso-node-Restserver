const { request, response } = require("express")
const { Categoria } = require("../models")

// obtenerCategorias - paginado - total - populate X
// obtenerCategoria -  populate {}
// actualizarCategoria - cambia nombre y no deberia existir en db
// borrarCategoria - cambiar estado: false


const obtenerCategorias= async(req = request, res = response) =>{
    const { limite= 5, desde = 0 } = req.query

    const query= {estado:true}
    
    const [total, categorias]= await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate("usuario", "nombre")
    ])
    
    res.json({
        total,
        categorias
    })
}

const obtenerCategoria= async(req = request, res = response) =>{
    const id = req.params.id
    const categoria= await Categoria.findById(id).populate("usuario", "nombre")
    res.json({
        categoria
    })
}

const crearCategoria= async(req = request, res = response) =>{
    
    const nombre = req.body.nombre.toUpperCase()
    const categoriaDB= await Categoria.findOne({nombre})
    if (categoriaDB){
       return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }
    //generar la data a guardar
        const data= {
        nombre,
        usuario: req.usuario._id
       }

    const categoria = new Categoria(data)
    //guardarDB
    await categoria.save()

    res.status(201).json({
        categoria
    })
}

const actualizarCategoria= async(req = request, res = response) =>{

    const {estado, usuario, ...data} = req.body;
    data.nombre= data.nombre.toUpperCase();
    data.usuario= req.usuario._id;
   
    const categoriaDB= await Categoria.findOne(data)
    if (categoriaDB){
       return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }
    const id = req.params.id
    const categoria= await Categoria.findByIdAndUpdate(id, data, {new:true})
    
    res.json({
        categoria,
        msg: "Categoria actualizada"
        })

}

const borrarCategoria= async(req = request, res = response) =>{
    const id = req.params.id
    const categoria= await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true})
    
    res.json({
        categoria,
        msg: "Categoria borrada correctamente"
    })
}

module.exports= {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}