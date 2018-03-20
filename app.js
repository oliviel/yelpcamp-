var express     = require("express");
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    //Get all the campgrounds from the database 
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("THERE IS AN ERROR LOOK THE CODE SLAVE");
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.campname;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    //Create a new campground and save to the database
    Campground.create(newCampground, function (err, newCampground) {
        if (err) {
            console.log("THERE IS SOMETHING WORNG CHECK THE CODE SLAVE");
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new"); 
 });

//SHOW more info about one campgrounds
 app.get("/campgrounds/:id", function (req, res) {
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log("SOMETHING WENT WRONG");
            console.log(err);
        } else {
            //Render show template with that campground 
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
 });

 //============================
//  COMMENTS ROUTES
 //============================

 app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

 app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
 });

app.listen(3000, function () {
    console.log("the Yelcamp server is fighting");
});