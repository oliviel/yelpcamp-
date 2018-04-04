var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleWare = require("../middleware/index");

// Comments new 
router.get("/new", middleWare.isLoggIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err || !campground) {
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// Comments create 
router.post("/", middleWare.isLoggIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment) {
            if(err){
                console.log(err);
            } else {
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username; 
                // save comment 
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                req.flash("success", "Succesfully added comment");
                res.redirect("/campgrounds/" + campground._id);
            }
         });
        }
    });
});

// COMMENT EDIT ROUTE 
router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, founCampground) {
        if (err || !founCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
            }
        });
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id );
       }
    });
});

// COMMENT DESTORY ROUTE 
router.delete("/:comment_id", middleWare.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
