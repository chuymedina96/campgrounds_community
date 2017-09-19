var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Food        = require("../models/foods.js"),
    Comment     = require("../models/comment.js"),
    middleware  = require("../middleware");

//GET Route for creating a new comment for individual post/campgrounds
router.get("/new",middleware.isLoggedin,function(req,res){
    console.log(req.params.id);
    Food.findById(req.params.id, function(err, food){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {food: food});
        }
    });
});
//POST route for posting comment to show page for individual posts
router.post("/",middleware.isLoggedin,function(req,res){
    Food.findById(req.params.id, function(err, food){
        if(err){
            req.flash("error", "Hmm, something went wrong...")
            console.log(err);
            res.redirect("/foods");
        }else{
            console.log(req.body.comment);
            //creating a new comment
            Comment.create(req.body.comment, function(err, comment){
              console.log("Username for this comment will be:" + req.user.username);
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to campground
                    food.comments.push(comment);
                    food.save();
                    console.log(comment);
                    req.flash("success", "Successfully created comment!")
                    res.redirect("/foods/"+ food._id);
                }
            });
        }
    });
});
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      console.log(err);
      res.redirect("back");
    }else{
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});
router.put("/:comment_id",middleware.checkCommentOwnership,function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      console.log(err);
      res.redirect("back");
    } else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "Comment deleted! :)");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
