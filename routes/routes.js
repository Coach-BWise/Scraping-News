var db = require("../models");
var commentController = require("./notesController");
var scrape = require("../scraper");

module.exports = function (router) {
  router.get("/", function (req, res) {
    res.render("index", { title: "Current Events" });
  });
  router.get("/saved", function (req, res) {
    res.render("saved", { title: "Saved Articles" });
  });
  router.get("/scrape", function (req, res) {
    scrape(function (data) {
      db.Article.insertMany(data).then(res.json(data));
    });
  });
  // Route for getting all Articles from the db
  router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    var query = {};
    if (req.query.saved) {
      query = req.query;
    }
    db.Article.find(query)
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  router.delete("/articles:id", function (req, res) {
    var query = {};
    query._id = req.params.id;
    db.Article.deleteOne(query, function (err, data) {
      res.json(data);
    });
  });

  router.patch("/articles", function (req, res) {
    db.Article.updateOne(
      { _id: req.body._id },
      {
        $set: req.body,
      },
      {},
      function (err, data) {
        res.json(data);
      }
    );
  });

  router.get("/comments:article_id?", function (req, res) {
    var query = {};
    if (req.params.article_id) {
      query._id = req.params.article_id;
    }

    commentController.get(query, function (err, data) {
      res.json(data);
    });
  });

  router.delete("/comments:id", function (req, res) {
    var query = {};

    query._id = req.params.id;
    commentController.delete(query, function (err, data) {
      res.json(data);
    });
  });

  router.post("/comments", function (req, res) {
    commentController.save(req.body, function (data) {
      res.json(data);
    });
  });
};
