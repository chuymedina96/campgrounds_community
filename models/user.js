var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  image: String,
  username: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);
module.exports =  User
