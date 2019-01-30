var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();

var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdautenticacion = require('../middlewares/autenticacion');
var Usuario = require('../models/usuario');

//====================================
// ====== Servicio GET conseguir informacion usuario servicio get
//-===================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });


        });



});




//====================================
// ====== Servicio PUT conseguir informacion usuario servicio get
//-===================================
app.put('/:id', mdautenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el :' + id + 'no existe',
                errors: { message: 'No existe el usuario buscado' }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save((err, usuarioGuardado) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar  usuario',
                    errors: err
                });

            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});


//====================================
// ====== Servicio POST conseguir informacion usuario servicio get
//-===================================

app.post('/', mdautenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),

        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });






});

//====================================
// ====== Servicio DEL conseguir informacion usuario servicio get
//-===================================

app.delete('/:id', mdautenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;