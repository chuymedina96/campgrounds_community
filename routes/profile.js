var express     = require("express"),
    router      = express.Router(),
    Food        = require("../models/foods.js"),
    Comment     = require("../models/comment.js"),
    User        = require("../models/user.js"),
    middleware  = require("../middleware");

router.get("/profile", middleware.isLoggedin,function(req, res){
  res.render("profile/index");
});




module.exports = router;
