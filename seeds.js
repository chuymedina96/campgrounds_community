var mongoose        = require("mongoose"),
    Campground      = require("./models/campground.js"),
    Comment         = require("./models/comment.js");
    
    
var data = [
    {
        name: "Clouds Rest",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pueblo_Mountains%2C_Oregon.jpg/1200px-Pueblo_Mountains%2C_Oregon.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Awesomeness",
        image: "http://media.istockphoto.com/photos/colorful-autumn-sunrise-in-the-caucasus-mountains-picture-id492940004?k=6&m=492940004&s=612x612&w=0&h=wKz59J3VCXaoJS5st4t7fF6S8UItfcHPUuodsrKyMlg=",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Another one",
        image: "http://www.blueridgecampgrounds.com/wp-content/uploads/2014/02/header1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "I made this post",
        image: "http://www.visitmysmokies.com/wp-content/uploads/2013/03/Sunset-Camping.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  
];

function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("You have removed all items from the database");
    }
    });
    data.forEach(function(seed){
        Campground.create(seed, function(err, data){
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
