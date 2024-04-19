const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']

    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    precioMayor: {
        type: Number,
        default: 0
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String,
        unique: true
    },
    disponible: { type: Boolean, defult: true },
    img: { type: String },
    createdAt: {
        type: Date,
        default: Date.now // Establece la fecha actual por defecto al crear un documento
    }
});


ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model('Producto', ProductoSchema);
