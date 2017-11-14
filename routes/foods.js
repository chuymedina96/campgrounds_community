var express     = require("express"),
    router      = express.Router(),
    Food        = require("../models/foods.js"),
    Comment     = require("../models/comment.js"),
    middleware  = require("../middleware"),
    geocoder    = require("geocoder");

router.get("/", function(req, res){
    Food.find({}, function(err, allFoods){
        if(err){
            console.log("There has been an error!");
            console.log(err);
        } else{
            res.render("foods/index", {foods: allFoods});
        }
    });
});
//New post route
router.get("/new", middleware.isLoggedin, function(req,res){
    res.render("foods/new");
});
//Post route for New Post form
router.post("/", middleware.isLoggedin, function(req, res){
    var name        = req.body.name;
    var image       = req.body.image;
    var price       = req.body.price;
    var description = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    
    geocoder.geocode(req.body.location, function (err, data) {
    var location = data.results[0].formatted_address;
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var newFood = {name: name, price: price, image: image, description: description, author: author, location: location, lat: lat, lng: lng};
    Food.create(newFood, function(err, newlyCreated){
      console.log(req.user);
        if(err){
            console.log(err);
        } else{
          console.log(newlyCreated);
            res.redirect("/foods");
        }
    });
  });
});
//Show route for posts
router.get("/:id", function(req, res){
    // POPULATES THE COMMENTS PART OF THE CAMPGROUND SCHEMA WITH
    Food.findById(req.params.id).populate("comments").exec(function(err, foundFood){
        if(err){
            console.log(err);
        } else{
            res.render("foods/show", {food: foundFood});
        }
    });
});
router.get("/:id/edit", middleware.checkFoodOwnership,function(req, res){
  Food.findById(req.params.id, function(err, foundFood){
    res.render("foods/edit", {food: foundFood});
  });
});
router.put("/:id", function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Food.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, food){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/foods/" + food._id);
        }
    });
  });
});
router.delete("/:id", middleware.checkFoodOwnership,function(req, res){
  Food.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/foods");
    }else{
      res.redirect("/foods");
    }
  });
});
//Middleware for checking ownership of post
module.exports = router;
