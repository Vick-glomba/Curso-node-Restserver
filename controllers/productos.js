const { request, response } = require("express")
const { Categoria, Producto } = require("../models")



// obtenerCategorias - paginado - total - populate X
// obtenerCategoria -  populate {}
// actualizarCategoria - cambia nombre y no deberia existir en db
// borrarCategoria - cambiar estado: false


const obtenerProductos= async(req = request, res = response) =>{
    const { limite= 5, desde = 0 } = req.query

    const query= {estado:true}
    
    const [total, productos]= await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate("usuario", "nombre")
            .populate("categoria", "nombre")
    ])
    
    res.json({
        total,
        productos
    })
}

const obtenerProducto= async(req = request, res = response) =>{
    const id = req.params.id
    const producto= await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre")
    res.json({
        producto
    })
}

const crearProducto= async(req = request, res = response) =>{
    
   
    const {estado, usuario, ...body} = req.body
    const nombre=req.body.nombre.toUpperCase()
    //Verificamos si existe ya el producto
    const productoDB= await Producto.findOne({nombre})
    if (productoDB){
       return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }
    
    const data= {
            ...body,
        nombre: nombre,
        usuario: req.usuario._id,
      
       }
    const producto = new Producto(data)
    
    await producto.save()
    
      res.status(201).json({
        producto,
        msg: "Producto creado exitosamente"
    })
}

const actualizarProducto= async(req = request, res = response) =>{
    
    const id = req.params.id
    let {estado, usuario, ...data} = req.body;
    if(data.nombre){
        data.nombre= data.nombre.toUpperCase();
    }
    data.usuario= req.usuario._id;

   
    const producto= await Producto.findByIdAndUpdate(id, data, {new:true})
    //.populate("categoria", "nombre")
    //.populate("usuario", "nombre")
    
    res.json({
        producto,
        msg: "Producto actualizado"
        })

}

const borrarProducto= async(req = request, res = response) =>{
    const id = req.params.id
    const producto= await Producto.findByIdAndUpdate(id, {estado: false}, {new:true})
    //.populate("categoria", "nombre")
    //.populate("usuario", "nombre")
    res.json({
        producto,
        msg: "Producto borrado correctamente"
    })
}

module.exports= {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}