const router = require('express').Router();
const bcrypt = require('bcryptjs');

const conn = require('../DB/conn');
const jwt = require('../Middleware/JwtAuth');

// Delete
router.delete( '/deleteClient', ( req, res ) => {
    console.log(req.body.id);
    const token = req.header('Authorization').replace(/"/g, '');
    let jwtA = new jwt(token);
    console.log(req.body.id);
    console.log(jwtA.getToken({}, false));
    const user = jwtA.getToken({}, false);
    console.log(user);

    const idUser = [req.body.id];
    const query = 'CALL stp_deleteUser(?)';

    if ( user.user.login ) {
        conn.query( query, idUser, ( error, response ) => {
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
            message: 'Error: No esta logueado',
            error: error

        }

        res.send(data, data.code);

    }

});

// get all
router.get( '/getAllClient', ( req, res ) => {
    const query = 'CALL stp_getAllClient()';

    conn.query( query, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo hacer la consulta',
                error: error

            }

            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Consulta hecha correctamente',
                client: response[0]

            }

            res.send(data, data.code);

        }

    });

});

// get by most sold
router.get( '/getMostSoldClient', ( req, res ) => {
    const query = 'CALL stp_getMostSoldClient()';

    conn.query( query, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo hacer la consulta',
                error: error

            }

            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Consulta hecha correctamente',
                client: response[0]

            }

            res.send(data, data.code);

        }

    });

});

// get by more time
router.get( '/getMoreOldClient', ( req, res ) => {
    const query = 'CALL stp_getMoreOldClient()';

    conn.query( query, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo hacer la consulta',
                error: error

            }

            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Consulta hecha correctamente',
                client: response[0]

            }

            res.send(data, data.code);

        }

    });

});

module.exports = router;