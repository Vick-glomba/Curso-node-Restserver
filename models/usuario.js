

const {Schema, model} = require("mongoose")

const UsuarioSchema =  Schema({
    
        nombre: {
            type: String,
            required: [true, "El nombre es Obligatorio"]
        },
        correo: {
            type: String,
            required: [true, "El correo es Obligatorio DB"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "La contraseña es Obligatoria DB"]
        },
        img: {
            type: String,
        },
        rol: {
            type: String,
            required: true,
            
        },
        estado: {
            type: Boolean,
            default: true,
        },
        google: {
            type: Boolean,
            default: false
        }
    
})

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id
    return usuario;
}



module.exports= model("Usuario", UsuarioSchema);