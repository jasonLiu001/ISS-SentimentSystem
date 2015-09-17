var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
var ConfigInfo = require("./Config.js");

//router Module load
var apiRouter=require("./APIModule/APIRouter.js");
//var apiRouter=require("./router/apiRouter.js");
var authentication = require("./APIModule/authentication.js");

//expres config
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(ConfigInfo.BasicSettings.cookieSecret));
app.use(session({
    resave: true,
    saveUninitialized: true,
    proxy: true,
    secret: ConfigInfo.BasicSettings.cookieSecret,
    cookie: {
        maxAge: ConfigInfo.BasicSettings.cookieAge }
//    store: new RedisStore({
//        host: ConfigInfo.RedisSettings.host,
//        port: ConfigInfo.RedisSettings.port,
//        db: 188})
}));

app.use("/",apiRouter);
//app.use(authentication.IsLogined);
app.use(express.static(__dirname + '/public', ConfigInfo.ExpressStaticOption));
app.use(express.static(__dirname + '/app/'));
app.use(express.static(__dirname + '/samples/'));


//require("./router/apiRouter.js")(app);
////var apiRouter = require('./APIModule/APIRouter.js');
//var middlewareRt=require("./router/middlewareRouter.js");
//var manageRt=require("./router/manageRouter.js");
//var maintainRt=require("./router/maintainRouter.js");
//var authenticationRt=require("./router/authenticationRouter.js");
//
////app.use(apiRouter);
//app.use("/",middlewareRt);
//app.use("/api/manage",manageRt);
//app.use("/api/maintain",maintainRt);
//app.use("/api/authentication",authenticationRt);

app.listen(ConfigInfo.BasicSettings.sitePort, function () {
    console.log('Express server listening on port ' + ConfigInfo.BasicSettings.sitePort);
});


