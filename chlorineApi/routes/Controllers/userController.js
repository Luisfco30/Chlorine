const router = require('express').Router();
const bcrypt = require('bcryptjs');
const multipart = require('connect-multiparty');
const nodemailer = require('nodemailer');

// MiddleWare
const MiddleWare = multipart({
    uploadDir: __dirname.split('routes')[0] + "public/docs"

});
const conn = require('../DB/conn');
const jwt = require('../Middleware/JwtAuth');


// Registro al Newsletter
router.post( '/newsletter', ( req, res )  => {
    let transport = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
            user: 'jazalocked@hotmail.com',
            pass: 'EternumInfinity118'

        }

    });

    transport.sendMail({
        to: req.body.email,
        subject: 'Newsletter',
        html: `<h1 style="background-color: #333; margin: 0 auto;">Chlorine</h1>
                <p>Bienvenido al Newsletter :(</p>`

    }).then( result => {
        const data = {
            status: 'success',
            code: 200,
            result: result

        }

        res.send(data, data.code);

    }).catch( error => {
        const data = {
            status: 'error',
            code: 400,
            error: error

        }

        console.log(data);
        res.send(data, data.code);

    })

});

//
//  CONTROL DE USUARIO GENERAL
//

// Register
router.post( '/createUser', ( req, res ) => {
    const query = 'CALL stp_getUserByEmail(?)';
    const dataQuery = [req.body.email];

    conn.query( query, dataQuery, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo crear el usuario',
                error: error

            }

            res.send(data, data.code);

        } else {
            if ( response[0][0] ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: El correo ya esta registrado',
                    error: 'Email unique'

                }

                res.send(data, data.code);

            } else {
                bcrypt.genSalt( 10, ( error, salt ) => {
                    if ( error ) {
                        const data = {
                            status: 'error',
                            code: 400,
                            message: 'Error: No se pudo encriptar contraseña',
                            error: error
        
                        }
                        
                        res.send(data, data.code);

                    } else {
                        bcrypt.hash( req.body.password, salt, ( error, hash ) => {
                            if ( error ) {
                                const data = {
                                    status: 'error',
                                    code: 400,
                                    message: 'Error: No se pudo encriptar contraseña',
                                    error: error
                
                                }
                                
                                res.send(data, data.code);

                            } else {
                                const user = [
                                    req.body.name,
                                    req.body.email,
                                    hash,
                                    req.body.nickname

                                ]
                                const createUser = 'CALL stp_createUser(?,?,?,?)';

                                conn.query( createUser, user, ( error, response ) => {
                                    if ( error ) {
                                        const data = {
                                            status: 'error',
                                            code: 400,
                                            message: 'Error: No se pudo crear el usuario',
                                            error: error
                        
                                        }
                                        
                                        res.send(data, data.code);

                                    } else {
                                        const dataToken = {
                                            sub: response[0][0].id,
                                            alias: response[0][0].nickname,
                                            email: response[0][0].email,
                                            descrip: response[0][0].descrip,
                                            name: response[0][0].name,
                                            url: response[0][0].img_user,
                                            login: true,
                                            date: Date.now()
                            
                                        }
                    
                                        const jwtA = new jwt();
                                        const token = jwtA.getToken(dataToken);

                                        const data = {
                                            status: 'success',
                                            code: 200,
                                            message: 'Success: Se creo el usuario correctamente',
                                            token: token,
                                            dataUser: dataToken,
                                            user: response[0]
                        
                                        }
                                        
                                        res.send(data, data.code);

                                    }

                                });

                            }

                        });

                    }

                });

            }

        }

    });

});

// Login
router.post( '/loginUser', ( req, res ) => {
    const query = 'CALL stp_getUserByEmail(?)';
    const dataQuery = [req.body.email];

    conn.query( query, dataQuery, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo logear al usuario',
                error: error

            }

            res.send(data, data.code);

        } else {
            if ( response[0][0] ) {
                bcrypt.compare( req.body.password, response[0][0].password, ( error, result ) => {
                    if ( error ) {
                        const data = {
                            status: 'error',
                            code: 400,
                            message: 'Error: No se pudo conectar a la bd',
                            error: error
            
                        }
            
                        res.send(data, data.code);

                    } else if ( result ) {
                        const dataToken = {
                            sub: response[0][0].id,
                            alias: response[0][0].nickname,
                            email: response[0][0].email,
                            descrip: response[0][0].descrip,
                            name: response[0][0].name,
                            url: response[0][0].img_user,
                            login: true,
                            date: Date.now()
            
                        }
    
                        const jwtA = new jwt();
                        const token = jwtA.getToken(dataToken);

                        const data = {
                            status: 'success',
                            code: 200,
                            message: 'Success: Usuario logeado correctamente',
                            token: token,
                            user: dataToken

                        }
            
                        console.log(data);
                        res.send(data, data.code);

                    } else {
                        const data = {
                            status: 'error',
                            code: 400,
                            message: 'Error: Contraseña invalida',
                            error: 'invalid password'
            
                        }
            
                        res.send(data, data.code);

                    }

                });

            } else {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: Correo invalido',
                    error: 'user null'
    
                }
    
                res.send(data, data.code);

            }

        }

    });

});

