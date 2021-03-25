const jwt = require('jsonwebtoken');
require('dotenv').config( { path: 'variables.env' } );

class JwtAuth {
    token;
    usuario;

    constructor(token = '') {
        this.token = token;

    }

    getToken(usuario = {},  bool = true ) {
        if ( bool ) {
            this.token = jwt.sign( usuario, process.env.SECRET, { expiresIn: '24h' } );
            return this.token;

        } else {
            try {
                this.usuario = jwt.verify( this.token, process.env.SECRET );
                console.log(this.token, this.usuario);
                return {
                    status: 'success',
                    user: this.usuario

                };

            } catch (error) {
                console.log(this.token, this.usuario, error);
                return {
                    status: 'error',
                    message: 'Error al devolver el usuario',
                    error: error
                };
                
            }

        }
        
    }

}

module.exports = JwtAuth;