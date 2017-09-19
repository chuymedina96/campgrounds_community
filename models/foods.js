var mongoose = require("mongoose");
//Database Schema
var foodsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
      id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
var Food = mongoose.model("Food", foodsSchema);
module.exports = Food;
