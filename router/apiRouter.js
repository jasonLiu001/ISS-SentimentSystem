var middlewareRt = require("./middlewareRouter.js");
var manageRt = require("./manageRouter.js");
var maintainRt = require("./maintainRouter.js");
var authenticationRt = require("./authenticationRouter.js");

module.exports = function (app) {
    app.use(middlewareRt);
    app.use(manageRt);
    app.use(maintainRt);
    app.use(authenticationRt);
};