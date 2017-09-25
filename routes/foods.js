var express     = require("express"),
    router      = express.Router(),
    Food        = require("../models/foods.js"),
    Comment     = require("../models/comment.js"),
    middleware  = require("../middleware");

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
    var newFood = {name: name, price: price, image: image, description: description, author: author};
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
router.put("/:id", middleware.checkFoodOwnership,function(req, res){
  Food.findByIdAndUpdate(req.params.id, req.body.food, function(err, updatedPost){
    if(err){
      console.log(err);
      res.redirect("/foods");
    }else{
      res.redirect("/foods/" + req.params.id);
    }
  })
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
