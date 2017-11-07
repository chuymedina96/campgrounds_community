var mongoose        = require("mongoose"),
    Food            = require("./models/foods.js"),
    Comment         = require("./models/comment.js");


var data = [
    {
        name: "Clouds Rest",
        image: "https://ichef-1.bbci.co.uk/news/660/cpsprodpb/1325A/production/_88762487_junk_food.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Awesomeness",
        image: "https://ichef-1.bbci.co.uk/news/660/cpsprodpb/1325A/production/_88762487_junk_food.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Another one",
        image: "https://ichef-1.bbci.co.uk/news/660/cpsprodpb/1325A/production/_88762487_junk_food.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "I made this post",
        image: "https://ichef-1.bbci.co.uk/news/660/cpsprodpb/1325A/production/_88762487_junk_food.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }

];

function seedDB(){
    //remove all food posts
    
    Food.remove({}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("You have removed all items from the database");
    }
    });
    data.forEach(function(seed){
        Food.create(seed, function(err, data){
            if(err){
                console.log(err);
            }else{
                console.log("Added a campground!");
                Comment.create(
                    {
                        text: "This place is awesome",
                        author: "Chuy"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }else{
                            data.comments.push(comment);
                            data.save();
                            console.log("Created new comment");
                        }
                    });
            }
        });

    });
}

module.exports =  seedDB;
