const router = require('express').Router();

const conn = require('../DB/conn');

// get all
router.get( '/getAllProduct', ( req, res ) => {
    const query = 'CALL stp_getAllProduct()';

    conn.query( query, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo cargar los productos',
                error: error

            }

            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Se cargaron los productos correctamente',
                product: response[0]

            }

            res.send(data, data.code);

        }

    });

});

// get bestSellers
router.get( '/getBestSellersProduct', ( req, res ) => {
    const query = 'CALL stp_getBestSellersProduct()';

    conn.query( query, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo cargar los productos',
                error: error

            }

            console.log(data);
            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Se agregaron los productos correctamente',
                product: response[0]

            }

            res.send(data, data.code);

        }

    });

});

// get off
router.get( '/getOffProduct', ( req, res ) => {
    const query = 'CALL stp_getOffProduct()';

    conn.query( query, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo cargar los productos',
                error: error

            }

            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Se agregaron los productos correctamente',
                product: response[0]

            }

            res.send(data, data.code);

        }

    });

});

// get for categories
router.get( '/getByCategory/:id', ( req, res ) => {
    const query = 'CALL stp_getByCategory(?)';
    const dataQuery = [req.params.id];

    conn.query( query, dataQuery, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo cargar los productos',
                error: error

            }

            console.log(data);
            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Se agregaron los productos correctamente',
                product: response[0]

            }

            console.log(data);
            res.send(data, data.code);

        }

    });

});

// get for price
router.get( '/getPriceProduct', ( req, res ) => {
    const query = 'CALL stp_getPriceProduct(?,?)';
    const dataQuery = [
        req.body.min,
        req.body.max

    ]

    conn.query( query, dataQuery, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo cargar los productos',
                error: error

            }

            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Se agregaron los productos correctamente',
                product: response[0]

            }

            res.send(data, data.code);

        }

    });

});

module.exports = router;