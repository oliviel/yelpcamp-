var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Woodside", 
        image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ffdbb5e90a2c129258d4540ef0f29d06&auto=format&fit=crop&w=1950&q=80",
        description: "Singalongs and s'mores by the campfire, morning Reveille, sneaking around the lake to gawk at the girls or boys in the sister/brother camp: the rituals of summer sleep-away camp are beloved and time honored. Like university, there are endless options but for a certain set, there are really only a few: the Ivy League of summer camps."
    },
    
    {
        name: "Vermont", 
        image: "https://images.unsplash.com/photo-1460230574880-9d3903edc9d6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a61b4e43cfe2ae51c2cbb857d3f87b12&auto=format&fit=crop&w=1952&q=80",
        description: "The best camp between rocks"
    },

    {
        name: "Mother aridi", 
        image: "https://images.unsplash.com/photo-1452473767141-7c6086eacf42?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=938b994df7f39bbdecac7dd53a3b95cb&auto=format&fit=crop&w=1950&q=80",
        description: "The oldest camp of all"
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;