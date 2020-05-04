var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var commentController = require("./notesController");

module.exports = function (router) {
  router.get("/", function (req, res) {
    res.render("index");
  });
  router.get("/saved", function (req, res) {
    res.render("saved");
  });
  router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.tampabay.com/news").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".feed-item .story-item").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).find("a").text();
        result.link = "https://tampabay.com" + $(this).find("a").attr("href");
        result.topic = $(this).find(".sectionbullet").text().trim();
        result.time = $(this).find(".timestamp").text();

        // Create a new Article using the `result` object built from scraping

        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // Send a message to the client
      res.send("Scrape Completed");
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

  router.delete("/articles/:id", function (req, res) {
    var query = {};
    query._id = req.params.id;
    Article.remove(query, function (err, data) {
      res.json(data);
    });
  });

  router.patch("/articles", function (query, cb) {
    Article.update(
      { _id: query._id },
      {
        $set: query,
      },
      {},
      cb
    );
  });

  router.get("/comments/:article_id?", function (req, res) {
    var query = {};
    if (req.params.article_id) {
      query._id = req.params.article_id;
    }

    notesController.get(query, function (err, data) {
      res.json(data);
    });
  });

  router.delete("/comments/:id", function (req, res) {
    var query = {};

    query._id = req.params.id;
    notesController.delete(query, function (err, data) {
      res.json(data);
    });
  });

  router.post("/comments", function (req, res) {
    notesController.save(req.body, function (data) {
      res.json(data);
    });
  });
};
