const { addLocationHandler, getAllLocation, getLocationById } = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/location',
        handler: addLocationHandler,
    },
    {
        method: 'GET',
        path: '/location',
        handler: getAllLocation,
    },
    {
        method: 'GET',
        path: '/location/{locId}',
        handler: getLocationById,
    },
];

module.exports = routes;