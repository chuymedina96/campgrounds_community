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
router.get("/campgrounds/:id/comments/:comment_id/edit", isLoggedin, function(req, res){
  res.render("comments/edit");
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

module.exports = router;
