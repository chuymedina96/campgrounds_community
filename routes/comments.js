var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground.js"),
    Comment     = require("../models/comment.js");
//Checks to see if user if logged in
function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};
//GET Route for creating a new comment for individual post/campgrounds
router.get("/campgrounds/:id/comments/new",isLoggedin,function(req,res){
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});
//POST route for posting comment to show page for individual posts
router.post("/campgrounds/:id/comments", isLoggedin, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
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
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});
router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      console.log(err);
      res.redirect("back");
    }else{
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});
router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      console.log(err);
      res.redirect("back");
    } else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
function checkCommentOwnership(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        console.log(err);
        res.redirect("back");
      }else{
        if(foundComment.author.id.equals(req.user._id)){
            next();
        }else{
          res.redirect("back");
        }
      }
    });
  }else{
    res.redirect("back");
  }
};

module.exports = router;
