//Modules
var express               = require("express"),
    app                   = express(),
    bodyParser            = require('body-parser'),
    request               = require("request"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
//Models
var Campground            = require("./models/campground.js"),
    Comment               = require("./models/comment.js"),
    User                  = require("./models/user.js");
//Routes
var campgroundsRoutes     = require("./routes/campgrounds.js"),
    commentsRoutes        = require("./routes/comments.js"),
    indexRoutes           = require("./routes/index.js");
//Seeding the database
var seedDB                = require("./seeds.js");
seedDB(); //function seeds database and adds starter data.

//Connecting MongoDB
mongoose.connect("mongodb://localhost/camp_spot", {useMongoClient: true});
//Main Routes

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
  secret: "Chuy is awesome",
  resave: false,
  saveUninitialized: false
}));
//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});
function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};
//View engine
app.set("view engine", "ejs");
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use(commentsRoutes);
// 404 PAGE
app.get("*", function(req, res){
    var image={
        pic: "https://i.imgflip.com/663zn.jpg"
    };
    res.render("404", {image:image});
});
//SERVER
app.listen(3000, function(){
    console.log("Your server has started yoo!");
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
