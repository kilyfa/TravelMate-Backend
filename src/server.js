const hapi = require('@hapi/hapi');
const routes = require('./route');

const init = async () => {
    const server = hapi.Server({
        port: 9000,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`server sedang berjalan di ${server.info.uri}`);
};

init();