// Avatar
router.put( '/avatarUser', MiddleWare, ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    console.log('hola');
    const ruta = 'http://localhost:3000/docs/' + req.files.files.path.split('docs')[1].substr(1);

    const query = 'CALL stp_avatarUSer(?,?)';
    const dataQuery = [
        user.user.sub,
        ruta

    ]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo subir foto',
                    error: error

                }

                console.log(data);
                res.send(data, data.code);

            } else {
                const dataToken = {
                    sub: response[0][0].id,
                    alias: response[0][0].nickname,
                    email: response[0][0].email,
                    descrip: response[0][0].descrip,
                    name: response[0][0].name,
                    url: response[0][0].img_user,
                    login: true,
                    date: Date.now()
    
                }

                const jwtA = new jwt();
                const token2 = jwtA.getToken(dataToken);

                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Foto subida correctamente',
                    dataUser: dataToken,
                    token: token2,
                    user: response[0]

                }

                console.log(data);
                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

});

// Update user
router.put( '/updateUser', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);
    console.log(req.body);

    const query = 'CALL stp_updateUser(?,?,?,?,?)';
    const dataQuery = [
        user.user.sub,
        req.body.name,
        req.body.email,
        req.body.nickname,
        req.body.descrip

    ]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo actualizar datos',
                    error: error

                }

                console.log(data);
                res.send(data, data.code);

            } else {
                const dataToken = {
                    sub: response[0][0].id,
                    alias: response[0][0].nickname,
                    email: response[0][0].email,
                    descrip: response[0][0].descrip,
                    name: response[0][0].name,
                    url: response[0][0].img_user,
                    login: true,
                    date: Date.now()
    
                }

                const jwtA = new jwt();
                const token2 = jwtA.getToken(dataToken);

                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Se actualizo el usuario',
                    token: token2,
                    dataUser: dataToken,
                    user: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        console.log(data);
        res.send(data, data.code);

    }

});

// Delete User
router.delete('/deleteUser', (req, res) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_deleteUser(?)';
    const dataQuery = [user.user.sub];

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo eliminar el usuario',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Se eliminó el usuario',
                    user: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});


//
//  CONTROL DE USUARIO ADDRESS
//

// Create address
router.post('/addAddress', (req, res) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_createAddress(?,?,?,?,?,?)';
    const dataQuery = [
        user.user.sub,
        req.body.street,
        req.body.col,
        req.body.cp,
        req.body.city,
        req.body.state
    
    ]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo agreagr la direccion',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Se agregó la direccion',
                    address: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});

// Update address
router.put('/updateAddress', (req, res) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_updateAddress(?,?,?,?,?,?)';
    const dataQuery = [
        user.user.sub,
        req.body.street,
        req.body.col,
        req.body.cp,
        req.body.city,
        req.body.state
    
    ]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo actualizar la direccion',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Se actualizo la direccion',
                    address: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});

// Delete address
router.delete('/deleteAddress', (req, res) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_deleteAddress(?)';
    const dataQuery = [req.body.id]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo eliminar la direccion',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Se eliminó la direccion',
                    address: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});

// Get all addresses
router.get('/getAllAddress', (req, res) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_getAllAddress(?)';
    const dataQuery = [user.user.sub]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se recibio la direccion',
                    error: error

                }

                console.log(data);
                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Se recibió la direccion',
                    address: response[0]

                }

                console.log(data);
                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});

//
//  CONTROL DE USUARIO CART
//

// Add Product
router.post( '/addToCart', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    console.log('h')

    const query = 'CALL stp_addToCart(?,?,?,?)';
    const dataQuery = [
        user.user.sub,
        req.body.id,
        req.body.quantity,
        req.body.subtotal

    ]


    if ( user.user.login ) {
        console.log('hola')
        conn.query( query, dataQuery, ( error , response ) => {
            if ( error ) {
                console.log('hola')
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo añadir el producto al carrito',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Producto añadido al carrito exitosamente',
                    product: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});

// Update Product
router.put( '/updateProductInCart', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'updateProductInCart(?,?,?,?)';
    const dataQuery = [
        user.user.sub,
        req.body.id,
        req.body.quantity,
        req.body.subtotal

    ]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error , response ) =>{
            if ( error ) {
                var data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo actualizar el producto en el carrito',
                    error: error

                }

                res.send(data, data.code);

            } else {
                var data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Producto actualizado exitosamente',
                    product: response[0]

                }

                res.send(data, data.code);

            }
            
        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

})

