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

router.post("/", isLoggIn,function (req, res) {
    var name = req.body.campname;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author}
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

router.get("/new", isLoggIn ,function (req, res) {
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership,function(req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground){
       if(err) {
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id); 
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership,function (req, res) {
    Campground.findOneAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");            
        }
    });
});

 // Middleware
function isLoggIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

 module.exports = router;