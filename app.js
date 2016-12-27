var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressHbs = require("express-handlebars");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var validator = require("express-validator");
var MongoStore = require("connect-mongo")(session);

var routes = require("./routes/index");
var userRoutes = require("./routes/user");

var app = express();

//mongoose.connect("mongodb://localhost/shopping-cart");
mongoose.connect("mongodb://Vikram_Kalta:boomshankar1@ds145208.mlab.com:45208/sellstuff");

require("./config/passport");

app.engine(".hbs", expressHbs({defaultLayout: "layout", extname: ".hbs"}));
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: "mysupersecret", 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
   res.locals.login = req.isAuthenticated();
   res.locals.session = req.session;
   next();
});

app.use("/user", userRoutes);
app.use("/", routes);

app.use(function(req,res, next){
    var err = new Error("not found");
    err.status = 404;
    next(err);
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Shopping cart");
});
