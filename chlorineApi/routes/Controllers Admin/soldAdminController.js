const router = require('express').Router();

const conn = require('../DB/conn');

router.get( '/getAllSold', ( req, res ) => {
    const query = 'CALL stp_getAllTicket()';

    conn.query( query, ( error, response ) => {
        if ( error ) {
            const data = {
                status: 'error',
                code: 400,
                message: 'Error: No se pudo traer las ventas',
                error: error

            }

            res.send(data, data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Ventas obtenidos exitosamente',
                sold: response[0]

            }

            res.send(data, data.code);

        }

    });

});

router.get('/getAllSoldByDate/:date', (req ,res) => {
    console.log(req.params.date);
    const query = 'CALL stp_getAllSoldByDate(?)';
    const dataQuery = [
        req.params.date
    ]

    conn.query( query,dataQuery ,  ( error , response) =>{ 
        if ( error ){
            const data ={
                status: 'error',
                code: 400,
                message: 'Error: Error al Ventas/Date obtenidas',
                error: error
            }
            res.send(data , data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Ventas/Date Obtenidas',
                sold: response[0]
            
            }
            res.send(data , data.code);
        }

    });


});

router.get('/getAllSoldByMonth/:date', (req ,res) => {
    console.log(req.params.date);
    const query = 'CALL stp_getAllSoldByMonth(?)';
    const dataQuery = [
        req.params.date
    ]

    conn.query( query,dataQuery ,  ( error , response) =>{ 
        if ( error ){
            const data ={
                status: 'error',
                code: 400,
                message: 'Error: Error al Ventas/Date obtenidas',
                error: error
            }
            res.send(data , data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Ventas/Date Obtenidas',
                sold: response[0]
            
            }
            res.send(data , data.code);
        }

    });


});

router.delete( '/deleteSoldById/:id', ( req, res ) => {
    const query = 'CALL stp_deleteSold(?)';
    const dataQuery = [
        req.params.id
    ]

    conn.query( query,dataQuery ,  ( error , response) =>{ 
        if ( error ){
            const data ={
                status: 'error',
                code: 400,
                message: 'Error: Error al Ventas/Date obtenidas',
                error: error
            }
            res.send(data , data.code);

        } else {
            const data = {
                status: 'success',
                code: 200,
                message: 'Success: Ventas/Date Obtenidas',
                sold: response[0]
            
            }
            res.send(data , data.code);
        }

    });


})

module.exports = router;