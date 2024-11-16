const hapi = require("@hapi/hapi");
const routes = require("./route");

const init = async () => {
  const server = hapi.Server({
    port: process.env.PORT || 8000,
    host: "0.0.0.0",
  });

  server.route(routes);

  await server.start();
  console.log(`server sedang berjalan di ${server.info.uri}`);
};

init();
