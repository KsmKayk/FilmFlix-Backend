const { Router } = require("express");
const service = require("./service");

const routes = Router();

routes.post("/searchFilm", service.searchFilm);
routes.post("/selectFilm", service.selectFilm);

module.exports = routes;
