var express       = require("express"),
    router        = express.Router(),
    passport      = require("passport"),
    User          = require("../models/user.js");
//Checks if user is logged in
//Root
router.get("/", function(req, res){
    res.render("landing");
});
//REGISTER LOGIC
router.get("/register", function(req, res){
  res.render("register");
});
router.post("/register", function(req, res){
  var newUser = new User({firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong, perhaps the username may be taken already!");
      return res.render("register");
    }
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to the site, " + user.firstName);
        res.redirect("/campgrounds");
      });
  });
});
router.get("/login", function(req, res){
  res.render("login");
});
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res){
});
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Successfully logged Out! :)");
  res.redirect("/campgrounds");
});

module.exports = router;
