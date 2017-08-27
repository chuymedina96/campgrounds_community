var express               = require("express"),
    app                   = express(),
    bodyParser            = require('body-parser'),
    request               = require("request"),
    mongoose              = require("mongoose"),
    Campground            = require("./models/campground.js"),
    Comment               = require("./models/comment.js"),
    User                  = require("./models/user.js"),
    seedDB                = require("./seeds.js"),
    passport              = require("passport");
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

seedDB();
mongoose.connect("mongodb://localhost/camp_spot", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(require("express-session")({
  secret: "Chuy is awesome",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*Campground.create({
    name: "Cool",
    image: "http://www.wildnatureimages.com/images%203/060731-346..jpg"
}, function(err, campground){
    if(err){
        console.log("Theres been an error");
        console.log(err);
    } else {
        console.log("New campground!");
        console.log(campground);
    }
});*/
// Basic REST routes for root, sign up, and login
app.get("/", function(req, res){
    res.render("landing");
});
//REGISTER LOGIC
app.get("/register", function(req, res){
  res.render("register");
});
app.post("/register", function(req, res){
  req.body.username
  req.body.password
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds");
      });
  });
});
//LOGIN LOGICS
function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};
app.get("/login", function(req, res){
  res.render("login");
});
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res){
});
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("There has been an error!");
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
//route for creating new posts
app.get("/campgrounds/new", isLoggedin, function(req,res){
    res.render("campgrounds/new");
});
//post route for new campgrounds form
app.post("/campgrounds", isLoggedin, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newGround = {name: name, image: image, description: description};
    Campground.create(newGround, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});
//ROUTE for displaying the show page for individual posts/campgrounds
//Using Mongodb posts id: "Campgrounds.findByID".
app.get("/campgrounds/:id", function(req, res){
    // POPULATES THE COMMENTS PART OF THE CAMPGROUND SCHEMA WITH
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//GET Route for creating a new comment for individual post/campgrounds
app.get("/campgrounds/:id/comments/new",isLoggedin,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});
//POST route for posting comment to show page for individual posts
app.post("/campgrounds/:id/comments", isLoggedin, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log(req.body.comment);
            //creating a new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});
// ROUTE FOR 404 PAGE
app.get("*", function(req, res){
    var image={
        pic: "https://i.imgflip.com/663zn.jpg"
    };
    res.render("404", {image:image});
});
//SERVER CONFIG
app.listen(3000, function(){
    console.log("Your server has started yoo!");
});

/*app.get("/yahoo", function(req, res){
    request("https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(error, responce, body){
    if(!error && responce.statusCode === 200) {
        var data = JSON.parse(body);

        console.log("Sunset time in Hawaii is at " + data["query"]["results"]["channel"]["astronomy"]["sunset"]);
    }
    });
});*/
