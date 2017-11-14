//Modules
var express               = require("express"),
    methodOverride        = require("method-override"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash                 = require("connect-flash"),
    http                  = require("http");
//Using express
var app                   = express();
//Models
var Food                  = require("./models/foods.js"),
    Comment               = require("./models/comment.js"),
    User                  = require("./models/user.js");
//Routes
var foodRoutes            = require("./routes/foods.js"),
    commentsRoutes        = require("./routes/comments.js"),
    indexRoutes           = require("./routes/index.js");
    profileRoutes         = require("./routes/profile.js");
//Seeding the database
var seedDB                = require("./seeds.js");
//seedDB(); //function seeds database and adds starter data.

//Connecting MongoDB
var url = process.env.DATABASEURL || "mongodb://localhost/foody_app"
mongoose.connect(url), {useMongoClient: true};
console.log(url);
//Public Dir and bodyParser  
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
  secret: "Chuy is awesome",
  resave: false,
  saveUninitialized: false
}));
//Passport
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});
//View engine
app.set("view engine", "ejs");
//Using routes
app.use("/", indexRoutes);
app.use("/foods", foodRoutes);
app.use("/foods/:id/comments", commentsRoutes);
app.use("/profiles", profileRoutes);
// 404 PAGE
app.get("*", function(req, res){
    var image={
        pic: "https://i.imgflip.com/663zn.jpg"
    };
    res.render("404", {image:image});
});
//SERVER and Heroku Dyno
setInterval(function() {
    http.get("http://food-me-please.herokuapp.com/");
}, 300000); // pings the server every 5 minutes preventing dyno sleep (300000)
app.listen(process.env.PORT || 3000, function(){
  console.log("Server has started! Yeah!");
});
//Playing around with Yahoo`s weather api
/*app.get("/yahoo", function(req, res){
    request("https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(error, responce, body){
    if(!error && responce.statusCode === 200) {
        var data = JSON.parse(body);

        console.log("Sunset time in Hawaii is at " + data["query"]["results"]["channel"]["astronomy"]["sunset"]);
    }
    });
});*/
