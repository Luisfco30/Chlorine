const router = require('express').Router();
const bcrypt = require('bcryptjs');

const conn = require('../DB/conn');
const jwt = require('../Middleware/JwtAuth');

// Register
router.post( '/createAdmin', ( req, res ) => {
    const email = [req.body.name]
    const query = 'CALL stp_getUserAdminByName(?)';

    conn.query( query, email, ( error, response ) => {
        if ( error ) {
            var data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo crear el usuario',
                error: error

            }

            res.send(data, data.code);

        } else {
            if ( response[0][0] ) {
                var data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: El nombre ya esta registrado',
                    error: 'Email unique'

                }

                res.send(data, data.code);

            } else {
                bcrypt.genSalt( 10, ( error, salt ) => {
                    if ( error ) {
                        var data = {
                            status: 'error',
                            code: 400,
                            message: 'Error: No se pudo encriptar contraseña',
                            error: error
        
                        }
                        
                        res.send(data, data.code);

                    } else {
                        bcrypt.hash( req.body.password, salt, ( error, hash ) => {
                            if ( error ) {
                                var data = {
                                    status: 'error',
                                    code: 400,
                                    message: 'Error: No se pudo encriptar contraseña',
                                    error: error
                
                                }
                                
                                res.send(data, data.code);

                            } else {
                                const user = [
                                    req.body.name,
                                    hash

                                ]
                                const createUser = 'CALL stp_createAdmin(?,?)';

                                conn.query( createUser, user, ( error, response ) => {
                                    if ( error ) {
                                        var data = {
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
                                            login: true,
                                            date: Date.now()
                            
                                        }
                    
                                        const jwtA = new jwt();
                                        const token = jwtA.getToken(dataToken);

                                        var data = {
                                            status: 'success',
                                            code: 200,
                                            message: 'Success: Se creo el usuario correctamente',
                                            token: token,
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
router.post( '/loginAdmin', ( req, res ) => {
    const email = [req.body.name]
    const query = 'CALL stp_getUserAdminByName(?)';

    conn.query( query, email, ( error, response ) => {
        if ( error ) {
            var data = {
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
                        var data = {
                            status: 'error',
                            code: 400,
                            message: 'Error: No se pudo conectar a la bd',
                            error: error
            
                        }
            
                        res.send(data, data.code);

                    } else if ( result ) {
                        const dataToken = {
                            sub: response[0][0].id,
                            name: response[0][0].user_name,
                            login: true,
                            date: Date.now()
            
                        }
    
                        const jwtA = new jwt();
                        const token = jwtA.getToken(dataToken);

                        var data = {
                            status: 'success',
                            code: 200,
                            message: 'Success: Usuario logeado correctamente',
                            token: token,
                            user: dataToken

                        }
            
                        res.send(data, data.code);

                    } else {
                        var data = {
                            status: 'error',
                            code: 400,
                            message: 'Error: Contraseña invalida',
                            error: 'invalid password'
            
                        }
            
                        res.send(data, data.code);

                    }

                });

            } else {
                var data = {
                    status: 'error',
                    code: 400,
                    message: 'Error: Usuario invalido',
                    error: 'user null'
    
                }
    
                res.send(data, data.code);

            }

        }

    });

});

module.exports = router;