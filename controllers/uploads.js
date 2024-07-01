const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");
const { get } = require("https");



const obtenerImagen= async(req, res = response) => {
  const {coleccion, id} = req.params
    
  let modelo;

  switch (coleccion) {
    case "usuarios":
         modelo= await Usuario.findById(id)
         if (!modelo){
         return res.status(400).json({
            msg: `No existe un usuario con el id  ${id} `
          })
         }
      break;
         
      case "productos":
        modelo= await Producto.findById(id)
        if (!modelo){
        return res.status(400).json({
           msg: `No existe un producto con el id  ${id} `
         })
        }
     break;

    default:
      return res.status(500).json({msg: "Se me olvido validar esta coleccion"})
  }
fs.file
  //obtiene la imagen del servidor
  if (modelo.img){
    const pathImagen = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImagen)){
      return res.sendFile(pathImagen);
    }
  }
  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImagen)

}

const obtenerImagenCouldinary= async(req, res = response) => {
  const {coleccion, id} = req.params
    
  let modelo;

  switch (coleccion) {
    case "usuarios":
         modelo= await Usuario.findById(id)
         if (!modelo){
         return res.status(400).json({
            msg: `No existe un usuario con el id  ${id} `
          })
         }
      break;
         
      case "productos":
        modelo= await Producto.findById(id)
        if (!modelo){
        return res.status(400).json({
           msg: `No existe un producto con el id  ${id} `
         })
        }
     break;

    default:
      return res.status(500).json({msg: "Se me olvido validar esta coleccion"})
  }
fs.file
  //obtiene la imagen de cloudinary
  if (modelo.img){
    
      return res.json({img: modelo.img});
    }  
  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImagen)

}

const cargarArchivo= async(req=request, res= response)=>{
    
 try {
     const nombre= await subirArchivo(req.files, ["jpg", "jpeg"], "imagenes");
      res.json({nombre})
    
 } catch (msg) {
    res.status(400).json({ msg })
 }

}


const actualizarImagen= async(req= request, res =response) =>{

  const {coleccion, id} = req.params
    
  let modelo;

  switch (coleccion) {
    case "usuarios":
         modelo= await Usuario.findById(id)
         if (!modelo){
         return res.status(400).json({
            msg: `No existe un usuario con el id  ${id} `
          })
         }
      break;
         
      case "productos":
        modelo= await Producto.findById(id)
        if (!modelo){
        return res.status(400).json({
           msg: `No existe un producto con el id  ${id} `
         })
        }
     break;

    default:
      return res.status(500).json({msg: "Se me olvido validar esta coleccion"})
  }

    //limpiar imagenes previas
    if (modelo.img){
      const pathImagen = path.join(__dirname, "../uploads", coleccion, modelo.img);
      if (fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
      }
    }

    //subir al servidor el archivo
    const nombre= await subirArchivo(req.files, undefined, coleccion);
    //actualiza la imagen del modelo y lo graba en mongo
    modelo.img = nombre
    
    await modelo.save()

    res.json(modelo)
}

const actualizarImagenCloudinary= async(req= request, res =response) =>{

  const {coleccion, id} = req.params
    
  let modelo;

  switch (coleccion) {
    case "usuarios":
         modelo= await Usuario.findById(id)
         if (!modelo){
         return res.status(400).json({
            msg: `No existe un usuario con el id  ${id} `
          })
         }
      break;
         
      case "productos":
        modelo= await Producto.findById(id)
        if (!modelo){
        return res.status(400).json({
           msg: `No existe un producto con el id  ${id} `
         })
        }
     break;

    default:
      return res.status(500).json({msg: "Se me olvido validar esta coleccion"})
  }

    //limpiar imagenes previas
    if (modelo.img){
      const nombreArr = modelo.img.split("/");
      const nombre = nombreArr[nombreArr.length -1];
      const [public_id] = nombre.split(".")
      cloudinary.uploader.destroy(public_id);
    }
    const {tempFilePath}=req.files.archivo
    const {secure_url}= await cloudinary.uploader.upload(tempFilePath)

    
   
    //actualiza la imagen del modelo y lo graba en mongo
     modelo.img = secure_url
    
     await modelo.save()

    res.json(modelo)
}


module. exports= {
    cargarArchivo,
    actualizarImagen,
    obtenerImagen,
    actualizarImagenCloudinary,
    obtenerImagenCouldinary
}