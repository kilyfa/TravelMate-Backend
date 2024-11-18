const hapi = require('@hapi/hapi');
const routes = require('./route');
require('dotenv').config();
const InputError = require('../exceptions/InputError');
const jwt = require('jsonwebtoken');

const init = async () =>  {
    const server = hapi.Server({
        port: 8080,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0'
    });

    server.route(routes);

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response instanceof InputError) {
            return h.response({
                status: 'fail',
                message: response.message
            }).code(response.statusCode);
        }
        return h.continue;
    });

    server.ext('onRequest', async (request, h) => {
        const token = request.headers['authorization']?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                request.user = decoded;
            } catch (error) {
                return h.response({ error: 'Invalid token' }).code(401);
            }
        }
        return h.continue;
    });

    await server.start();
    console.log(`server sedang berjalan di ${server.info.uri}`);
}

init();