// Delete Product
router.delete('/deleteInCart', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_deleteProductInCart(?,?)';
    console.log(user.user.sub, req.body.idProduct)
    const dataQuery = [
        user.user.sub,
        req.body.id

    ]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error , response ) =>{
            if ( error ) {
                var data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo eliminar el producto del carrito',
                    error: error

                }

                res.send(data, data.code);

            } else {
                var data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Producto eliminado exitosamente',
                    product: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

})

// Delete cart
router.delete('/deleteCart', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_deleteCart(?)';
    const dataQuery = [user.user.sub]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error , response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo eliminar el producto del carrito',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Producto eliminado exitosamente',
                    cart: response[0]

                }

                res.send(data, data.code);

            }
        })

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

})

// get cart
router.get('/getCart', (req,res) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_getCart(?)';
    const dataQuery = [user.user.sub]

    if ( user.user.login ) {
        conn.query( query, dataQuery, (error , response) =>{
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo eliminar el producto del carrito',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Producto obtenido exitosamente',
                    cart: response[0]
                }

                res.send(data, data.code);
            }
        
        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});

//
//  CONTROL DE USUARIO WISH
//
    
// Add product
router.post('/addToWishList', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_addProductInWish(?,?)';
    const dataQuery = [
        user.user.sub,
        req.body.idProduct

    ]
    
    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error , response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo añadir el producto al Wish List',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Producto añadido al Wish List exitosamente',
                    product: response[0]

                }

                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

});
    
// Delete product
router.delete('/deleteWishList', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_deleteProductOfWishList(?,?)';
    const dataQuery = [
        user.user.sub,
        req.body.idProduct

    ]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error , response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo eliminar el producto del Wish List',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Producto eliminado exitosamente del Wish List',
                    product: response[0]

                }

                res.send(data, data.code);

            }
        
        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

});

// Delet Wish
router.delete( '/deleteWish', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_deleteWish(?)';
    const dataQuery = [user.user.sub]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo eliminar productos del Wish List',
                    error: error

                }

                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Productos del Wish List eliminados exitosamente',
                    wish: response[0]
                }

                res.send(data, data.code);
            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

});

// get all wish
router.get('/getWishList', ( req,res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    const query = 'CALL stp_getWish(?)';
    const dataQuery = [user.user.sub]

    if ( user.user.login ) {
        conn.query( query, dataQuery, ( error , response ) =>{
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se pudo mostrar productos del Wish List',
                    error: error

                }

                console.log(data);
                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Productos del Wish List mostrados exitosamente',
                    wish: response[0]
                }

                res.send(data, data.code);
            }
        
        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }
    
});

//
//  CONTROL DE USUARIO SOLD 
//

// Create sold
router.post( '/createSold', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    if ( user.user.login ) {
        const query = 'CALL stp_createSold(?,?,?)';
        const dataQuery = [
            user.user.sub,
            req.body.cant,
            req.body.total

        ]

        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: No se creo la venta',
                    error: error
        
                }
        
                res.send(data, data.code);

            } else {
                console.log(response[0][0].id)
                const cart = req.body.cart;
                const id = response[0][0].id;
                let i = 0;
                const cnt = cart.length;

                cart.forEach(product => {
                    const query = 'CALL stp_createTicket(?,?,?,?)';
                    const dataQuery = [
                        id,
                        product.id,
                        product.cant_product,
                        product.sub_total

                    ]

                    conn.query( query, dataQuery, ( error, response ) => {
                        if ( error ) {
                            const data = {
                                status: 'error',
                                code: 400,
                                message: `Error: No se pudo guardar el producto ${product.id} en el ticket ${id}`,
                                error: error
                    
                            }
                    
                            res.send(data, data.code);

                        } else {
                            i++;

                            if ( i === cnt ) {
                                const data = {
                                    status: 'success',
                                    code: 200,
                                    message: `Success: Ticket creado correctamente ${id}`,
                                    ticket: cart
                        
                                }
                        
                                res.send(data, data.code);

                            }

                        }

                    });

                    
                });

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

});  

router.get( '/getAllSoldByUser', ( req, res ) => {
    const token = req.header('Authorization').replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

    if ( user.user.login ) {
        const query = 'CALL stp_getAllSoldByUser(?)';
        const dataQuery = [
            user.user.sub

        ]

        conn.query( query, dataQuery, ( error, response ) => {
            if ( error ) {
                const data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: Fallo en la BD',
                    error: error
        
                }
        
                res.send(data, data.code);

            } else {
                const data = {
                    status: 'success',
                    code: 200,
                    message: 'Success: Consulta hecha Correctamente',
                    sold: response[0]
        
                }
        
                res.send(data, data.code);

            }

        });

    } else {
        const data = {
            status: 'error',
            code: 400,
            message: 'Error: No esta logueado'

        }

        res.send(data, data.code);

    }

});

module.exports = router;