const request = require("request");
let Note = require("../models/Note.js");
let Article = require("../models/Article.js");
var path = require("path");

let scrapedArticles = [];
let existingArticles = [];
let newArticles = [];
let articleMatch = false;

module.exports = function(app) {

    // get route to return all articles in the database
    app.get("/all", function(req, res) {
        
        Article.find({}, function(error, data) {

            if (error) {
                console.log(error);
            }
            else {
                console.log(data);
                res.json(data);
            }
        });
    });

    // post route delete an article from the database
    // receives req.body.title and uses that to compare with existing articles
    app.post("/delete", function(req, res) {

        Article.findOneAndRemove({headline: req.body.headline}, function(error, data) {

            if(error) {
                console.log(error);
            }

            else res.json(data);
        });
    })

    // post route to delete a note from the database
    app.post("/note/delete/:id", function(req, res) {

        Note.findOneAndRemove({ _id: req.params.id }, function(error, data) {

            if(error) {
                console.log(error);
            }
            else {
                // then find the associate article from the req.params.id
                Article.update({ _id: req.body.articleID }, { $pull: {"notes": req.params.id }}).exec(function(error, data) {
                    res.json(data);
                });
            }
        });
    });

    app.get("/notes/:id", function(req, res) {

        Article.find({ _id: req.params.id })
        .populate("notes")
        .exec(function(error, data) {

            if(!data[0].notes) {
                res.send(null);
            }
            
            else {
                res.json(data);
            }
        });
    });

    // post route to add a new note to the database
    app.post("/note/:id", function(req, res) {

        let newNote = Note(req.body);

        newNote.save(req.body, function(error, doc) {

            // then find the associate article from the req.params.id
            Article.findOneAndUpdate({ _id: req.params.id }, { $push: {"notes": doc._id} }).exec(function(error, data) {

                res.json(data);
            });
        });
    });

    app.post("/save", function(req, res) {

        let newArticle = Article({
            headline: req.body.headline,
            date: req.body.date,
            url: req.body.url
        });

        newArticle.save(function(error, data) {
            if(error) {
                console.log(error);
            }
            console.log("data: " + data);
            res.json(data);
        });
    });
    
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  
}