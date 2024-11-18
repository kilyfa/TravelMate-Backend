const { postUserHandler, getUserByNameHandler, getProfileHandler, updateUserHandler, postActivityHandler, getHistoryHandler, getHistoryByIdHandler } = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/signup',
        handler: postUserHandler,
    },
    {
        method: 'POST',
        path: '/signin',
        handler: getUserByNameHandler,
    },
    {
        method: 'GET',
        path: '/home/profile',
        handler: getProfileHandler,
    },
    {
        method: 'PUT',
        path: '/update',
        handler: updateUserHandler,
    },
    {
        method: 'POST',
        path: '/home/activity',
        handler: postActivityHandler
    },
    {
        method: 'GET',
        path: '/home/history',
        handler: getHistoryHandler,
    },
    {
        method: 'GET',
        path: '/home/history/{id}',
        handler: getHistoryByIdHandler,
    }
];

module.exports = routes;