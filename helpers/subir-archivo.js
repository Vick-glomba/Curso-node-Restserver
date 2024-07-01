const path = require("path")
const { v4: uuidv4 } = require('uuid');



const extDefault= ["jpeg", "png", "jpg", "gif"]

const subirArchivo= (files, extensionesValidas= extDefault, carpeta= "")=>{


    return new Promise((resolve, reject)=>{

       
            const {archivo} = files;
            const nombreCortado= archivo.name.split(".")
            const extension= nombreCortado[nombreCortado.length - 1]
            
            //validar la extension
            
            if (!extensionesValidas.includes(extension)){
                return reject(`las extension ${extension} no es permitida, solo se admite:  ${extensionesValidas}`)
            }
            const nombreTemp= uuidv4()+ "." + extension;
            const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp)
          
            archivo.mv(uploadPath,(err)=> {
              if (err) {
                return reject({err});
              }
          
              resolve(nombreTemp);
             });
            
        
            
        
    })

}








module.exports={
    subirArchivo
}