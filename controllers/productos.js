const { response } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async (req, res = response) => {
    const { limite, desde = 0, categoria } = req.query;
    const query = { estado: true };

    if (categoria) {
        query.categoria = categoria; // Agregar filtro por categoría si se proporciona
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .sort({ createdAt: -1 }) 
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
};

const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );
 
}

const crearProducto = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ descripcion: body.descripcion });

    
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.descripcion }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    // Guardar DB
    const nuevoProducto = await producto.save();
    await nuevoProducto
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();

    res.status(201).json( nuevoProducto );

}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    await producto
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();
        
    res.json( producto );

}

const borrarProducto = async(req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( productoBorrado );
}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}