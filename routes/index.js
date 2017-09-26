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
  var newUser = new User({firstName: req.body.firstName, lastName: req.body.lastName, image: req.body.image, username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.render("register");
    }
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to the site, " + user.firstName);
        res.redirect("/foods");
      });
  });
});
router.get("/login", function(req, res){
  res.render("login");
});
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/foods",
    failureRedirect: "/login"
  }),
  function(req, res){
});
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Successfully logged Out! :)");
  res.redirect("/foods");
});

module.exports = router;
