const { postUserHandler, getUserByNameHandler, getProfileHandler, updateUserHandler, postActivityHandler, getHistoryHandler, getHistoryByIdHandler } = require("./handler");
const upload = require("../middleware/upload");

const routes = [
  {
    method: "POST",
    path: "/signup",
    handler: postUserHandler,
    options: {
      pre: [upload.single("image")],
    },
  },
  {
    method: "POST",
    path: "/signin",
    handler: getUserByNameHandler,
  },
  {
    method: "GET",
    path: "/home/profile",
    handler: getProfileHandler,
  },
  {
    method: "PUT",
    path: "/update",
    handler: updateUserHandler,
  },
  {
    method: "POST",
    path: "/activities",
    handler: postActivityHandler,
  },
  {
    method: "GET",
    path: "/home/history",
    handler: getHistoryHandler,
  },
  {
    method: "GET",
    path: "/home/history/{id}",
    handler: getHistoryByIdHandler,
  },
];

module.exports = routes;
