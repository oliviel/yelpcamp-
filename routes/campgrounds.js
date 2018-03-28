var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX SHOW ALL THE CAMPGROUNDS
router.get("/", function (req, res) {
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

router.post("/", function (req, res) {
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
    });
});

router.get("/new", function (req, res) {
    res.render("campgrounds/new"); 
 });

//SHOW more info about one campgrounds
router.get("/:id", function (req, res) {
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

 module.exports = router;