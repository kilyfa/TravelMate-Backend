const { postUserHandler, getProfileHandler, updateUserHandler, postActivityHandler, getHistoryHandler, getHistoryByIdHandler, postImageProfileHandler, getUserByEmailHandler, deleteOnprogressHandler, deleteAndPostHandler, getProgressHandler, getProgressByIdHandler, displayPlaceHandler, getRecomendationHandler, getRecomendationByIdHandler } = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/signup",
    handler: postUserHandler,
  },
  {
    method: "POST",
    path: "/signin",
    handler: getUserByEmailHandler,
  },
  {
    method: "GET",
    path: "/home/profile",
    handler: getProfileHandler,
  },
  {
    method: "PUT",
    path: "/reset",
    handler: updateUserHandler,
  },
  {
    method: "POST",
    path: "/home/activities/{placeId}",
    handler: postActivityHandler,
  },
  {
    method: "GET",
    path: "/home/history",
    handler: getHistoryHandler,
  },
  {
    method: "GET",
    path: "/home/progress",
    handler: getProgressHandler,
  },
  {
    method: "GET",
    path: "/home/history/{id}",
    handler: getHistoryByIdHandler,
  },
  {
    method: "GET",
    path: "/home/progress/{id}",
    handler: getProgressByIdHandler,
  },
  {
    method: "POST",
    path: "/home/profile/image",
    handler: postImageProfileHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    method: "DELETE",
    path: "/home/progress/{progressId}",
    handler: deleteAndPostHandler
  },
  {
    method: "GET",
    path: "/home",
    handler: displayPlaceHandler,
  },
  {
    method: "POST",
    path: "/home/recomendation",
    handler: getRecomendationHandler
  },
  {
    method: "GET",
    path: "/home/recomendation/{id}",
    handler: getRecomendationByIdHandler
  }
];

module.exports = routes;
